import React, { useId, useState } from 'react';
import client from './client';
import Dialog, { ConfirmDialog } from './Dialog';
import { RolePill } from './ui';
import { ASSIGNABLE_ROLES, ROLE_DESCRIPTIONS, canEditPerson } from './roles';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RANK = { Admin: 3, Member: 2, Viewer: 1 };
// Lowering access, or anything that touches an Admin, is confirmed; raising Viewer to Member is not.
export const roleChangeNeedsConfirm = (from, to) => RANK[to] < RANK[from] || from === 'Admin' || to === 'Admin';

export default function MembersSection({ workspace, canManage, run }) {
  const [dialog, setDialog] = useState(null);
  const [rowError, setRowError] = useState({ key: '', message: '' });
  const [busyKey, setBusyKey] = useState('');
  const applyRole = async (person, role) => {
    setBusyKey(person.key); setRowError({ key: '', message: '' });
    const result = await run((revision) => client.putMember(workspace.id, person.email, role, revision), { success: `${person.name} is now ${role}.` });
    setBusyKey('');
    if (!result.ok && result.message) setRowError({ key: person.key, message: result.message });
    return result;
  };
  const chooseRole = (person, role) => {
    if (role === person.role) return;
    if (roleChangeNeedsConfirm(person.role, role)) setDialog({ type: 'role', person, role });
    else applyRole(person, role);
  };
  const headingId = useId();
  const close = () => setDialog(null);
  const people = [
    ...workspace.members.map((member) => ({ key: `m-${member.accountId}`, name: member.displayName, email: member.email, role: member.role, pending: false })),
    ...workspace.invites.map((invite) => ({ key: `i-${invite.email}`, name: invite.email, email: invite.email, role: invite.role, pending: true })),
  ];

  return (
    <section className="ws-section" aria-labelledby={headingId}>
      <div className="ws-section__head">
        <div>
          <h2 id={headingId}>People</h2>
          <p className="ws-muted">{canManage ? 'Roles apply to every project in this workspace.' : 'Everyone with access to this workspace.'}</p>
        </div>
        {canManage && <button type="button" className="design-button" onClick={() => setDialog({ type: 'invite' })}>Invite someone</button>}
      </div>

      <ul className="ws-rows">
        {people.map((person) => {
          const editable = canManage && person.email && canEditPerson(workspace.role, person.role);
          return (
            <li key={person.key} className="ws-row">
              <div className="ws-row__main">
                <strong>{person.name}</strong>
                {person.email && person.email !== person.name && <span className="ws-muted">{person.email}</span>}
                {person.pending && <span className="ws-muted">Invited. Joins when they sign in with this address.</span>}
                {rowError.key === person.key && <span className="ws-reason" role="alert">{rowError.message}</span>}
                {canManage && person.role === 'Owner' && workspace.role !== 'Owner' && <span className="ws-muted">Only the owner can change this.</span>}
              </div>
              <div className="ws-row__side">
                {editable ? (
                  <>
                    <select
                      className="ws-role-select"
                      aria-label={`Role for ${person.name}`}
                      value={person.role}
                      disabled={busyKey === person.key}
                      onChange={(event) => chooseRole(person, event.target.value)}
                    >
                      {ASSIGNABLE_ROLES.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    <button type="button" className="ws-link-button ws-link-button--danger" onClick={() => setDialog({ type: 'remove', person })}>{person.pending ? 'Cancel invite' : 'Remove'}<span className="sr-only"> {person.name}</span></button>
                  </>
                ) : <RolePill role={person.role} />}
              </div>
            </li>
          );
        })}
      </ul>

      {dialog?.type === 'invite' && (
        <RoleDialog
          title="Invite someone"
          submitLabel="Add to workspace"
          busyLabel="Adding…"
          askEmail
          initialRole="Member"
          onClose={close}
          onSubmit={({ email, role }) => run((revision) => client.putMember(workspace.id, email, role, revision), { success: `${email} added as ${role}.` })}
        >
          <p className="ws-hint">We do not send an email. If they have no Plotune account yet, they join as soon as they sign up with this address.</p>
        </RoleDialog>
      )}

      {dialog?.type === 'role' && (
        <RemoveDialog
          title={`Change ${dialog.person.name} to ${dialog.role}?`}
          confirmLabel={`Change to ${dialog.role}`}
          busyLabel="Saving…"
          danger={false}
          onCancel={close}
          onConfirm={() => applyRole(dialog.person, dialog.role)}
          onDone={close}
        >
          <p>{RANK[dialog.role] < RANK[dialog.person.role] ? 'They will have less access in every project of this workspace. ' : ''}{ROLE_DESCRIPTIONS[dialog.role]}</p>
        </RemoveDialog>
      )}

      {dialog?.type === 'remove' && (
        <RemoveDialog
          title={dialog.person.pending ? `Cancel the invitation for ${dialog.person.name}?` : `Remove ${dialog.person.name}?`}
          confirmLabel={dialog.person.pending ? 'Cancel invitation' : 'Remove from workspace'}
          busyLabel="Removing…"
          onCancel={close}
          onConfirm={() => run((revision) => client.removeMember(workspace.id, dialog.person.email, revision), { success: dialog.person.pending ? 'Invitation cancelled.' : `${dialog.person.name} was removed.` })}
          onDone={close}
        >
          <p>{dialog.person.pending ? 'They will not be added when they sign in.' : 'They lose access to every project in this workspace, including through connected apps. This takes effect within moments.'}</p>
        </RemoveDialog>
      )}
    </section>
  );
}

function RemoveDialog({ children, onConfirm, onDone, ...props }) {
  const [state, setState] = useState({ busy: false, error: '' });
  const confirm = async () => {
    setState({ busy: true, error: '' });
    const result = await onConfirm();
    if (result.ok) onDone(); else setState({ busy: false, error: result.message });
  };
  return <ConfirmDialog {...props} danger={props.danger !== false} busy={state.busy} error={state.error} onConfirm={confirm}>{children}</ConfirmDialog>;
}

// Invite (e-mail and role) or change a role. Owner is never offered: ownership moves by transfer.
export function RoleDialog({ title, submitLabel, busyLabel = 'Saving…', askEmail = false, initialRole, currentRole, onSubmit, onClose, children }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(initialRole);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const id = useId();
  const emailValue = email.trim();
  const emailProblem = askEmail && touched && !EMAIL.test(emailValue) ? 'Enter a full email address, like name@company.com.' : '';
  const unchanged = !askEmail && role === currentRole;

  const submit = async (event) => {
    event.preventDefault();
    setTouched(true);
    if (busy || (askEmail && !EMAIL.test(emailValue)) || unchanged) return;
    setBusy(true); setError('');
    const result = await onSubmit({ email: emailValue, role });
    setBusy(false);
    if (result.ok) onClose(); else setError(result.message);
  };

  return (
    <Dialog title={title} onClose={onClose} busy={busy} initialFocus={askEmail ? 'input' : 'input[type="radio"]:checked'}>
      <form onSubmit={submit} noValidate>
        {askEmail && (
          <div className="ws-field">
            <label htmlFor={`${id}-email`}>Email address</label>
            <input
              id={`${id}-email`}
              type="email"
              inputMode="email"
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => email && setTouched(true)}
              disabled={busy}
              aria-invalid={emailProblem ? 'true' : undefined}
              aria-describedby={emailProblem ? `${id}-email-problem` : undefined}
            />
            {emailProblem && <p id={`${id}-email-problem`} className="ws-error ws-error--field">{emailProblem}</p>}
          </div>
        )}
        <fieldset className="ws-fieldset" disabled={busy}>
          <legend>Role</legend>
          {ASSIGNABLE_ROLES.map((option) => (
            <label key={option} className="ws-check">
              <input type="radio" name={`${id}-role`} value={option} checked={role === option} onChange={() => setRole(option)} />
              <span><strong>{option}</strong><span>{ROLE_DESCRIPTIONS[option]}</span></span>
            </label>
          ))}
        </fieldset>
        {children}
        {error && <p className="ws-error" role="alert">{error}</p>}
        <div className="ws-dialog__actions">
          <button type="button" className="design-button secondary" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" className="design-button" disabled={busy || unchanged} aria-busy={busy}>{busy ? busyLabel : submitLabel}</button>
        </div>
      </form>
    </Dialog>
  );
}
