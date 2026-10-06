// Ad / campaign attribution for the whole visit, not just the landing page.
//
// Ad clicks only carry their parameters on the landing URL (e.g. /nexus/?gclid=...&gad_campaignid=
// ... or ?li_fat_id=...&utm_source=linkedin). As soon as the visitor moves on inside the site
// (Nexus -> Contact), those parameters are gone from the URL, so in PostHog the Contact page view
// and the email click could not be tied back to the campaign. (Google Ads and LinkedIn themselves
// are fine: their tags keep the click id in a first-party cookie.)
//
// captureAttribution() runs once when the app loads: if the URL carries any of ATTRIBUTION_KEYS
// (a fresh ad or campaign click), they become this tab's attribution for the session, replacing an
// older one; otherwise the stored attribution is kept. posthog.js adds it to every event as attr_*
// properties, and lead submissions include it too.
//
// sessionStorage: one tab, until it closes. Best effort -- blocked storage just means no carry-over.

export const ATTRIBUTION_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id',
  'gclid', 'gbraid', 'wbraid', 'gad_source', 'gad_campaignid',
  'li_fat_id', 'fbclid', 'msclkid',
];

const STORAGE_KEY = 'plotune_attribution';
let cached; // undefined = not read yet, null = none

export const detectPlatform = (p) => {
  if (p.gclid || p.gbraid || p.wbraid || p.gad_source || p.gad_campaignid) return 'google_ads';
  if (p.li_fat_id || /linkedin/i.test(p.utm_source || '')) return 'linkedin';
  if (p.fbclid) return 'meta';
  if (p.msclkid) return 'microsoft_ads';
  return p.utm_source ? String(p.utm_source).toLowerCase() : null;
};

export const getAttribution = () => {
  if (cached !== undefined) return cached;
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || 'null');
    cached = parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    cached = null;
  }
  return cached;
};

export const captureAttribution = (loc = typeof window !== 'undefined' ? window.location : null) => {
  if (!loc) return null;
  let params;
  try {
    params = new URLSearchParams(loc.search);
  } catch {
    return getAttribution();
  }
  const picked = {};
  ATTRIBUTION_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) picked[key] = value.slice(0, 300);
  });
  if (!Object.keys(picked).length) return getAttribution();

  const record = { ...picked, platform: detectPlatform(picked), landing_path: loc.pathname };
  cached = record;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // storage blocked: attribution still applies for this page load via the in-memory copy
  }
  return record;
};

// attr_platform, attr_utm_source, attr_gad_campaignid, attr_landing_path, ...
export const attributionEventProperties = (record = getAttribution()) => {
  if (!record) return {};
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [`attr_${key}`, value]));
};

// Test hook.
export const resetAttributionCache = () => { cached = undefined; };
