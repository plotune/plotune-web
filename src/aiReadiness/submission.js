import { ASSESSMENT_VERSION } from './questions';
import { SCORING_VERSION } from './scoring';
import { ATTRIBUTION_KEYS, getAttribution } from '../utils/attribution';

// ---------------------------------------------------------------------------------------------
// Email submission boundary -- V1
//
// There is NO production backend for the detailed assessment yet, and this module does not
// pretend there is. It resolves to one of three honest statuses:
//
//   'not_configured' -- no endpoint is set; NOTHING was sent or stored. The UI says so.
//   'sent'           -- the configured endpoint accepted the payload (HTTP 2xx).
//   'error'          -- the endpoint is configured but the request failed; the UI offers a retry.
//
// The real flow is wired by setting REACT_APP_AI_READINESS_ENDPOINT at build time (see
// .env.production) to the deployed Google Apps Script web app in
// integrations/ai-readiness-apps-script/Code.gs, which writes the lead to a Google Sheet and
// sends the emails. Nothing secret may live in this client bundle: the endpoint URL is public by
// nature, so spam protection lives server-side (honeypot, size and email validation), and any
// API keys (LLM, mail provider, ...) belong behind the endpoint, never here.
//
// Transport notes (Apps Script specific):
//  - The body is JSON but sent as Content-Type text/plain. That makes it a CORS "simple request"
//    (no preflight), because Apps Script web apps cannot answer a preflight OPTIONS request.
//  - Apps Script replies HTTP 200 even for its own errors, so success is only ever
//    { "ok": true } in the JSON reply; anything else is treated as a failed send.
//
// Payload shape (this is the contract the future backend should accept):
//   {
//     email, answers: { interfaces[], tools[], bottlenecks[], automation, otherText{...} },
//     result: { score, assessedAreas, totalAreas, confidence, band, areas },
//     attribution: { entry_source, utm_* , referrer, ... },
//     versions: { assessment, scoring }, submittedAt,
//     submissionId <- same value on retries of one lead; the backend de-duplicates on it
//     website   <- hidden honeypot field; always empty for real visitors
//   }
// ---------------------------------------------------------------------------------------------

const ENDPOINT = process.env.REACT_APP_AI_READINESS_ENDPOINT || '';
// Apps Script web apps can take 5-15 s on a cold start; a short timeout would show the visitor an
// error for a lead that was actually saved (and invite a duplicate retry).
const TIMEOUT_MS = 25000;

// Deliberately simple: catches typos, not a full RFC 5322 parse (the server must re-validate).
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isValidEmail = (value) => EMAIL_PATTERN.test(value.trim());

const readAttribution = (funnel) => {
  // The visit's ad attribution (captured on the landing page, even if the visitor arrived at this
  // page later), then anything on the current URL, which wins. Click ids are kept for a later
  // offline-conversion upload.
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

export const buildSubmissionPayload = ({ email, answers, result, funnel = {}, website = '', submissionId = '' }) => ({
  email: email.trim(),
  answers,
  result: {
    score: result.score,
    assessedAreas: result.assessedAreas,
    totalAreas: result.totalAreas,
    confidence: result.confidence,
    band: result.band,
    areas: result.areas,
  },
  attribution: readAttribution(funnel),
  versions: { assessment: ASSESSMENT_VERSION, scoring: SCORING_VERSION },
  submittedAt: new Date().toISOString(),
  submissionId,
  website,
});

export const isSubmissionConfigured = () => Boolean(ENDPOINT);

export const submitAssessment = async (payload) => {
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
