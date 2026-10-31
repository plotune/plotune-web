// Plotune Bridge sign-in hand-off. Bridge (bridge.plotune.net) has no login form of its own:
// it sends the browser to /bridge/authorize, and this site returns a one-time code in the URL
// fragment. The return origin is a constant; no URL parameter can change it.
export const BRIDGE_RETURN_URL = 'https://bridge.plotune.net/';
export const BRIDGE_LOGIN_RETURN_KEY = 'bridge_login_return';

export const BRIDGE_CODE_CHALLENGE = /^[A-Za-z0-9_-]{43}$/;
export const BRIDGE_STATE = /^[A-Za-z0-9_-]{16,128}$/;
export const BRIDGE_ONE_TIME_CODE = /^[A-Za-z0-9_-]{43}$/;

// Login `next` is accepted only for the authorize route itself. The query may carry only the
// characters the hand-off produces (no '/', ':', '#' or backslash), so no scheme, no protocol-
// relative prefix and no dot-segment path can get through, including after one decoding pass.
const BRIDGE_NEXT = /^\/bridge\/authorize(\?[A-Za-z0-9_.~=&%+-]*)?$/;

export function safeBridgeNext(value) {
  if (typeof value !== 'string' || value.length > 512) return null;
  if (!value.startsWith('/bridge/authorize')) return null;
  if (value.includes('//') || value.includes('\\') || value.includes(':')) return null;
  return BRIDGE_NEXT.test(value) ? value : null;
}

// Storage access can throw (private windows, blocked site data); a failed write just means the
// user lands on the default destination after GitHub, which is the existing behaviour.
// Always replaces the previous value, so an abandoned attempt cannot leak into a later login.
export function rememberBridgeLoginReturn(next) {
  const safe = safeBridgeNext(next);
  try {
    if (safe) sessionStorage.setItem(BRIDGE_LOGIN_RETURN_KEY, safe);
    else sessionStorage.removeItem(BRIDGE_LOGIN_RETURN_KEY);
  } catch { /* ignore */ }
}

// Reads and always removes the stored value, so it is consumed once; the result is validated again.
export function takeBridgeLoginReturn() {
  try {
    const stored = sessionStorage.getItem(BRIDGE_LOGIN_RETURN_KEY);
    sessionStorage.removeItem(BRIDGE_LOGIN_RETURN_KEY);
    return safeBridgeNext(stored);
  } catch {
    return null;
  }
}
