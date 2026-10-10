import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMail, FiX, FiCheck } from 'react-icons/fi';
import { posthog } from '../posthog';
import { buildContactPayload, isValidEmail, newSubmissionId, postLead } from '../utils/leadSubmission';
import { getFunnelContext } from '../utils/funnel';
import { trackGoogleAdsStreamEarlyAccessConversion } from '../utils/googleAds';
import './stream-demo.css';

export const INVITATION_KEY = 'plotune_stream_early_access_v1';
const readState = () => {
  try { return window.localStorage.getItem(INVITATION_KEY) || ''; } catch { return ''; }
};
const persist = (value) => {
  try { window.localStorage.setItem(INVITATION_KEY, value); } catch { /* Storage may be blocked; memory still works. */ }
};
const track = (event, properties) => {
  try { posthog.capture(event, properties); } catch { /* Tracking must never stop the demo. */ }
};

function Invitation({ email, setEmail, error, sending, onSubmit, onDismiss, honeypot, returnFocus }) {
  const ref = useRef(null);
  const close = useRef(onDismiss);
  close.current = onDismiss;
  useLayoutEffect(() => {
    const dialog = ref.current;
    const previous = returnFocus.current || document.activeElement;
    dialog.showModal();
    dialog.querySelector('input[type="email"]')?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) {
        const bounds = previous.getBoundingClientRect();
        const target = bounds.right < 0 || bounds.left >= window.innerWidth ? document.querySelector('[aria-label="Open workspace navigation"]') : previous;
        target?.focus();
      } else {
        // The floating opener is replaced while the dialog is mounted.
        queueMicrotask(() => document.querySelector('.stream-early-access-reopen')?.focus());
      }
    };
  }, [returnFocus]);
  return <dialog ref={ref} className="stream-invitation" aria-labelledby="stream-invitation-title" aria-describedby="stream-invitation-description"
    onCancel={(event) => { event.preventDefault(); close.current(); }}>
    <button type="button" className="stream-invitation-close" aria-label="Dismiss early access invitation" onClick={onDismiss}><FiX aria-hidden="true" /></button>
    <p className="stream-invitation-eyebrow">PLOTUNE STREAM / EARLY ACCESS</p>
    <h2 id="stream-invitation-title">Get early access to Stream.</h2>
    <p id="stream-invitation-description">Enjoying the interactive demo? Join the early access list to hear when you can connect your own systems.</p>
    <form onSubmit={onSubmit} noValidate>
      <div className="stream-invitation-honeypot" aria-hidden="true"><label>Leave this field empty<input ref={honeypot} name="hp_extra_field" tabIndex={-1} autoComplete="off" /></label></div>
      <label htmlFor="stream-early-access-email">Work email address</label>
      <input id="stream-early-access-email" className="ph-no-capture" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={254} autoFocus
        value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? 'stream-invitation-error' : undefined} />
      {error && <p id="stream-invitation-error" className="stream-invitation-error" role="alert">{error}</p>}
      <button type="submit" className="stream-invitation-submit" disabled={sending}>{sending ? 'Sending…' : 'Join the early access list'}</button>
      <button type="button" className="stream-invitation-ignore" onClick={onDismiss}>Not now</button>
      {sending && <p role="status">This can take a few seconds.</p>}
    </form>
    <p className="stream-invitation-footer">No account required. The demo remains available without signing up. <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy</a></p>
  </dialog>;
}

