import React, { useId, useState } from 'react';
import Dialog from './Dialog';

// A single-field dialog (create or rename). `onSubmit(value)` resolves { ok, message }.
export default function NameDialog({ title, label, hint, initial = '', submitLabel, busyLabel, onSubmit, onClose, children, maxLength = 64 }) {
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const id = useId();
  const [extra, setExtra] = useState({});
  const name = value.trim();
  const changed = name !== initial.trim();

  const submit = async (event) => {
    event.preventDefault();
    if (!name || !changed || busy) return;
    setBusy(true); setError('');
    const result = await onSubmit(name, extra);
    setBusy(false);
    if (result.ok) onClose(); else setError(result.message);
  };

  return (
    <Dialog title={title} onClose={onClose} busy={busy} initialFocus="input">
      <form onSubmit={submit} noValidate>
        <div className="ws-field">
          <label htmlFor={id}>{label}</label>
          <input id={id} value={value} onChange={(event) => setValue(event.target.value)} maxLength={maxLength} autoComplete="off" disabled={busy} aria-describedby={hint ? `${id}-hint` : undefined} />
          {hint && <p id={`${id}-hint`} className="ws-hint">{hint}</p>}
        </div>
        {typeof children === 'function' ? children({ extra, setExtra, busy }) : children}
        {error && <p className="ws-error" role="alert">{error}</p>}
        <div className="ws-dialog__actions">
          <button type="button" className="design-button secondary" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" className="design-button" disabled={!name || !changed || busy} aria-busy={busy}>{busy ? busyLabel || 'Saving…' : submitLabel}</button>
        </div>
      </form>
    </Dialog>
  );
}
