import { ASSESSMENT_VERSION } from './questions';
import { SCORING_VERSION } from './scoring';

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
// To wire the real flow later, set REACT_APP_AI_READINESS_ENDPOINT at build time to a
// first-party URL that accepts the JSON payload below (e.g. an Apps Script / serverless
// function that stores the lead and kicks off the analysis agent). Nothing secret may live in
// this client bundle: the endpoint must authenticate/rate-limit server-side, and any API keys
// (LLM, mail provider, ...) belong behind it, never here.
//
// Payload shape (this is the contract the future backend should accept):
//   {
//     email, answers: { interfaces[], tools[], bottlenecks[], automation, otherText{...} },
//     result: { score, assessedAreas, totalAreas, confidence, band, areas },
//     attribution: { entry_source, utm_* , referrer, ... },
//     versions: { assessment, scoring }, submittedAt
//   }
// ---------------------------------------------------------------------------------------------

const ENDPOINT = process.env.REACT_APP_AI_READINESS_ENDPOINT || '';
const TIMEOUT_MS = 10000;

// Deliberately simple: catches typos, not a full RFC 5322 parse (the server must re-validate).
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isValidEmail = (value) => EMAIL_PATTERN.test(value.trim());

const readAttribution = (funnel) => {
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  params.forEach((value, key) => { if (key.startsWith('utm_') || key === 'ref') utm[key] = value; });
  return { ...funnel, ...utm, referrer: document.referrer || null, landing_path: window.location.pathname };
};

export const buildSubmissionPayload = ({ email, answers, result, funnel = {} }) => ({
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
});

export const isSubmissionConfigured = () => Boolean(ENDPOINT);

export const submitAssessment = async (payload) => {
  if (!ENDPOINT) return { status: 'not_configured' };

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return { status: response.ok ? 'sent' : 'error' };
  } catch {
    return { status: 'error' };
  } finally {
    window.clearTimeout(timer);
  }
};
