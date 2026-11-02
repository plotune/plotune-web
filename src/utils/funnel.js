import { getAttribution } from './attribution';

const STORAGE_KEY = 'plotune_funnel';
const TRACKED_KEYS = ['segment', 'article', 'solution', 'entry_source'];

const readContext = () => {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeContext = (context) => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
  } catch {
    // sessionStorage unavailable (private mode, blocked storage) — tracking is best-effort
  }
};

const inferEntrySource = () => {
  const params = new URLSearchParams(window.location.search);
  const explicit = params.get('utm_source') || params.get('ref');
  if (explicit) return explicit;
  // Ad clicks without utm_source (Google Ads auto-tagging: gclid / gad_*), or a page reached
  // after the landing page: fall back to the visit's stored attribution.
  if (params.get('gclid') || params.get('gbraid') || params.get('wbraid') || params.get('gad_source') || params.get('gad_campaignid')) return 'google_ads';
  if (params.get('li_fat_id')) return 'linkedin';
  const visit = getAttribution();
  if (visit && (visit.utm_source || visit.platform)) return visit.utm_source || visit.platform;
  if (!document.referrer) return 'direct';
  try {
    const referrerHost = new URL(document.referrer).hostname;
    return referrerHost === window.location.hostname ? 'internal' : referrerHost;
  } catch {
    return 'unknown';
  }
};

// Records a funnel touchpoint (article read, solution page view, ...). entry_source is
// captured once per session (first touch) and never overwritten by later pages.
export const captureFunnelTouch = (fields = {}) => {
  const next = readContext();
  if (!next.entry_source) next.entry_source = inferEntrySource();
  Object.entries(fields).forEach(([key, value]) => { if (value) next[key] = value; });
  writeContext(next);
  return next;
};

export const getFunnelContext = () => readContext();

// Builds an internal link that carries the session's funnel context forward as query params.
// entry_source is resolved synchronously (stored value, else inferred live) rather than read
// from storage alone, so it's correct even on a visitor's first page — before the mount effect
// that persists it to sessionStorage has had a chance to run.
export const withFunnelParams = (path, extra = {}) => {
  const stored = readContext();
  const context = { ...stored, entry_source: stored.entry_source || inferEntrySource(), ...extra };
  const params = new URLSearchParams();
  TRACKED_KEYS.forEach((key) => { if (context[key]) params.set(key, context[key]); });
  const query = params.toString();
  return query ? `${path}?${query}` : path;
};

// Which product a path belongs to, so /contact can speak about what the visitor was just looking at.
// Pages that belong to no single product (home, about, research, docs index ...) return null and leave
// whatever was recorded before untouched.
export const productForPath = (pathname = '') => {
  const path = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const under = (base) => path === base || path.startsWith(`${base}/`);
  if (under('/bridge') || path === '/request') return 'bridge';
  if (under('/stream') || path === '/streams') return 'stream';
  if (under('/nexus') || under('/solutions') || under('/docs/nexus') || path === '/ai-readiness' || path === '/agentic-test-development') return 'nexus';
  return null;
};

// Records the product area the visitor is in (and, on a product page, which item: "Bridge DAQ"). An item
// belongs to its product, so it is dropped when the visitor moves to another product. Session only.
export const recordProductVisit = (product, item = '') => {
  const next = readContext();
  if (!next.entry_source) next.entry_source = inferEntrySource();
  if (next.product !== product) delete next.item;
  next.product = product;
  if (item) next.item = item;
  writeContext(next);
  return next;
};

// A /contact link that names the product outright (more robust than the session memory: it also works
// when storage is blocked and when a link is opened in a new tab).
export const contactHref = (product) => {
  const base = withFunnelParams('/contact');
  return `${base}${base.includes('?') ? '&' : '?'}product=${encodeURIComponent(product)}`;
};
