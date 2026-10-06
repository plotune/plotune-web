// Google Ads "Kişi" (contact) conversion, sent through the Google tag (gtag.js) loaded in
// public/index.html. Fired on real contact intent only: the contact-email buttons on /contact and
// /nexus/use-cases, and a confirmed AI-readiness lead. Not on support / privacy / partner mailto
// links, which aren't leads.
//
// At most once per browser session, so double clicks or "emailed us AND took the assessment"
// count as one contact. Inactive (no-op) when the send_to value isn't configured or the tag is
// blocked (ad blockers), and never throws into the click handler that calls it.
const CONTACT_SEND_TO = process.env.REACT_APP_GOOGLE_ADS_CONTACT_SEND_TO || '';
const SESSION_KEY = 'plotune_gads_contact_converted';

const alreadyConverted = () => {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
};

const markConverted = () => {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // storage blocked: may count again on a later click, acceptable
  }
};

export const trackGoogleAdsContactConversion = () => {
  if (!CONTACT_SEND_TO || typeof window === 'undefined' || typeof window.gtag !== 'function') return false;
  if (alreadyConverted()) return false;
  try {
    // beacon transport: the mail client opening must not cancel the request
    window.gtag('event', 'conversion', { send_to: CONTACT_SEND_TO, transport_type: 'beacon' });
    markConverted();
    return true;
  } catch {
    return false;
  }
};
