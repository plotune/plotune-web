import React, { useId, useState } from 'react';
import client from './client';
import Dialog, { ConfirmDialog } from './Dialog';
import { canManage, isOwner, OWNER_ONLY_REASON } from './roles';

// Ownership, deletion and leaving. Owner-only actions stay visible to admins, switched off with the
// reason next to them; members and viewers only see how to leave.
export default function AccessSection({ workspace, run, onGone }) {
  const [dialog, setDialog] = useState(null);
  const headingId = useId();
  const owner = isOwner(workspace.role);
  const manager = canManage(workspace.role);
  const close = () => setDialog(null);
  const projectCount = workspace.projects.length;
  const candidates = workspace.members.filter((member) => (member.role === 'Admin' || member.role === 'Member') && member.email);

  const deleteBlocked = !owner
    ? OWNER_ONLY_REASON
    : projectCount > 0 ? `Delete its ${projectCount === 1 ? 'project' : `${projectCount} projects`} first.` : '';
  const transferBlocked = !owner ? OWNER_ONLY_REASON : candidates.length === 0 ? 'Invite someone who accepts ownership first. They must already be an admin or member.' : '';

  return (
    <section className="ws-section" aria-labelledby={headingId}>
      <div className="ws-section__head">
        <div>
          <h2 id={headingId}>{manager ? 'Ownership and deletion' : 'Your access'}</h2>
        </div>
      </div>
      <ul className="ws-rows">
        {manager && (
          <>
            <ActionRow
              id={`${headingId}-transfer`}
              title="Transfer ownership"
              text="Hand this workspace to an admin or member. You become an admin."
              label="Transfer ownership"
              blocked={transferBlocked}
              onClick={() => setDialog({ type: 'transfer' })}
            />
            <ActionRow
              id={`${headingId}-delete`}
              title="Delete workspace"
              text="Removes the workspace and its people. This cannot be undone."
              label="Delete workspace"
              danger
              blocked={deleteBlocked}
              onClick={() => setDialog({ type: 'delete' })}
            />
          </>
        )}
        {owner ? (
          <li className="ws-row"><div className="ws-row__main"><strong>Leave workspace</strong><span className="ws-muted">You own this workspace. Transfer ownership to someone else before you leave it.</span></div></li>
        ) : (
          <ActionRow
            id={`${headingId}-leave`}
            title="Leave workspace"
            text="You lose access to its projects. An owner or admin can add you again."
            label="Leave workspace"
            danger
            onClick={() => setDialog({ type: 'leave' })}
          />
        )}
      </ul>

      {dialog?.type === 'transfer' && (
        <TransferDialog
          workspace={workspace}
          candidates={candidates}
          onClose={close}
          onSubmit={(email) => run((revision) => client.transferOwnership(workspace.id, email, revision), { success: 'Ownership transferred. You are now an admin.' })}
        />
      )}
      {dialog?.type === 'delete' && (
        <TypedDialog
          title={`Delete ${workspace.name}?`}
          confirmText={workspace.name}
          confirmLabel="Delete workspace"
          busyLabel="Deleting…"
          onCancel={close}
          onConfirm={() => run((revision) => client.deleteWorkspace(workspace.id, revision), { success: `Deleted ${workspace.name}.`, reload: false })}
          onDone={onGone}
        >
          <p>This removes the workspace and everyone's access to it, including connected apps. It cannot be undone.</p>
        </TypedDialog>
      )}
      {dialog?.type === 'leave' && (
        <TypedDialog
          title={`Leave ${workspace.name}?`}
          confirmLabel="Leave workspace"
          busyLabel="Leaving…"
          onCancel={close}
          onConfirm={() => run((revision) => client.removeMember(workspace.id, 'me', revision), { success: `You left ${workspace.name}.`, reload: false })}
          onDone={onGone}
        >
          <p>You lose access to every project in this workspace, including through connected apps.</p>
        </TypedDialog>
      )}
    </section>
  );
}

function ActionRow({ id, title, text, label, danger, blocked = '', onClick }) {
  return (
    <li className="ws-row">
      <div className="ws-row__main">
        <strong>{title}</strong>
        <span className="ws-muted">{text}</span>
        {blocked && <span id={`${id}-reason`} className="ws-reason">{blocked}</span>}
      </div>
      <div className="ws-row__side">
        <button
          type="button"
          className={`design-button secondary ws-small${danger ? ' ws-danger-outline' : ''}`}
          disabled={Boolean(blocked)}
          aria-describedby={blocked ? `${id}-reason` : undefined}
          onClick={onClick}
        >{label}</button>
      </div>
    </li>
  );
}

// ConfirmDialog that runs its request and closes (or shows the failure inside).
function TypedDialog({ onConfirm, onDone, children, ...props }) {
  const [state, setState] = useState({ busy: false, error: '' });
  const confirm = async () => {
    setState({ busy: true, error: '' });
    const result = await onConfirm();
    if (result.ok) onDone(); else setState({ busy: false, error: result.message });
  };
  return <ConfirmDialog {...props} danger busy={state.busy} error={state.error} onConfirm={confirm}>{children}</ConfirmDialog>;
}

function TransferDialog({ workspace, candidates, onSubmit, onClose }) {
  const [email, setEmail] = useState(candidates[0]?.email || '');
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const id = useId();
  const target = candidates.find((candidate) => candidate.email === email);
  const ready = Boolean(target) && typed === workspace.name;

  const submit = async (event) => {
    event.preventDefault();
    if (!ready || busy) return;
    setBusy(true); setError('');
    const result = await onSubmit(email);
    setBusy(false);
    if (result.ok) onClose(); else setError(result.message);
  };

  return (
    <Dialog title="Transfer ownership" onClose={onClose} busy={busy} initialFocus="select">
      <form onSubmit={submit}>
        <div className="ws-dialog__body">
          <p>The new owner controls this workspace, including deleting it. You become an admin and cannot undo this yourself.</p>
        </div>
        <div className="ws-field">
          <label htmlFor={`${id}-who`}>New owner</label>
          <select id={`${id}-who`} value={email} onChange={(event) => setEmail(event.target.value)} disabled={busy}>
            {candidates.map((candidate) => (
              <option key={candidate.accountId} value={candidate.email}>{candidate.displayName} ({candidate.email}, {candidate.role})</option>
            ))}
          </select>
        </div>
        <div className="ws-field">
          <label htmlFor={`${id}-name`}>Type <strong>{workspace.name}</strong> to confirm</label>
          <input id={`${id}-name`} value={typed} onChange={(event) => setTyped(event.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false} disabled={busy} />
        </div>
        {error && <p className="ws-error" role="alert">{error}</p>}
        <div className="ws-dialog__actions">
          <button type="button" className="design-button secondary" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" className="design-button danger" disabled={!ready || busy} aria-busy={busy}>{busy ? 'Transferring…' : 'Transfer ownership'}</button>
        </div>
      </form>
    </Dialog>
  );
}
