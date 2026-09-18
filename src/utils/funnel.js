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
