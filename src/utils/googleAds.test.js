const KEYS = ['REACT_APP_GOOGLE_ADS_CONTACT_SEND_TO', 'REACT_APP_GOOGLE_ADS_AI_READINESS_SEND_TO'];
const load = (env) => {
  let mod;
  const original = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
  KEYS.forEach((k) => { if (env[k] === undefined) delete process.env[k]; else process.env[k] = env[k]; });
  jest.isolateModules(() => { mod = require('./googleAds'); });
  KEYS.forEach((k) => { if (original[k] === undefined) delete process.env[k]; else process.env[k] = original[k]; });
  return mod;
};
const SEND_TO = 'AW-18495931723/vWHMCP26qpIdEMuKxvNE';
const AI_SEND_TO = 'AW-18495931723/sSwBCPLChpQdEMuKxvNE';
const configured = () => load({ REACT_APP_GOOGLE_ADS_CONTACT_SEND_TO: SEND_TO, REACT_APP_GOOGLE_ADS_AI_READINESS_SEND_TO: AI_SEND_TO });

afterEach(() => { delete window.gtag; window.sessionStorage.clear(); });

test('fires the configured Kişi conversion through gtag with beacon transport', () => {
  window.gtag = jest.fn();
  expect(configured().trackGoogleAdsContactConversion()).toBe(true);
  expect(window.gtag).toHaveBeenCalledWith('event', 'conversion', { send_to: SEND_TO, transport_type: 'beacon' });
});

test('fires the AI Readiness Lead conversion with the submission id for de-duplication', () => {
  window.gtag = jest.fn();
  expect(configured().trackGoogleAdsAiReadinessConversion('sub-123')).toBe(true);
  expect(window.gtag).toHaveBeenCalledWith('event', 'conversion', { send_to: AI_SEND_TO, transport_type: 'beacon', transaction_id: 'sub-123' });
});

test('each action counts at most once per browser session, independently of the other', () => {
  window.gtag = jest.fn();
  const ads = configured();
  expect(ads.trackGoogleAdsContactConversion()).toBe(true);
  expect(ads.trackGoogleAdsContactConversion()).toBe(false);
  expect(ads.trackGoogleAdsAiReadinessConversion('a')).toBe(true);
  expect(ads.trackGoogleAdsAiReadinessConversion('a')).toBe(false);
  expect(window.gtag).toHaveBeenCalledTimes(2);
});

test('no-op when unconfigured, when the tag is blocked, and never throws', () => {
  window.gtag = jest.fn();
  const none = load({});
  expect(none.trackGoogleAdsContactConversion()).toBe(false);
  expect(none.trackGoogleAdsAiReadinessConversion('a')).toBe(false);
  expect(window.gtag).not.toHaveBeenCalled();
  delete window.gtag;
  expect(configured().trackGoogleAdsAiReadinessConversion('a')).toBe(false); // ad blocker: gtag missing
  window.gtag = () => { throw new Error('boom'); };
  expect(() => configured().trackGoogleAdsContactConversion()).not.toThrow();
});
