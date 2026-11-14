import React, { useCallback, useEffect, useId, useState } from 'react';
import client from './client';
import { ConfirmDialog } from './Dialog';
import { Loading, formatDate } from './ui';
import { failureMessage } from './errors';
import { serviceName } from './services';
import { useSessionExpiry } from './hooks';

// Apps (MCP clients) the signed-in person approved for this workspace. The list belongs to the
// account, so anyone, including a viewer, can revoke their own connection.
export default function ConnectedApps({ workspace }) {
  const [state, setState] = useState({ status: 'loading', grants: [], failure: null });
  const [revoking, setRevoking] = useState(null);
  const [dialog, setDialog] = useState({ busy: false, error: '' });
  const headingId = useId();
  const expire = useSessionExpiry();

  const load = useCallback(async () => {
    setState((current) => ({ ...current, status: current.grants.length ? 'ready' : 'loading', failure: null }));
    try {
      const grants = await client.listGrants();
      setState({ status: 'ready', grants, failure: null });
    } catch (failure) {
      if (!expire(failure)) setState((current) => ({ ...current, status: 'error', failure }));
    }
  }, [expire]);
  useEffect(() => { load(); }, [load, workspace.id]);

  const mine = state.grants.filter((grant) => grant.workspaceId === workspace.id);
  const projectName = (id) => workspace.projects.find((project) => project.id === id)?.name || 'a deleted project';

  const revoke = async () => {
    setDialog({ busy: true, error: '' });
    try {
      await client.revokeGrant(revoking.id);
      setRevoking(null); setDialog({ busy: false, error: '' });
      await load();
    } catch (failure) {
      if (expire(failure)) return;
      if (failure.status === 404) { setRevoking(null); setDialog({ busy: false, error: '' }); await load(); return; }
      setDialog({ busy: false, error: failureMessage(failure) });
    }
  };

  return (
    <section className="ws-section" aria-labelledby={headingId}>
      <div className="ws-section__head">
        <div>
          <h2 id={headingId}>Connected apps</h2>
          <p className="ws-muted">AI tools and apps you approved to work in this workspace.</p>
        </div>
      </div>
      {state.status === 'loading' && <Loading label="Loading connected apps…" />}
      {state.status === 'error' && (
        <div className="ws-empty" data-state="error">
          <p role="alert">{failureMessage(state.failure, { fallback: 'We could not load connected apps.' })}</p>
          <button type="button" className="design-button secondary ws-small" onClick={load}>Try again</button>
        </div>
      )}
      {state.status === 'ready' && mine.length === 0 && (
        <div className="ws-empty" data-state="empty"><h3>Nothing connected</h3><p>When you approve an app from its sign-in screen, it appears here.</p></div>
      )}
      {state.status === 'ready' && mine.length > 0 && (
        <ul className="ws-rows">
          {mine.map((grant) => (
            <li key={grant.id} className="ws-row">
              <div className="ws-row__main">
                <strong>{grant.clientName || 'An app'}</strong>
                <span className="ws-muted">
                  {(grant.services || []).map(serviceName).join(' and ')} in {(grant.projectIds || []).map(projectName).join(', ') || 'no projects'}
                </span>
                <span className="ws-muted">{grant.readOnly ? 'Read-only' : 'Can make changes'}{grant.expiresAt ? ` · until ${formatDate(grant.expiresAt)}` : ''}</span>
              </div>
              <div className="ws-row__side">
                <button type="button" className="design-button secondary ws-small ws-danger-outline" onClick={() => { setDialog({ busy: false, error: '' }); setRevoking(grant); }}>
                  Revoke<span className="sr-only"> {grant.clientName || 'app'}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {revoking && (
        <ConfirmDialog
          title={`Disconnect ${revoking.clientName || 'this app'}?`}
          confirmLabel="Disconnect"
          busyLabel="Disconnecting…"
          danger
          busy={dialog.busy}
          error={dialog.error}
          onConfirm={revoke}
          onCancel={() => setRevoking(null)}
        >
          <p>It can no longer read or change anything in this workspace. It stops working within moments.</p>
        </ConfirmDialog>
      )}
    </section>
  );
}
