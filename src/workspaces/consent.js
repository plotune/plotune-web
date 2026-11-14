import { serviceIds } from './services';

export const MAX_GRANT_PROJECTS = 20;
// Not offered to Members (contract 8.5); Viewers get no write scopes at all.
const OWNER_ADMIN_ONLY_SCOPES = new Set(['webhooks:write']);

const asArray = (value) => (Array.isArray(value) ? value : []);

// The consent context, reduced to what the page shows. Anything malformed is dropped, not guessed.
export function normalizeContext(body) {
  const resourceService = body?.resource?.service;
  if (!body || typeof body.csrf !== 'string' || !body.csrf || !resourceService) return null;
  return {
    csrf: body.csrf,
    client: { name: String(body.client?.name || 'An app'), redirectHost: String(body.client?.redirectHost || '') },
    resource: { service: resourceService, url: body.resource.url || '' },
    expiresAt: body.expiresAt || null,
    workspaces: asArray(body.workspaces).map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      role: workspace.role,
      projects: asArray(workspace.projects).map((project) => ({ id: project.id, name: project.name, services: serviceIds(project.services) })),
    })),
    services: asArray(body.services).map((entry) => ({
      service: entry.service,
      scopes: asArray(entry.scopes).map((scope) => ({
        scope: scope.scope,
        write: scope.class === 'write',
        description: scope.description || scope.scope,
      })),
    })),
  };
}

export const projectHasServices = (project, services) => services.every((service) => project.services.includes(service));

export const eligibleProjects = (workspace, services) => (workspace?.projects || []).filter((project) => projectHasServices(project, services));

// Write scopes this role may be offered. A Viewer's access is read-only whatever they choose.
export function offeredScopes(service, role) {
  const scopes = service?.scopes || [];
  return {
    read: scopes.filter((scope) => !scope.write),
    write: role === 'Viewer' ? [] : scopes.filter((scope) => scope.write && !(role === 'Member' && OWNER_ADMIN_ONLY_SCOPES.has(scope.scope))),
  };
}

// Where the app returns to: https, or http on the loopback address (native apps). Nothing else.
export function safeRedirect(value) {
  try {
    const url = new URL(value);
    const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (url.protocol === 'https:' || (url.protocol === 'http:' && loopback)) return url.toString();
  } catch { /* fall through */ }
  return null;
}
