// Sign-in return paths for the workspace pages. Login accepts only these same-site routes in
// `next`; the consent request keeps only its opaque signed blob.
const WORKSPACE_PATH = /^\/workspaces(?:\/[A-Za-z0-9-]{1,64})?\/?$/;
const REQUEST_BLOB = /^[A-Za-z0-9_.~%+=-]{1,4096}$/;

export function safeWorkspaceNext(value) {
  if (typeof value !== 'string' || value.length > 4200) return null;
  if (WORKSPACE_PATH.test(value)) return value.replace(/\/$/, '') || '/workspaces';
  const match = /^\/authorize\?request=([^&#]*)$/.exec(value);
  if (!match || !REQUEST_BLOB.test(match[1])) return null;
  let request;
  try { request = decodeURIComponent(match[1]); } catch { return null; }
  return request ? `/authorize?request=${encodeURIComponent(request)}` : null;
}

export const workspaceLogin = (next, { expired = false } = {}) => {
  const safe = safeWorkspaceNext(next);
  const params = new URLSearchParams();
  if (expired) params.set('expired', '1');
  if (safe) params.set('next', safe);
  const query = params.toString();
  return `/login${query ? `?${query}` : ''}`;
};

export const consentLogin = (request) => workspaceLogin(`/authorize?request=${encodeURIComponent(request)}`);
