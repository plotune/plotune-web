import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import client from '../workspaces/client';
import { failureMessage } from '../workspaces/errors';
import { useSessionExpiry, useWorkspaceDetail } from '../workspaces/hooks';
import { canManage, READ_ONLY_NOTICE } from '../workspaces/roles';
import { forgetSelection, markWorkspacesStale, rememberSelection } from '../workspaces/store';
import { Banner, ErrorState, Loading, RolePill } from '../workspaces/ui';
import NameDialog from '../workspaces/FormDialog';
import ProjectsSection from '../workspaces/ProjectsSection';
import MembersSection from '../workspaces/MembersSection';
import ConnectedApps from '../workspaces/ConnectedApps';
import AccessSection from '../workspaces/AccessSection';
import { workspaceLogin } from '../utils/workspaceNavigation';
import '../workspaces/workspaces.css';

export default function WorkspaceDetail() {
  const { workspaceId } = useParams();
  const { token, isLoading } = useContext(AuthContext);
  const location = useLocation();
  if (isLoading) return <main className="ws-page"><div className="ws-shell"><Loading label="Loading your account…" /></div></main>;
  if (!token) return <Navigate to={workspaceLogin(location.pathname)} replace />;
  return <WorkspaceView key={workspaceId} workspaceId={workspaceId} />;
}

function WorkspaceView({ workspaceId }) {
  const navigate = useNavigate();
  const expire = useSessionExpiry();
  const { status, workspace, failure, stale, reload } = useWorkspaceDetail(workspaceId);
  const [renaming, setRenaming] = React.useState(false);
  const titleRef = useRef(null);

  // The session ended while reading: sign in again and come back here.
  useEffect(() => { if (failure) expire(failure); }, [failure, expire]);

  useEffect(() => {
    if (workspace) rememberSelection({ workspaceId: workspace.id, workspaceName: workspace.name });
  }, [workspace?.id, workspace?.name]);

  // Every write carries the workspace revision. A conflict, a lost permission or a removed
  // workspace reloads the view so the next attempt starts from the truth.
  const run = useCallback(async (action, { success, reload: reloadAfter = true } = {}) => {
    try {
      await action(workspace.revision);
      client.forgetWorkspace(workspaceId);
      markWorkspacesStale();
      if (reloadAfter) await reload();
      if (success) toast.success(success);
      return { ok: true };
    } catch (error) {
      if (expire(error)) return { ok: false, message: '' };
      if ([403, 404, 409].includes(error?.status)) reload();
      return { ok: false, message: failureMessage(error) };
    }
  }, [workspace, workspaceId, reload, expire]);

  const gone = () => {
    forgetSelection(workspaceId);
    client.forgetWorkspace(workspaceId);
    markWorkspacesStale();
    navigate('/workspaces', { replace: true });
  };

  if (status === 'loading') return <Shell><Loading label="Loading workspace…" /></Shell>;
  if (status === 'error') {
    if (failure?.status === 401) return <Shell><Loading label="Taking you to sign in…" /></Shell>;
    return <Shell><ErrorState failure={failure} onRetry={reload} what="this workspace" /></Shell>;
  }

  const manager = canManage(workspace.role);
  return (
    <Shell title={workspace.name}>
      <nav className="ws-crumbs" aria-label="Breadcrumb"><Link to="/workspaces">Workspaces</Link><span aria-hidden="true"> / </span><span aria-current="page">{workspace.name}</span></nav>
      <header className="ws-head">
        <div className="ws-head__title">
          <h1 ref={titleRef}>{workspace.name}</h1>
          <RolePill role={workspace.role} />
        </div>
        {manager && <button type="button" className="design-button secondary" onClick={() => setRenaming(true)}>Rename</button>}
      </header>

      {!manager && <Banner tone="info">{READ_ONLY_NOTICE}</Banner>}
      {stale && (
        <Banner tone="warn" action={<button type="button" className="design-button secondary ws-small" onClick={reload}>Try again</button>}>
          {failureMessage(failure)} You are seeing the last version we loaded.
        </Banner>
      )}

      <ProjectsSection workspace={workspace} canManage={manager} run={run} />
      <MembersSection workspace={workspace} canManage={manager} run={run} />
      <ConnectedApps workspace={workspace} />
      <AccessSection workspace={workspace} run={run} onGone={gone} />

      {renaming && (
        <NameDialog
          title="Rename workspace"
          label="Workspace name"
          initial={workspace.name}
          submitLabel="Save name"
          onClose={() => setRenaming(false)}
          onSubmit={(name) => run((revision) => client.renameWorkspace(workspace.id, name, revision), { success: 'Workspace renamed.' })}
        />
      )}
    </Shell>
  );
}

function Shell({ title, children }) {
  return (
    <main className="ws-page">
      <Helmet>
        <title>{title ? `${title} · Workspaces · Plotune` : 'Workspace · Plotune'}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="ws-shell">{children}</div>
    </main>
  );
}
