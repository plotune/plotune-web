import { useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import client, { sessionAuthorization } from './client';
import { getSnapshot, loadWorkspaces, subscribe } from './store';
import { workspaceLogin } from '../utils/workspaceNavigation';

// The signed-in session ended (a 401 from the workspace API): clear it and sign in again, coming back here.
export function useSessionExpiry() {
  const { invalidateSession } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback((failure) => {
    if (failure?.status !== 401) return false;
    invalidateSession?.();
    navigate(workspaceLogin(`${location.pathname}${location.search}`, { expired: true }), { replace: true });
    return true;
  }, [invalidateSession, navigate, location.pathname, location.search]);
}

// The workspace list: loaded when a screen asks for it, then kept in memory. `refresh` also
// revalidates once when the screen opens (the list page); the header only reads what it has.
export function useWorkspaceList({ load = true, refresh = false } = {}) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const own = snapshot.owner === sessionAuthorization();
  const state = own ? snapshot : { status: 'idle', items: [], failure: null };
  const refreshed = useRef(false);
  useEffect(() => {
    if (!load) return;
    if (refresh && !refreshed.current) {
      refreshed.current = true;
      loadWorkspaces({ force: true });
    } else if (state.status === 'idle' || state.status === 'stale') {
      loadWorkspaces({ force: state.status === 'stale' });
    }
  }, [load, refresh, state.status]);
  const reload = useCallback(() => loadWorkspaces({ force: true }), []);
  return { status: state.status === 'stale' ? 'ready' : state.status, items: state.items, failure: state.failure, reload };
}

const REFOCUS_AFTER_MS = 5 * 60 * 1000;

// One workspace: revalidated when opened, after the user's own writes, and when the tab regains
// focus after more than five minutes. No timers. A failed refresh keeps the last good view.
export function useWorkspaceDetail(workspaceId) {
  const [state, setState] = useState({ status: 'loading', workspace: null, failure: null, stale: false });
  const loadedAt = useRef(0);
  const sequence = useRef(0);

  const load = useCallback(async () => {
    const mine = ++sequence.current;
    try {
      const workspace = await client.getWorkspace(workspaceId);
      if (mine !== sequence.current) return null;
      loadedAt.current = Date.now();
      setState({ status: 'ready', workspace, failure: null, stale: false });
      return workspace;
    } catch (failure) {
      if (mine !== sequence.current) return null;
      setState((current) => (current.workspace
        ? { ...current, failure, stale: true }
        : { status: 'error', workspace: null, failure, stale: false }));
      return null;
    }
  }, [workspaceId]);

  useEffect(() => {
    sequence.current += 1;
    setState({ status: 'loading', workspace: null, failure: null, stale: false });
    load();
    return () => { sequence.current += 1; };
  }, [load]);

  useEffect(() => {
    const revalidate = () => {
      if (document.visibilityState === 'hidden') return;
      if (Date.now() - loadedAt.current > REFOCUS_AFTER_MS) load();
    };
    window.addEventListener('focus', revalidate);
    document.addEventListener('visibilitychange', revalidate);
    return () => {
      window.removeEventListener('focus', revalidate);
      document.removeEventListener('visibilitychange', revalidate);
    };
  }, [load]);

  return { ...state, reload: load };
}