export default function StreamDemoWrapper({ children }) {
  const location = useLocation();
  const [state, setState] = useState(readState);
  const stateRef = useRef(state);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const pendingNavigation = useRef(null);
  const presented = useRef(false);
  const submitting = useRef(false);
  const submission = useRef({ email: '', id: '' });
  const honeypot = useRef(null);
  const returnFocus = useRef(null);
  const mounted = useRef(false);
  const properties = () => ({ source: 'stream_demo', view: new URLSearchParams(location.search).get('view') || 'events' });
  const changeState = useCallback((value) => { stateRef.current = value; persist(value); if (mounted.current) setState(value); }, []);

  useLayoutEffect(() => {
    mounted.current = true;
    const sync = (event) => {
      if (event.key !== INVITATION_KEY || !event.newValue) return;
      stateRef.current = event.newValue;
      setState(event.newValue);
      presented.current = false;
      setOpen(false);
    };
    window.addEventListener('storage', sync);
    return () => { mounted.current = false; window.removeEventListener('storage', sync); };
  }, []);

  useLayoutEffect(() => {
    const intent = pendingNavigation.current;
    if (!intent || intent.key === location.key) return;
    pendingNavigation.current = null;
    const params = new URLSearchParams(location.search);
    if (!intent.navigation && intent.project !== params.get('project')) return;
    if (!intent.navigation && intent.view === (params.get('view') || 'events') && intent.dashboard === params.get('dashboard')) return;
    // Capture the destination after the frozen demo's navigation committed, including a
    // selected Events click that pushes the same URL. Creation/project selection is excluded.
    if (stateRef.current || readState()) return;
    changeState('invited');
    presented.current = true;
    setOpen(true);
    track('stream_early_access_shown', { source: 'stream_demo', view: new URLSearchParams(location.search).get('view') || 'events' });
  }, [location.key, location.search, changeState]); // Initial/deep-link loads have no click intent.

  const navigation = (event) => {
    if (stateRef.current) return;
    const control = event.target.closest?.('button, a');
    if (!control) return;
    const params = new URLSearchParams(location.search);
    returnFocus.current = control;
    pendingNavigation.current = { key: location.key, view: params.get('view') || 'events', dashboard: params.get('dashboard'), project: params.get('project'),
      navigation: Boolean(control.closest('nav[aria-label="Workspace navigation"]')) };
  };
  const dismiss = () => {
    if (!presented.current) return;
    presented.current = false;
    setOpen(false);
    if (stateRef.current !== 'submitted') changeState('dismissed');
    track('stream_early_access_dismissed', properties());
  };
  const reopen = (event) => {
    if (stateRef.current === 'submitted' || presented.current) return;
    returnFocus.current = event.currentTarget;
    presented.current = true;
    setOpen(true);
    track('stream_early_access_reopened', properties());
  };
  const submit = async (event) => {
    event.preventDefault();
    if (submitting.current || stateRef.current === 'submitted' || readState() === 'submitted') return;
    if (!isValidEmail(email)) { setError('Enter a valid work email address.'); document.getElementById('stream-early-access-email')?.focus(); return; }
    const key = email.trim().toLowerCase();
    if (submission.current.email !== key) submission.current = { email: key, id: newSubmissionId() };
    const id = submission.current.id;
    const props = properties();
    const website = honeypot.current?.value || '';
    submitting.current = true;
    setSending(true);
    setError('');
    let outcome;
    try {
      outcome = await postLead(buildContactPayload({ email, topic: 'Plotune Stream Early Access',
        message: 'Early access request submitted from the Plotune Stream interactive demo.',
        funnel: { ...getFunnelContext(), source: 'stream_demo' }, website, submissionId: id }));
    } catch { outcome = { status: 'error' }; }
    submitting.current = false;
    if (mounted.current) setSending(false);
    if (outcome.status !== 'sent' || website) {
      if (mounted.current) setError(outcome.status === 'not_configured' ? 'The early access list is not connected in this build. Nothing was sent.' : 'We couldn’t send that just now. Your email is still here; please try again.');
      return;
    }
    if (readState() !== 'submitted' && stateRef.current !== 'submitted') {
      changeState('submitted');
      const googleAdsConversion = trackGoogleAdsStreamEarlyAccessConversion(id);
      track('stream_early_access_submitted', { ...props, google_ads_conversion: googleAdsConversion });
    }
    presented.current = false;
    if (mounted.current) { setOpen(false); setEmail(''); setSuccess(true); }
  };
  return <>
    <div className="stream-demo-wrapper" onClickCapture={navigation}>{children}</div>
    {open && <Invitation email={email} setEmail={setEmail} error={error} sending={sending} onSubmit={submit} onDismiss={dismiss} honeypot={honeypot} returnFocus={returnFocus} />}
    {state && state !== 'submitted' && !open && <button type="button" className="stream-early-access-reopen" aria-label="Reopen Stream early access invitation" title="Stream early access" onClick={reopen}><FiMail aria-hidden="true" /></button>}
    {success && <div className="stream-early-access-success" role="status"><FiCheck aria-hidden="true" /><span>You’re on the early access list. Keep exploring.</span><button type="button" aria-label="Dismiss success message" onClick={() => setSuccess(false)}><FiX aria-hidden="true" /></button></div>}
  </>;
}
