import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Modal dialog: focus moves in, Tab stays inside, Escape closes, focus returns to the control
// that opened it. `busy` blocks closing while a request is running.
export default function Dialog({ title, children, onClose, busy = false, initialFocus }) {
  const titleId = useId();
  const panel = useRef(null);
  const opener = useRef(typeof document === 'undefined' ? null : document.activeElement);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const busyRef = useRef(busy);
  busyRef.current = busy;

  useEffect(() => {
    const node = panel.current;
    const target = (initialFocus && node.querySelector(initialFocus)) || node.querySelector('[data-autofocus]') || node.querySelector(FOCUSABLE) || node;
    target.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        if (!busyRef.current) onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = [...node.querySelectorAll(FOCUSABLE)];
      if (!items.length) { event.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === node)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown, true);
    const returnTo = opener.current;
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      if (returnTo && typeof returnTo.focus === 'function' && document.contains(returnTo)) returnTo.focus();
    };

  }, []);

  return createPortal(
    <div className="ws-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <div className="ws-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} ref={panel}>
        <h2 id={titleId} className="ws-dialog__title">{title}</h2>
        {children}
      </div>
    </div>,
    document.body,
  );
}

// A destructive or revoking step. With `confirmText` the person must type it before the button works.
export function ConfirmDialog({ title, children, confirmLabel, busyLabel, danger = false, confirmText, error, busy, onConfirm, onCancel }) {
  const [typed, setTyped] = React.useState('');
  const inputId = useId();
  const ready = !confirmText || typed === confirmText;
  return (
    <Dialog title={title} onClose={onCancel} busy={busy} initialFocus={confirmText ? 'input' : '[data-cancel]'}>
      <form
        onSubmit={(event) => { event.preventDefault(); if (ready && !busy) onConfirm(); }}
      >
        <div className="ws-dialog__body">{children}</div>
        {confirmText && (
          <div className="ws-field">
            <label htmlFor={inputId}>Type <strong>{confirmText}</strong> to confirm</label>
            <input id={inputId} value={typed} onChange={(event) => setTyped(event.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false} disabled={busy} />
          </div>
        )}
        {error && <p className="ws-error" role="alert">{error}</p>}
        <div className="ws-dialog__actions">
          <button type="button" className="design-button secondary" data-cancel onClick={onCancel} disabled={busy}>Cancel</button>
          <button type="submit" className={`design-button${danger ? ' danger' : ''}`} disabled={!ready || busy} aria-busy={busy}>{busy ? busyLabel || 'Working…' : confirmLabel}</button>
        </div>
      </form>
    </Dialog>
  );
}
