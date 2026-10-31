import { safeBridgeNext, rememberBridgeLoginReturn, takeBridgeLoginReturn, BRIDGE_LOGIN_RETURN_KEY } from './bridgeAuthorize';

const GOOD = `/bridge/authorize?code_challenge=${'A'.repeat(43)}&state=state-0123456789abcdef`;

test.each([
  GOOD,
  '/bridge/authorize',
  '/bridge/authorize?code_challenge=AAA&prompt=login',
])('accepts the authorize route %s', (value) => {
  expect(safeBridgeNext(value)).toBe(value);
});

test.each([
  ['protocol-relative', '//evil.com'],
  ['protocol-relative after the prefix', '/bridge/authorize//evil.com'],
  ['absolute https', 'https://evil.com'],
  ['absolute https with the prefix', 'https://evil.com/bridge/authorize'],
  ['scheme without slashes', 'javascript:alert(1)'],
  ['dot segments', '/bridge/authorize/../..'],
  ['dot segments in the query', '/bridge/authorize?x=/../..'],
  ['a trailing path after the route', '/bridge/authorizeX'],
  ['a sub-path', '/bridge/authorize/evil'],
  ['a backslash', '/bridge/authorize\\..\\..'],
  ['a backslash path', '/\\evil.com'],
  ['a fragment', '/bridge/authorize#//evil.com'],
  ['a colon in the query', '/bridge/authorize?x=https://evil.com'],
  ['a slash in the query', '/bridge/authorize?next=//evil.com'],
  ['a different route', '/dashboard'],
  ['a stream route', '/stream/authorize?request=x'],
  ['an encoded protocol-relative value (decoded before validation)', '%2F%2Fevil.com'],
  ['an empty string', ''],
  ['null', null],
  ['undefined', undefined],
  ['an object', { toString: () => '/bridge/authorize' }],
  ['an over-long value', `/bridge/authorize?x=${'a'.repeat(600)}`],
])('rejects %s', (_name, value) => {
  expect(safeBridgeNext(value)).toBeNull();
});

test('a percent-encoded slash cannot smuggle a scheme or host past the check', () => {
  expect(safeBridgeNext('/bridge/authorize?x=%2F%2Fevil.com')).toBe('/bridge/authorize?x=%2F%2Fevil.com');
  expect(safeBridgeNext('/%2F%2Fevil.com')).toBeNull();
  expect(safeBridgeNext('/bridge/authorize%2F..%2F..')).toBeNull();
});

describe('storage hand-off across GitHub', () => {
  beforeEach(() => sessionStorage.clear());

  test('stores a valid value and consumes it exactly once', () => {
    rememberBridgeLoginReturn(GOOD);
    expect(sessionStorage.getItem(BRIDGE_LOGIN_RETURN_KEY)).toBe(GOOD);
    expect(takeBridgeLoginReturn()).toBe(GOOD);
    expect(sessionStorage.getItem(BRIDGE_LOGIN_RETURN_KEY)).toBeNull();
    expect(takeBridgeLoginReturn()).toBeNull();
  });

  test('never stores an unsafe value, and clears a stale one', () => {
    rememberBridgeLoginReturn(GOOD);
    rememberBridgeLoginReturn('//evil.com');
    expect(sessionStorage.getItem(BRIDGE_LOGIN_RETURN_KEY)).toBeNull();
  });

  test('re-validates a tampered stored value on the way out', () => {
    sessionStorage.setItem(BRIDGE_LOGIN_RETURN_KEY, 'https://evil.com');
    expect(takeBridgeLoginReturn()).toBeNull();
    expect(sessionStorage.getItem(BRIDGE_LOGIN_RETURN_KEY)).toBeNull();
  });

  test('a throwing storage degrades to the default destination', () => {
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(takeBridgeLoginReturn()).toBeNull();
    spy.mockRestore();
  });
});
