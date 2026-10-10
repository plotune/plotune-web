// Google Ads conversions, sent through the Google tag (gtag.js) loaded in public/index.html.
//
//   "Kişi" (contact)          -- a contact-form message confirmed saved by the backend
//                                (src/components/ContactForm.jsx): a real conversation, not a tap
//                                on a mailto: link (15 such taps produced 1 email).
//   "AI Readiness Lead"       -- a confirmed AI-readiness lead (email saved by the backend). Its own
//                                action, so Google Ads can value and report it apart from Kişi.
//
// Values are not sent from here: each action's default value (set in Google Ads) applies.
// Each action counts at most once per browser session, so double clicks or a retried submit don't
// count twice. Inactive (no-op) when the send_to value isn't configured or the tag is blocked
// (ad blockers), and never throws into the handler that calls it.
const CONTACT_SEND_TO = process.env.REACT_APP_GOOGLE_ADS_CONTACT_SEND_TO || '';
const AI_READINESS_SEND_TO = process.env.REACT_APP_GOOGLE_ADS_AI_READINESS_SEND_TO || '';

const alreadyConverted = (key) => {
  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
};

const markConverted = (key) => {
  try {
    window.sessionStorage.setItem(key, '1');
  } catch {
    // storage blocked: may count again on a later click, acceptable
  }
};

const trackConversion = (sendTo, sessionKey, extra = {}) => {
  if (!sendTo || typeof window === 'undefined' || typeof window.gtag !== 'function') return false;
  if (alreadyConverted(sessionKey)) return false;
  try {
    // beacon transport: a mail client opening or the page changing must not cancel the request
    window.gtag('event', 'conversion', Object.assign({ send_to: sendTo, transport_type: 'beacon' }, extra));
    markConverted(sessionKey);
    return true;
  } catch {
    return false;
  }
};

export const trackGoogleAdsContactConversion = () => trackConversion(CONTACT_SEND_TO, 'plotune_gads_contact_converted');

// transaction_id lets Google drop a duplicate of the same lead (e.g. the same submission sent from
// a second tab).
export const trackGoogleAdsAiReadinessConversion = (submissionId) => trackConversion(
  AI_READINESS_SEND_TO,
  'plotune_gads_ai_readiness_converted',
  submissionId ? { transaction_id: submissionId } : {},
);

// Independent action: never reuse the ordinary Contact/AI Readiness send_to.
const STREAM_EARLY_ACCESS_SEND_TO = process.env.REACT_APP_GOOGLE_ADS_STREAM_EARLY_ACCESS_SEND_TO || '';
export const trackGoogleAdsStreamEarlyAccessConversion = (submissionId) => trackConversion(
  STREAM_EARLY_ACCESS_SEND_TO,
  'plotune_gads_stream_early_access_converted',
  submissionId ? { transaction_id: submissionId } : {},
);
