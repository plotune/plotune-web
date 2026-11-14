import { CLAIM_REFRESH_AFTER_MS, createClaimManager, isClaimRejection } from './claims';

const rejection = (code) => Object.assign(new Error(code), { status: 401, code });

function setup({ visible = true } = {}) {
  let clock = 1_000_000;
  let sequence = 0;
  const state = { visible };
  const requestClaim = jest.fn(async () => {
    sequence += 1;
    return { service: 'stream', token: `token-${sequence}`, expiresAt: new Date(clock + 900_000).toISOString(), role: 'Member', projectRevision: 1 };
  });
  const manager = createClaimManager({ requestClaim, now: () => clock, isVisible: () => state.visible });
  return { manager, requestClaim, state, advance: (ms) => { clock += ms; } };
}

test('a claim is requested lazily, once, and reused while young', async () => {
  const { manager, requestClaim, advance } = setup();
  expect(requestClaim).not.toHaveBeenCalled();
  const [a, b] = await Promise.all([manager.getClaim('w', 'p', 'stream'), manager.getClaim('w', 'p', 'stream')]);
  expect(a.token).toBe('token-1');
  expect(b.token).toBe('token-1');
  advance(CLAIM_REFRESH_AFTER_MS - 1);
  expect((await manager.getClaim('w', 'p', 'stream')).token).toBe('token-1');
  expect(requestClaim).toHaveBeenCalledTimes(1);
});

test('one claim per project and service', async () => {
  const { manager, requestClaim } = setup();
  await manager.getClaim('w', 'p1', 'stream');
  await manager.getClaim('w', 'p1', 'rms');
  await manager.getClaim('w', 'p2', 'stream');
  expect(requestClaim.mock.calls.map((call) => call.join(':'))).toEqual(['w:p1:stream', 'w:p1:rms', 'w:p2:stream']);
});

test('use after 720 s renews the claim', async () => {
  const { manager, requestClaim, advance } = setup();
  await manager.getClaim('w', 'p', 'stream');
  advance(CLAIM_REFRESH_AFTER_MS);
  expect((await manager.getClaim('w', 'p', 'stream')).token).toBe('token-2');
  expect(requestClaim).toHaveBeenCalledTimes(2);
});

test('a hidden tab never renews: it keeps a still-valid claim and refuses an expired one', async () => {
  const { manager, requestClaim, state, advance } = setup();
  await manager.getClaim('w', 'p', 'stream');
  state.visible = false;
  advance(CLAIM_REFRESH_AFTER_MS + 1000);
  expect((await manager.getClaim('w', 'p', 'stream')).token).toBe('token-1');
  advance(200_000);
  await expect(manager.getClaim('w', 'p', 'stream')).rejects.toMatchObject({ code: 'tab_hidden' });
  expect(requestClaim).toHaveBeenCalledTimes(1);
  state.visible = true;
  expect((await manager.getClaim('w', 'p', 'stream')).token).toBe('token-2');
});

test('the first claim is requested even from a tab that just opened (user opened the service)', async () => {
  const { manager, requestClaim } = setup({ visible: false });
  await manager.getClaim('w', 'p', 'stream');
  expect(requestClaim).toHaveBeenCalledTimes(1);
});

test('a rejected claim is renewed once and the call retried once', async () => {
  const { manager, requestClaim } = setup();
  const call = jest.fn()
    .mockRejectedValueOnce(rejection('claim_revoked'))
    .mockResolvedValueOnce('ok');
  await expect(manager.withClaim('w', 'p', 'stream', call)).resolves.toBe('ok');
  expect(call.mock.calls.map((args) => args[0])).toEqual(['token-1', 'token-2']);
  expect(requestClaim).toHaveBeenCalledTimes(2);
});

test('a second rejection is returned, not retried again', async () => {
  const { manager, requestClaim } = setup();
  const call = jest.fn().mockRejectedValue(rejection('claim_expired'));
  await expect(manager.withClaim('w', 'p', 'stream', call)).rejects.toMatchObject({ code: 'claim_expired' });
  expect(call).toHaveBeenCalledTimes(2);
  expect(requestClaim).toHaveBeenCalledTimes(2);
});

test('other errors are not retried and do not request a claim', async () => {
  const { manager, requestClaim } = setup();
  const call = jest.fn().mockRejectedValue(Object.assign(new Error('x'), { status: 403, code: 'forbidden' }));
  await expect(manager.withClaim('w', 'p', 'stream', call)).rejects.toMatchObject({ status: 403 });
  expect(call).toHaveBeenCalledTimes(1);
  expect(requestClaim).toHaveBeenCalledTimes(1);
});

test('only 401s about the claim count as claim rejections', () => {
  expect(isClaimRejection(rejection('invalid_token'))).toBe(true);
  expect(isClaimRejection(rejection('claim_expired'))).toBe(true);
  expect(isClaimRejection({ status: 401, code: 'something_else' })).toBe(false);
  expect(isClaimRejection({ status: 403, code: 'claim_revoked' })).toBe(false);
});

test('a claim is never written to browser storage', async () => {
  const { manager } = setup();
  await manager.getClaim('w', 'p', 'stream');
  expect(JSON.stringify({ ...window.localStorage })).not.toContain('token-1');
  expect(JSON.stringify({ ...window.sessionStorage })).not.toContain('token-1');
  expect(document.cookie).not.toContain('token-1');
});
