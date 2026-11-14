import client from './client';
import { sessionAuthorization } from './client';

// The workspace list is read once per page load and kept in memory (contract section 12).
// Convenience selection (workspace, project) lives in localStorage inside try/catch: it can be
// missing, blocked or stale, and the pages must work without it.
const SELECTION_KEY = 'plotune-workspace-selection:v1';

export function readSelection() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(SELECTION_KEY));
    if (!saved || typeof saved.workspaceId !== 'string') return null;
    return {
      workspaceId: saved.workspaceId,
      workspaceName: typeof saved.workspaceName === 'string' ? saved.workspaceName.slice(0, 64) : '',
      projectId: typeof saved.projectId === 'string' ? saved.projectId : null,
    };
  } catch { return null; }
}

export function rememberSelection({ workspaceId, workspaceName = '', projectId = null }) {
  try { window.localStorage.setItem(SELECTION_KEY, JSON.stringify({ workspaceId, workspaceName, projectId })); } catch { /* optional */ }
  listeners.forEach((listener) => listener());
}

export function forgetSelection(workspaceId) {
  try {
    if (readSelection()?.workspaceId === workspaceId) window.localStorage.removeItem(SELECTION_KEY);
  } catch { /* optional */ }
  listeners.forEach((listener) => listener());
}

const listeners = new Set();
let snapshot = { owner: null, status: 'idle', items: [], failure: null };
let inflight = null;

const emit = (next) => { snapshot = next; listeners.forEach((listener) => listener()); };
export const subscribe = (listener) => { listeners.add(listener); return () => listeners.delete(listener); };
export const getSnapshot = () => snapshot;

// `owner` is the session the list belongs to, so another account never sees it.
export async function loadWorkspaces({ force = false } = {}) {
  const owner = sessionAuthorization();
  if (!owner) return snapshot;
  if (snapshot.owner !== owner) snapshot = { owner, status: 'idle', items: [], failure: null };
  if (!force && snapshot.status === 'ready') return snapshot;
  if (inflight && inflight.owner === owner) return inflight.promise;
  emit({ ...snapshot, status: snapshot.status === 'ready' ? 'ready' : 'loading', failure: null });
  const promise = client.listWorkspaces()
    .then((items) => emit({ owner, status: 'ready', items, failure: null }))
    .catch((failure) => emit({ owner, status: snapshot.items.length ? 'ready' : 'error', items: snapshot.items, failure }))
    .finally(() => { inflight = null; })
    .then(() => snapshot);
  inflight = { owner, promise };
  return promise;
}

// After the user created, renamed, left or deleted a workspace.
export const markWorkspacesStale = () => { if (snapshot.status === 'ready') snapshot = { ...snapshot, status: 'stale' }; };

export function resetWorkspaceStore() {
  snapshot = { owner: null, status: 'idle', items: [], failure: null };
  inflight = null;
  listeners.forEach((listener) => listener());
}
