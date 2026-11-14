// Claim helper for the Stream and RMS pages (contract section 6.3). Nothing here is used by the
// workspace administration pages themselves.
//
// A claim is one short-lived token for one (project, service). It is kept in memory only: never
// in the cookie, localStorage or sessionStorage. There are no timers. A claim is requested when
// the user opens a service and is renewed when it is used after 720 s of age, so a tab nobody is
// using makes no requests, and a hidden tab never renews one.
export const CLAIM_REFRESH_AFTER_MS = 720 * 1000;
const CLAIM_REJECTIONS = new Set(['claim_expired', 'claim_revoked', 'invalid_token', 'invalid_claim']);

// A 401 from Stream or RMS about the claim (not a 401 from the claim request, which means the
// account session ended and must be handled by the caller).
export const isClaimRejection = (error) => error?.status === 401 && CLAIM_REJECTIONS.has(error.code);

export function createClaimManager({
  requestClaim,
  now = Date.now,
  isVisible = () => typeof document === 'undefined' || document.visibilityState !== 'hidden',
}) {
  const claims = new Map();
  const pending = new Map();
  const keyOf = (workspaceId, projectId, service) => `${workspaceId}|${projectId}|${service}`;

  async function fetchClaim(key, workspaceId, projectId, service) {
    if (!pending.has(key)) {
      const request = requestClaim(workspaceId, projectId, service)
        .then((claim) => {
          const stored = { ...claim, obtainedAt: now(), expiresAtMs: Date.parse(claim.expiresAt) };
          claims.set(key, stored);
          return stored;
        })
        .finally(() => pending.delete(key));
      pending.set(key, request);
    }
    return pending.get(key);
  }

  async function getClaim(workspaceId, projectId, service, { force = false } = {}) {
    const key = keyOf(workspaceId, projectId, service);
    const current = claims.get(key);
    const valid = Boolean(current) && now() < current.expiresAtMs;
    if (!force && valid && now() - current.obtainedAt < CLAIM_REFRESH_AFTER_MS) return current;
    if (!force && current && !isVisible()) {
      // A hidden tab keeps using a claim that is still valid but never asks for a new one.
      if (valid) return current;
      const hidden = new Error('A claim is not renewed while the tab is hidden.');
      hidden.status = 0;
      hidden.code = 'tab_hidden';
      throw hidden;
    }
    return fetchClaim(key, workspaceId, projectId, service);
  }

  // Runs `call(token)`; if the service rejects the claim, requests one new claim and retries once.
  async function withClaim(workspaceId, projectId, service, call) {
    const claim = await getClaim(workspaceId, projectId, service);
    try {
      return await call(claim.token);
    } catch (error) {
      if (!isClaimRejection(error)) throw error;
      claims.delete(keyOf(workspaceId, projectId, service));
      const renewed = await getClaim(workspaceId, projectId, service, { force: true });
      return call(renewed.token);
    }
  }

  return { getClaim, withClaim, clear: () => claims.clear() };
}
