import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import workspaceClient from '../workspaces/client';
import { createClaimManager } from '../workspaces/claims';
import { useSessionExpiry, useWorkspaceList } from '../workspaces/hooks';
import { serviceIds } from '../workspaces/services';
import { failureMessage } from '../workspaces/errors';
import { workspaceLogin } from '../utils/workspaceNavigation';
import { EmbedLoadError, loadRmsEmbed, RMS_API_BASE } from './embed';
import './rms.css';

const SERVICE = 'rms';
const rmsPath = (workspaceId, projectId) => `/rms/${encodeURIComponent(workspaceId)}/${encodeURIComponent(projectId)}`;

// What the person sees when RMS cannot be opened. Raw codes and server strings stay out of it.
export function rmsProblem(failure) {
  if (failure instanceof EmbedLoadError || failure?.name === 'EmbedLoadError') {
    return { title: 'RMS could not be loaded', text: 'The RMS app did not load. Check your connection and try again.', retry: true };
  }
  const status = failure?.status;
  if (status === 403 || status === 404) {
    return {
      title: 'RMS is not available for this project',
      text: 'Your role in this workspace does not include RMS for this project, or RMS has been turned off for it. Choose another project, or ask a workspace owner.',
      retry: false,
    };
  }
  if (status === 0 || status === 429 || status === 502 || status === 503 || status === 504) {
    return { title: 'RMS is temporarily unavailable', text: failureMessage(failure), retry: true };
  }
  return { title: 'RMS could not be opened', text: 'Something went wrong while opening RMS. Try again.', retry: true };
}

function State({ title, children, actions, busy = false, alert = false }) {
  return (
    <main id="main" className="rms-state" tabIndex={-1}>
      <div className="rms-state__card" data-busy={busy || undefined}>
        {title && <h1>{title}</h1>}
        {alert ? <p role="alert">{children}</p> : busy ? <p role="status">{children}</p> : <p>{children}</p>}
        {actions && <div className="rms-state__actions">{actions}</div>}
      </div>
    </main>
  );
}

export default function RmsPage() {
  const auth = useContext(AuthContext);
  const location = useLocation();
  return (
    <>
      <Helmet>
        <title>RMS · Plotune</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      {auth.isLoading ? (
        <div className="rms-page"><State busy>Checking your session…</State></div>
      ) : !auth.token ? (
        // Signed out: sign in, then come back to this exact project.
        <Navigate to={workspaceLogin(location.pathname)} replace />
      ) : (
        <Workspace key={auth.token} />
      )}
    </>
  );
}

// The last project opened, kept as a convenience only (it is checked against the projects the account can use).
const LAST_KEY = 'plotune-rms-last:v1';
const readLast = () => { try { return JSON.parse(window.localStorage.getItem(LAST_KEY)) || null; } catch { return null; } };
const writeLast = (value) => { try { window.localStorage.setItem(LAST_KEY, JSON.stringify(value)); } catch { /* optional */ } };

// The RMS-enabled projects of every workspace that has any, grouped by workspace.
function useRmsGroups(workspaces) {
  const [state, setState] = useState({ key: '', status: 'idle', groups: [], failure: null });
  const key = workspaces.map((item) => item.id).join('|');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!workspaces.length) { setState({ key, status: 'ready', groups: [], failure: null }); return undefined; }
    let live = true;
    setState({ key, status: 'loading', groups: [], failure: null });
    Promise.all(workspaces.map((item) => workspaceClient.getWorkspace(item.id)))
      .then((details) => {
        if (!live) return;
        const groups = details
          .map((detail) => ({
            workspaceId: detail.id,
            workspaceName: detail.name,
            projects: detail.projects.filter((project) => project.services.includes(SERVICE)).map(({ id, name }) => ({ id, name })),
          }))
          .filter((group) => group.projects.length > 0);
        setState({ key, status: 'ready', groups, failure: null });
      })
      .catch((failure) => { if (live) setState({ key, status: 'error', groups: [], failure }); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);
  const stale = state.key !== key;
  return { status: stale ? 'loading' : state.status, groups: stale ? [] : state.groups, failure: stale ? null : state.failure, reload: () => setAttempt((n) => n + 1) };
}

