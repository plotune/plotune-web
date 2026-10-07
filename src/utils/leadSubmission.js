import { ATTRIBUTION_KEYS, getAttribution } from './attribution';

// ---------------------------------------------------------------------------------------------
// Lead submission transport, shared by the AI readiness assessment and the contact form.
//
// Both post to the same Google Apps Script web app (integrations/ai-readiness-apps-script/Code.gs,
// URL in REACT_APP_AI_READINESS_ENDPOINT, see .env.production). The script tells the two apart by
// the payload's `kind` ('contact'; assessment payloads have none) and files them in separate tabs
// of the same Google Sheet ("Leads" and "Contact").
//
// postLead() resolves to one of three honest statuses:
//   'not_configured' -- no endpoint is set; NOTHING was sent or stored. The UI says so.
//   'sent'           -- the endpoint confirmed it saved the lead ({ "ok": true }).
//   'error'          -- the endpoint is configured but the request failed; the UI offers a retry.
//
// Transport notes (Apps Script specific):
//  - The body is JSON sent as Content-Type text/plain: a CORS "simple request" (no preflight),
//    because Apps Script web apps cannot answer a preflight OPTIONS request.
//  - Apps Script replies HTTP 200 even for its own errors, so success is only ever
//    { "ok": true } in the JSON reply; anything else is treated as a failed send.
// Nothing secret may live in this client bundle: the endpoint URL is public by nature, so spam
// protection lives server-side (honeypot, size and email validation, rate limits).
// ---------------------------------------------------------------------------------------------

const ENDPOINT = process.env.REACT_APP_AI_READINESS_ENDPOINT || '';
// Apps Script web apps can take 5-15 s on a cold start; a short timeout would show the visitor an
// error for a lead that was actually saved (and invite a duplicate retry).
const TIMEOUT_MS = 25000;

// Deliberately simple: catches typos, not a full RFC 5322 parse (the server must re-validate).
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isValidEmail = (value) => EMAIL_PATTERN.test(value.trim());

export const isLeadEndpointConfigured = () => Boolean(ENDPOINT);

// The visit's ad attribution (captured on the landing page, even if the visitor arrived at this
// page later), then anything on the current URL, which wins. Click ids are kept for a later
// offline-conversion upload.
export const readAttribution = (funnel = {}) => {
  const { landing_path: adLandingPath, ...visit } = getAttribution() || {};
  const params = new URLSearchParams(window.location.search);
  const current = {};
  params.forEach((value, key) => { if (ATTRIBUTION_KEYS.includes(key) || key.startsWith('utm_') || key === 'ref') current[key] = value.slice(0, 300); });
  return {
    ...visit, ...funnel, ...current,
    ad_landing_path: adLandingPath || null,
    referrer: document.referrer || null,
    landing_path: window.location.pathname,
  };
};

export const newSubmissionId = () => {
  try {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
  } catch {
    // fall through
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
};

export const postLead = async (payload) => {
  if (!ENDPOINT) return { status: 'not_configured' };

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) return { status: 'error' };
    const reply = await response.json().catch(() => null);
    return { status: reply && reply.ok === true ? 'sent' : 'error' };
  } catch {
    return { status: 'error' };
  } finally {
    window.clearTimeout(timer);
  }
};

// Contact-form payload. The message travels only to the endpoint (never to analytics).
export const buildContactPayload = ({ email, message, topic = null, funnel = {}, website = '', submissionId = '' }) => ({
  kind: 'contact',
  email: email.trim(),
  message: message.trim().slice(0, 3000),
  topic,
  page: window.location.pathname,
  attribution: readAttribution(funnel),
  submittedAt: new Date().toISOString(),
  submissionId,
  website,
});
