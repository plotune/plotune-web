import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import workspaceClient from '../workspaces/client';
import { createClaimManager } from '../workspaces/claims';
import { useSessionExpiry, useWorkspaceDetail, useWorkspaceList } from '../workspaces/hooks';
import { readSelection, rememberSelection } from '../workspaces/store';
import { serviceIds } from '../workspaces/services';
import { failureMessage } from '../workspaces/errors';
import { workspaceLogin } from '../utils/workspaceNavigation';
import { attachRmsStyle, EmbedLoadError, loadRmsEmbed, RMS_API_BASE } from './embed';
import '../workspaces/workspaces.css'; // the header's workspace switcher label limits live here
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

function Workspace() {
  const { workspaceId: wantedWorkspace = '', projectId: wantedProject = '' } = useParams();
  const navigate = useNavigate();
  const expire = useSessionExpiry();
  const list = useWorkspaceList();

  const rmsWorkspaces = useMemo(() => list.items.filter((item) => serviceIds(item.services).includes(SERVICE)), [list.items]);
  const workspaceId = (
    list.items.find((item) => item.id === wantedWorkspace)
    || rmsWorkspaces.find((item) => item.id === readSelection()?.workspaceId)
    || rmsWorkspaces[0]
  )?.id || '';
  const detail = useWorkspaceDetail(workspaceId);
  // The detail hook keeps the previous workspace's data for one render after the id changes.
  const current = detail.workspace?.id === workspaceId ? detail.workspace : null;
  const projects = useMemo(
    () => (current?.projects || []).filter((project) => project.services.includes(SERVICE)),
    [current],
  );
  const project = workspaceId === wantedWorkspace ? projects.find((item) => item.id === wantedProject) : null;
  const loading = list.status === 'idle' || list.status === 'loading' || (Boolean(workspaceId) && !current && detail.status !== 'error');

  useEffect(() => {
    if (expire(list.failure) || expire(detail.failure)) return;
  }, [list.failure, detail.failure, expire]);

  // /rms and /rms/<workspace> choose a project for you: the one you used last, else the first.
  const remembered = readSelection();
  const fallbackProject = (remembered?.workspaceId === workspaceId && projects.find((item) => item.id === remembered.projectId)) || projects[0];
  const choosing = !wantedProject || (wantedWorkspace !== workspaceId && !project);
  useEffect(() => {
    if (!loading && choosing && workspaceId && fallbackProject) navigate(rmsPath(workspaceId, fallbackProject.id), { replace: true });
  }, [loading, choosing, workspaceId, fallbackProject, navigate]);
  useEffect(() => {
    if (project && current) rememberSelection({ workspaceId, workspaceName: current.name, projectId: project.id });
  }, [project, current, workspaceId]);

  const settingsLink = workspaceId ? `/workspaces/${encodeURIComponent(workspaceId)}` : '/workspaces';
  const picker = !loading && workspaceId && projects.length > 0 && (
    <nav className="rms-bar" aria-label="RMS project">
      {rmsWorkspaces.length > 1 && (
        <label>
          <span>Workspace</span>
          <select
            value={workspaceId}
            title={list.items.find((item) => item.id === workspaceId)?.name}
            onChange={(event) => navigate(`/rms/${encodeURIComponent(event.target.value)}`)}
          >
            {rmsWorkspaces.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
      )}
      <label>
        <span>Project</span>
        <select
          value={project?.id || ''}
          title={project?.name}
          onChange={(event) => navigate(rmsPath(workspaceId, event.target.value))}
        >
          {!project && <option value="" disabled>Select a project</option>}
          {projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <Link className="rms-bar__link" to={settingsLink}>Manage in workspace</Link>
    </nav>
  );

  let body;
  if (loading) {
    body = <State busy>Loading your projects…</State>;
  } else if (list.status === 'error' || (detail.status === 'error' && !current)) {
    const failure = list.status === 'error' ? list.failure : detail.failure;
    body = failure?.status === 401 ? <State busy>Your session ended. Taking you to sign in…</State> : (
      <State
        title="We could not load your projects"
        alert
        actions={<button type="button" className="rms-button" onClick={() => (list.status === 'error' ? list.reload() : detail.reload())}>Try again</button>}
      >
        {failureMessage(failure)}
      </State>
    );
  } else if (!workspaceId || projects.length === 0) {
    body = (
      <State
        title="No project has RMS enabled"
        actions={<Link className="rms-button" to={settingsLink}>Open workspace settings</Link>}
      >
        Enable it in workspace settings.
      </State>
    );
  } else if (!project) {
    body = choosing ? <State busy>Opening RMS…</State> : (
      <State title="Project unavailable" actions={<Link className="rms-button" to={settingsLink}>Open workspace settings</Link>}>
        This project does not have RMS turned on, or you no longer have access. Choose another project above.
      </State>
    );
  } else {
    body = <RmsEmbed key={`${workspaceId}|${project.id}`} workspaceId={workspaceId} projectId={project.id} onExpired={() => expire({ status: 401 })} />;
  }

  return <div className="rms-page">{picker}{body}</div>;
}

// Mounts the RMS module for one project and unmounts it when the project or the page changes.
function RmsEmbed({ workspaceId, projectId, onExpired }) {
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
    let style = null;
    setState({ phase: 'loading', failure: null });

    let live = false;
    const fail = (failure) => {
      if (cancelled) return;
      if (failure?.status === 401) { expired.current(); return; }
      setState({ phase: 'error', failure });
    };
    // The module only needs the token. Why a claim could not be had is this page's to explain, so
    // a failure after the module is running ends the view here; before that, the setup below does.
    const getClaim = async (refresh = false) => {
      try {
        return (await claims.getClaim(workspaceId, projectId, SERVICE, { force: Boolean(refresh) })).token;
      } catch (failure) {
        // A hidden tab simply does not renew a claim; anything else ends this view.
        if (live && failure?.code !== 'tab_hidden') fail(failure);
        throw failure;
      }
    };

    (async () => {
      try {
        const [embed] = await Promise.all([loadRmsEmbed(), getClaim(false)]);
        style = attachRmsStyle(embed.styleHref);
        await style.ready;
        if (cancelled || !host.current) return;
        element = document.createElement('div');
        element.className = 'rms-mount';
        host.current.appendChild(element);
        handle = embed.mount(element, { apiBase: RMS_API_BASE, projectId, getClaim });
        live = true;
        setState({ phase: 'ready', failure: null });
      } catch (failure) {
        fail(failure instanceof EmbedLoadError || typeof failure?.status === 'number' ? failure : new EmbedLoadError(String(failure?.message || failure)));
      }
    })();

    return () => {
      cancelled = true;
      const mounted = handle;
      const node = element;
      const sheet = style;
      // React forbids unmounting a root from inside another root's commit; do it right after.
      setTimeout(() => {
        try { mounted?.unmount(); } catch { /* the page is going away anyway */ }
        node?.remove();
        sheet?.detach();
      }, 0);
    };
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
              {!problem.retry && <Link className="rms-button" to={`/workspaces/${encodeURIComponent(workspaceId)}`}>Open workspace settings</Link>}
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
