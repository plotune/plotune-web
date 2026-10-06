const load = (sendTo) => {
  let mod;
  const original = process.env.REACT_APP_GOOGLE_ADS_CONTACT_SEND_TO;
  if (sendTo === undefined) delete process.env.REACT_APP_GOOGLE_ADS_CONTACT_SEND_TO;
  else process.env.REACT_APP_GOOGLE_ADS_CONTACT_SEND_TO = sendTo;
  jest.isolateModules(() => { mod = require('./googleAds'); });
  if (original === undefined) delete process.env.REACT_APP_GOOGLE_ADS_CONTACT_SEND_TO;
  else process.env.REACT_APP_GOOGLE_ADS_CONTACT_SEND_TO = original;
  return mod;
};
const SEND_TO = 'AW-18495931723/vWHMCP26qpIdEMuKxvNE';

afterEach(() => { delete window.gtag; window.sessionStorage.clear(); });

test('fires the configured Kişi conversion through gtag with beacon transport', () => {
  window.gtag = jest.fn();
  expect(load(SEND_TO).trackGoogleAdsContactConversion()).toBe(true);
  expect(window.gtag).toHaveBeenCalledWith('event', 'conversion', { send_to: SEND_TO, transport_type: 'beacon' });
});

test('counts at most once per browser session', () => {
  window.gtag = jest.fn();
  const { trackGoogleAdsContactConversion } = load(SEND_TO);
  trackGoogleAdsContactConversion();
  expect(trackGoogleAdsContactConversion()).toBe(false);
  expect(window.gtag).toHaveBeenCalledTimes(1);
});

test('no-op when unconfigured, when the tag is blocked, and never throws', () => {
  window.gtag = jest.fn();
  expect(load('').trackGoogleAdsContactConversion()).toBe(false);
  expect(window.gtag).not.toHaveBeenCalled();
  delete window.gtag;
  expect(load(SEND_TO).trackGoogleAdsContactConversion()).toBe(false); // ad blocker: gtag missing
  window.gtag = () => { throw new Error('boom'); };
  expect(() => load(SEND_TO).trackGoogleAdsContactConversion()).not.toThrow();
});