function Workspace() {
  const { workspaceId: wantedWorkspace = '', projectId: wantedProject = '' } = useParams();
  const navigate = useNavigate();
  const expire = useSessionExpiry();
  const list = useWorkspaceList();
  const rmsWorkspaces = useMemo(() => list.items.filter((item) => serviceIds(item.services).includes(SERVICE)), [list.items]);
  const { status, groups, failure, reload } = useRmsGroups(list.status === 'ready' ? rmsWorkspaces : []);
  const loading = list.status === 'idle' || list.status === 'loading' || (list.status === 'ready' && status !== 'ready' && status !== 'error');

  useEffect(() => { expire(list.failure); expire(failure); }, [list.failure, failure, expire]);

  const find = (workspaceId, projectId) => {
    const group = groups.find((item) => item.workspaceId === workspaceId);
    const project = group?.projects.find((item) => item.id === projectId);
    return project ? { group, project } : null;
  };
  const chosen = find(wantedWorkspace, wantedProject);
  // /rms (or a link that no longer fits) opens the project used last, else the first one.
  const last = readLast();
  const fallback = find(last?.workspaceId, last?.projectId) || (groups[0] && { group: groups[0], project: groups[0].projects[0] });
  useEffect(() => {
    if (!loading && !chosen && fallback && !wantedProject) navigate(rmsPath(fallback.group.workspaceId, fallback.project.id), { replace: true });
  }, [loading, chosen, fallback, wantedProject, navigate]);
  useEffect(() => { if (chosen) writeLast({ workspaceId: chosen.group.workspaceId, projectId: chosen.project.id }); }, [chosen]);

  const settingsLink = chosen ? `/workspaces/${encodeURIComponent(chosen.group.workspaceId)}` : (fallback ? `/workspaces/${encodeURIComponent(fallback.group.workspaceId)}` : '/workspaces');
  let body;
  if (loading) {
    body = <State busy>Loading your projects…</State>;
  } else if (list.status === 'error' || status === 'error') {
    const cause = list.status === 'error' ? list.failure : failure;
    body = cause?.status === 401 ? <State busy>Your session ended. Taking you to sign in…</State> : (
      <State
        title="We could not load your projects"
        alert
        actions={<button type="button" className="rms-button" onClick={() => (list.status === 'error' ? list.reload() : reload())}>Try again</button>}
      >
        {failureMessage(cause)}
      </State>
    );
  } else if (groups.length === 0) {
    body = (
      <State
        title="No project has RMS enabled"
        actions={<Link className="rms-button" to={settingsLink}>Open workspace settings</Link>}
      >
        Enable it in workspace settings.
      </State>
    );
  } else if (!chosen) {
    body = wantedProject ? (
      <State title="Project unavailable" actions={<Link className="rms-button" to={rmsPath(fallback.group.workspaceId, fallback.project.id)}>Open {fallback.project.name}</Link>}>
        This project does not have RMS turned on, or you no longer have access.
      </State>
    ) : <State busy>Opening RMS…</State>;
  } else {
    const switcher = {
      groups,
      workspaceId: chosen.group.workspaceId,
      projectId: chosen.project.id,
      manageHref: settingsLink,
      onSelect: (workspaceId, projectId) => navigate(rmsPath(workspaceId, projectId)),
    };
    body = (
      <RmsEmbed
        key={`${chosen.group.workspaceId}|${chosen.project.id}`}
        workspaceId={chosen.group.workspaceId}
        projectId={chosen.project.id}
        switcher={switcher}
        settingsLink={settingsLink}
        onExpired={() => expire({ status: 401 })}
      />
    );
  }
  return <div className="rms-page">{body}</div>;
}

// Mounts the RMS module for one project and unmounts it when the project or the page changes.
function RmsEmbed({ workspaceId, projectId, switcher, settingsLink, onExpired }) {
  const host = useRef(null);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ phase: 'loading', failure: null });
  const expired = useRef(onExpired);
  expired.current = onExpired;
  // One claim helper per mounted project: claims live in memory only and are renewed on use.
  const claims = useMemo(() => createClaimManager({ requestClaim: workspaceClient.requestClaim }), []);

  useEffect(() => {
    let cancelled = false;
    let handle = null;
    let element = null;
    setState({ phase: 'loading', failure: null });

    const reported = new WeakSet();
    const fail = (failure) => {
      if (cancelled || (failure && typeof failure === 'object' && reported.has(failure))) return;
      if (failure && typeof failure === 'object') reported.add(failure);
      if (failure?.status === 401) { expired.current(); return; }
      setState({ phase: 'error', failure });
    };
    // The module only needs the token; why a claim could not be had is this page's to explain.
    const getClaim = async (refresh = false) => {
      try {
        return (await claims.getClaim(workspaceId, projectId, SERVICE, { force: Boolean(refresh) })).token;
      } catch (failure) {
        // A hidden tab simply does not renew a claim; anything else is reported through onError/onSessionEnd.
        if (failure?.code !== 'tab_hidden') fail(failure);
        throw failure;
      }
    };

    (async () => {
      try {
        const [embed] = await Promise.all([loadRmsEmbed(), getClaim(false)]);
        if (cancelled || !host.current) return;
        element = document.createElement('div');
        element.style.height = '100%';
        host.current.appendChild(element);
        handle = embed.mount(element, {
          apiBase: RMS_API_BASE,
          projectId,
          getClaim,
          switcher,
          // A claim 401 that persists after one refresh: the account session ended.
          onSessionEnd: () => { if (!cancelled) expired.current(); },
          onError: (failure) => fail(failure),
        });
        setState({ phase: 'ready', failure: null });
      } catch (failure) {
        fail(failure instanceof EmbedLoadError || typeof failure?.status === 'number' ? failure : new EmbedLoadError(String(failure?.message || failure)));
      }
    })();

    return () => {
      cancelled = true;
      const mounted = handle;
      const node = element;
      // React forbids unmounting a root from inside another root's commit; do it right after.
      setTimeout(() => {
        try { mounted?.unmount(); } catch { /* the page is going away anyway */ }
        node?.remove();
      }, 0);
    };
    // The switcher is read once per mounted project (the page remounts on a project change).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, projectId, attempt, claims]);

  const retry = useCallback(() => { claims.clear(); setAttempt((value) => value + 1); }, [claims]);
  const problem = state.phase === 'error' ? rmsProblem(state.failure) : null;
  return (
    <>
      {state.phase === 'loading' && <State busy>Opening RMS…</State>}
      {problem && (
        <State
          title={problem.title}
          alert
          actions={(
            <>
              {problem.retry && <button type="button" className="rms-button" onClick={retry}>Try again</button>}
              {!problem.retry && <Link className="rms-button" to={settingsLink}>Open workspace settings</Link>}
            </>
          )}
        >
          {problem.text}
        </State>
      )}
      <div className="rms-host" ref={host} hidden={state.phase !== 'ready'} />
    </>
  );
}
