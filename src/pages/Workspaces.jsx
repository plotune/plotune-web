import React, { useContext, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../context/AuthContext';
import client from '../workspaces/client';
import { failureMessage } from '../workspaces/errors';
import { useSessionExpiry, useWorkspaceList } from '../workspaces/hooks';
import { markWorkspacesStale, rememberSelection } from '../workspaces/store';
import { Banner, ErrorState, Loading, RolePill } from '../workspaces/ui';
import { serviceName } from '../workspaces/services';
import NameDialog from '../workspaces/FormDialog';
import { workspaceLogin } from '../utils/workspaceNavigation';
import '../workspaces/workspaces.css';

export default function Workspaces() {
  const { token, isLoading } = useContext(AuthContext);
  const location = useLocation();
  if (isLoading) return <main className="ws-page"><div className="ws-shell"><Loading label="Loading your account…" /></div></main>;
  if (!token) return <Navigate to={workspaceLogin(location.pathname)} replace />;
  return <WorkspaceList />;
}

// "3 projects · Stream, RMS": read from each workspace's detail (cached by ETag), three at a time.
const stateLine = (workspace) => {
  const count = workspace.projects.length;
  const services = [...new Set(workspace.projects.flatMap((project) => project.services))].map(serviceName);
  return `${count === 0 ? 'No projects' : count === 1 ? '1 project' : `${count} projects`}${services.length ? ` · ${services.join(', ')}` : ''}`;
};

function useWorkspaceSummaries(items) {
  const [lines, setLines] = useState({});
  const key = items.map((item) => item.id).join('|');
  React.useEffect(() => {
    let cancelled = false;
    const queue = [...items];
    const worker = async () => {
      while (queue.length && !cancelled) {
        const item = queue.shift();
        try {
          const detail = await client.getWorkspace(item.id);
          const line = detail?.projects ? stateLine(detail) : null;
          if (line && !cancelled) setLines((current) => ({ ...current, [item.id]: line }));
        } catch { /* the card simply shows no summary */ }
      }
    };
    Promise.all([worker(), worker(), worker()]);
    return () => { cancelled = true; };
  }, [key]);
  return lines;
}

function WorkspaceList() {
  const navigate = useNavigate();
  const expire = useSessionExpiry();
  const { status, items, failure, reload } = useWorkspaceList({ refresh: true });
  const [creating, setCreating] = useState(false);
  const lines = useWorkspaceSummaries(status === 'ready' ? items : []);

  React.useEffect(() => { if (failure) expire(failure); }, [failure, expire]);

  const create = async (name) => {
    try {
      const workspace = await client.createWorkspace(name);
      markWorkspacesStale();
      rememberSelection({ workspaceId: workspace.id, workspaceName: workspace.name });
      navigate(`/workspaces/${encodeURIComponent(workspace.id)}`);
      return { ok: true };
    } catch (error) {
      if (expire(error)) return { ok: false, message: '' };
      return { ok: false, message: failureMessage(error) };
    }
  };

  const canCreateFromHeader = status === 'ready' && items.length > 0;
  return (
    <main className="ws-page">
      <Helmet>
        <title>Workspaces · Plotune</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="ws-shell">
        <header className="ws-head">
          <div>
            <h1>Workspaces</h1>
            <p className="ws-muted ws-lead">A workspace holds your projects and the people who work on them.</p>
          </div>
          {canCreateFromHeader && <button type="button" className="design-button" onClick={() => setCreating(true)}>New workspace</button>}
        </header>

        {status === 'loading' || status === 'idle' ? <Loading label="Loading your workspaces…" /> : null}
        {status === 'error' && failure?.status !== 401 && <ErrorState failure={failure} onRetry={reload} backTo="/dashboard" backLabel="Back to dashboard" what="your workspaces" />}
        {status === 'ready' && failure && (
          <Banner tone="warn" action={<button type="button" className="design-button secondary ws-small" onClick={reload}>Try again</button>}>
            {failureMessage(failure)} You are seeing the last list we loaded.
          </Banner>
        )}
        {status === 'ready' && items.length === 0 && (
          <div className="ws-empty ws-empty--large" data-state="empty">
            <h2>Create your first workspace</h2>
            <p>Workspaces keep your projects and teammates together. You will be its owner.</p>
            <button type="button" className="design-button" onClick={() => setCreating(true)}>New workspace</button>
          </div>
        )}
        {status === 'ready' && items.length > 0 && (
          <ul className="ws-grid ws-grid--wide" aria-label="Your workspaces">
            {items.map((workspace) => (
              <li key={workspace.id}>
                <Link
                  className="ws-card ws-card--link"
                  to={`/workspaces/${encodeURIComponent(workspace.id)}`}
                  onClick={() => rememberSelection({ workspaceId: workspace.id, workspaceName: workspace.name })}
                >
                  <span className="ws-card__head">
                    <h2 className="ws-card__title">{workspace.name}</h2>
                    <RolePill role={workspace.role} />
                  </span>
                  <span className="ws-muted ws-card__state">{lines[workspace.id] || '\u00a0'}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {creating && (
        <NameDialog
          title="New workspace"
          label="Workspace name"
          hint="Up to 64 characters. You can rename it later."
          submitLabel="Create workspace"
          busyLabel="Creating…"
          onClose={() => setCreating(false)}
          onSubmit={create}
        />
      )}
    </main>
  );
}
