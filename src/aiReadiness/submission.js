import { ASSESSMENT_VERSION } from './questions';
import { SCORING_VERSION } from './scoring';
import { isLeadEndpointConfigured, postLead, readAttribution } from '../utils/leadSubmission';

export { EMAIL_PATTERN, isValidEmail, newSubmissionId } from '../utils/leadSubmission';

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
// Transport (endpoint, text/plain POST, {"ok":true} check, timeout) is shared with the contact form
// in src/utils/leadSubmission.js.
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

export const isSubmissionConfigured = isLeadEndpointConfigured;

export const submitAssessment = (payload) => postLead(payload);
