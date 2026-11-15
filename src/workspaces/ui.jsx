import React from 'react';
import { Link } from 'react-router-dom';
import { failureMessage, isRetryable } from './errors';

export const RolePill = ({ role }) => <span className={`ws-pill ws-pill--${String(role).toLowerCase()}`}>{role}</span>;

// Status text that screen readers announce: alerts for problems, polite status for the rest.
export function Banner({ tone = 'info', children, action }) {
  return (
    <div className={`ws-banner ws-banner--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <p>{children}</p>
      {action}
    </div>
  );
}

export function Loading({ label }) {
  return (
    <div className="ws-loading" role="status" aria-live="polite">
      <span className="ws-loading__bar" aria-hidden="true" />
      <span className="ws-loading__bar ws-loading__bar--short" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

// A whole-screen failure: says what happened in plain words and offers the way forward.
export function ErrorState({ failure, onRetry, backTo = '/workspaces', backLabel = 'Back to workspaces', what = 'this page' }) {
  const missing = failure?.status === 404;
  return (
    <div className="ws-state" data-state={missing ? 'not-found' : 'error'}>
      <h2>{missing ? 'We could not find that workspace' : `We could not load ${what}`}</h2>
      <p role="alert">{failureMessage(failure)}</p>
      <div className="ws-state__actions">
        {onRetry && isRetryable(failure) && <button type="button" className="design-button" onClick={onRetry}>Try again</button>}
        <Link to={backTo} className="design-button secondary">{backLabel}</Link>
      </div>
    </div>
  );
}

export const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};
