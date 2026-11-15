import axios from 'axios';
import Cookies from 'js-cookie';

// Workspace API on api.plotune.net (docs/architecture/workspace-contract.md, section 5).
//
// This client has its own axios instance on purpose. src/services/api.js signs the user out and
// redirects on any 401; here a 401 is reported to the caller as a WorkspaceFailure so the page can
// keep the request (for example the consent request) when it sends the user to sign in.
export const PLOTUNE_API_ORIGIN = process.env.REACT_APP_PLOTUNE_API_ORIGIN || 'https://api.plotune.net';

export class WorkspaceFailure extends Error {
  constructor(status, code, serverMessage = '', retryAfter = null) {
    super(serverMessage || code);
    this.name = 'WorkspaceFailure';
    this.status = status;
    this.code = code;
    this.serverMessage = serverMessage;
    this.retryAfter = retryAfter;
  }
}

// The auth_token cookie stores the credential with its "Bearer " prefix; normalize before use.
export const sessionAuthorization = () => {
  const token = Cookies.get('auth_token');
  return token ? `Bearer ${String(token).replace(/^Bearer\s+/i, '')}` : '';
};

const parseRetryAfter = (value) => {
  const seconds = Number.parseInt(value, 10);
  return Number.isFinite(seconds) && seconds > 0 && seconds <= 3600 ? seconds : null;
};

const segment = encodeURIComponent;
const asArray = (value) => (Array.isArray(value) ? value : []);

// The detail response, reduced to what the pages use. Members and viewers get no e-mail addresses.
export function normalizeWorkspace(body) {
  const workspace = body?.workspace || {};
  return {
    id: workspace.id,
    name: workspace.name || '',
    revision: workspace.revision,
    role: body?.role,
    members: asArray(body?.members).map((member) => ({
      accountId: member.accountId,
      displayName: member.displayName || member.email || 'Member',
      role: member.role,
      email: member.email || null,
    })),
    invites: asArray(body?.invites).map((invite) => ({ email: invite.email, role: invite.role })),
    projects: asArray(body?.projects).map((project) => ({
      id: project.id,
      name: project.name,
      revision: project.revision,
      services: asArray(project.services).map((entry) => (typeof entry === 'string' ? entry : entry?.service)).filter(Boolean),
    })),
  };
}

export function createWorkspaceClient({
  http = axios.create({
    baseURL: PLOTUNE_API_ORIGIN,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
    validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
  }),
  authorization = sessionAuthorization,
} = {}) {
  // Detail snapshots by session and workspace, in memory only (never storage). Cleared with the page.
  const details = new Map();

  async function call(method, path, { body, headers, params, signal } = {}) {
    const auth = authorization();
    if (!auth) throw new WorkspaceFailure(401, 'no_session', 'Sign in to continue.');
    try {
      return await http.request({
        method,
        url: path,
        data: body,
        params,
        signal,
        headers: { Authorization: auth, ...headers },
      });
    } catch (error) {
      if (error?.code === 'ERR_CANCELED') throw error;
      if (error?.response) {
        const { status, data, headers: responseHeaders } = error.response;
        throw new WorkspaceFailure(
          status,
          data?.error?.code || `http_${status}`,
          typeof data?.error?.message === 'string' ? data.error.message : '',
          parseRetryAfter(responseHeaders?.['retry-after']),
        );
      }
      throw new WorkspaceFailure(0, 'network', 'Plotune could not be reached.');
    }
  }
  const data = async (method, path, options) => (await call(method, path, options)).data;

  const base = (workspaceId) => `/v1/workspaces/${segment(workspaceId)}`;
  const projectBase = (workspaceId, projectId) => `${base(workspaceId)}/projects/${segment(projectId)}`;

  return {
    async listWorkspaces({ signal } = {}) {
      const body = await data('get', '/v1/workspaces', { signal });
      return asArray(body?.items).map(({ id, name, role, revision, projectCount, services }) => ({ id, name, role, revision, projectCount: Number(projectCount) || 0, services: asArray(services) }));
    },
    async createWorkspace(name) {
      const body = await data('post', '/v1/workspaces', { body: { name } });
      return { ...body.workspace, role: body.role };
    },

    // Cache-first: a 304 answers from the snapshot of this session. The ETag is "<revision>-<role>".
    async getWorkspace(workspaceId, { signal } = {}) {
      const key = `${authorization()}|${workspaceId}`;
      const cached = details.get(key);
      const response = await call('get', base(workspaceId), {
        signal,
        headers: cached ? { 'If-None-Match': cached.etag } : undefined,
      });
      if (response.status === 304 && cached) return cached.value;
      const value = normalizeWorkspace(response.data);
      const etag = response.headers?.etag;
      if (etag) details.set(key, { etag, value });
      else details.delete(key);
      return value;
    },
    forgetWorkspace(workspaceId) {
      for (const key of [...details.keys()]) if (key.endsWith(`|${workspaceId}`)) details.delete(key);
    },

    renameWorkspace: (workspaceId, name, revision) => data('patch', base(workspaceId), { body: { name, revision } }),
    deleteWorkspace: (workspaceId, revision) => data('delete', base(workspaceId), { body: { revision } }),
    transferOwnership: (workspaceId, email, revision) => data('post', `${base(workspaceId)}/owner`, { body: { email, revision } }),

    // Invite or change a role (the API turns an unknown e-mail into a pending invite).
    putMember: (workspaceId, email, role, revision) => data('put', `${base(workspaceId)}/members/${segment(email)}`, { body: { role, revision } }),
    // `me` leaves the workspace.
    removeMember: (workspaceId, email, revision) => data('delete', `${base(workspaceId)}/members/${segment(email)}`, { body: { revision } }),

    createProject: (workspaceId, name, services, revision) => data('post', `${base(workspaceId)}/projects`, {
      body: { name, ...(services?.length ? { services } : {}), revision },
    }),
    renameProject: (workspaceId, projectId, name, revision) => data('patch', projectBase(workspaceId, projectId), { body: { name, revision } }),
    deleteProject: (workspaceId, projectId, revision) => data('delete', projectBase(workspaceId, projectId), { body: { revision } }),
    enableService: (workspaceId, projectId, service, revision) => data('put', `${projectBase(workspaceId, projectId)}/services/${segment(service)}`, { body: { revision } }),
    disableService: (workspaceId, projectId, service, revision) => data('delete', `${projectBase(workspaceId, projectId)}/services/${segment(service)}`, { body: { revision } }),

    // One claim for exactly one service (Stream and RMS pages call this through claims.js).
    requestClaim: (workspaceId, projectId, service) => data('post', `${projectBase(workspaceId, projectId)}/claims`, { body: { service } }),

    async listGrants() {
      const body = await data('get', '/v1/oauth/grants');
      return asArray(body?.items);
    },
    revokeGrant: (grantId) => data('delete', `/v1/oauth/grants/${segment(grantId)}`),

    // Shared OAuth consent (section 8.3): context, then the decision with the CSRF header.
    getConsentContext: (request, { signal } = {}) => data('get', '/oauth/authorize/context', { params: { request }, signal }),
    submitConsent: (csrf, decision) => data('post', '/oauth/authorize/consent', { body: decision, headers: { 'X-Plotune-CSRF': csrf } }),
  };
}

const workspaceClient = createWorkspaceClient();
export default workspaceClient;
