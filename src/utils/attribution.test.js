import { captureAttribution, getAttribution, attributionEventProperties, detectPlatform, resetAttributionCache } from './attribution';
import { captureFunnelTouch, getFunnelContext } from './funnel';

const loc = (path, search) => ({ pathname: path, search });
beforeEach(() => { resetAttributionCache(); window.sessionStorage.clear(); });

test('Google Ads auto-tagged landing is captured with its campaign id and platform', () => {
  const rec = captureAttribution(loc('/nexus/', '?gad_source=5&gad_campaignid=24328199458&gclid=abc'));
  expect(rec).toEqual({ gad_source: '5', gad_campaignid: '24328199458', gclid: 'abc', platform: 'google_ads', landing_path: '/nexus/' });
});

test('LinkedIn landing with UTMs and click id', () => {
  const rec = captureAttribution(loc('/ai-readiness/', '?li_fat_id=x1&utm_id=895467213&utm_medium=paid-social&utm_source=linkedin&other=ignored'));
  expect(rec).toMatchObject({ platform: 'linkedin', li_fat_id: 'x1', utm_id: '895467213', utm_source: 'linkedin' });
  expect(rec).not.toHaveProperty('other');
});

test('an internal page without params keeps the landing attribution (survives a reload via sessionStorage)', () => {
  captureAttribution(loc('/nexus/', '?gclid=abc&gad_campaignid=1'));
  expect(captureAttribution(loc('/contact', ''))).toMatchObject({ gclid: 'abc', landing_path: '/nexus/' });
  resetAttributionCache(); // simulate a full reload: read back from storage
  expect(getAttribution()).toMatchObject({ gclid: 'abc', gad_campaignid: '1' });
});

test('a new ad click in the same tab replaces the old attribution', () => {
  captureAttribution(loc('/nexus/', '?gclid=abc'));
  expect(captureAttribution(loc('/ai-readiness/', '?utm_source=linkedin&li_fat_id=z'))).toMatchObject({ platform: 'linkedin' });
  expect(getAttribution()).not.toHaveProperty('gclid');
});

test('event properties are attr_-prefixed; none without attribution', () => {
  expect(attributionEventProperties(null)).toEqual({});
  expect(attributionEventProperties({ platform: 'google_ads', gclid: 'a' })).toEqual({ attr_platform: 'google_ads', attr_gclid: 'a' });
});

test('platform detection', () => {
  expect(detectPlatform({ gbraid: 'x' })).toBe('google_ads');
  expect(detectPlatform({ utm_source: 'LinkedIn' })).toBe('linkedin');
  expect(detectPlatform({ fbclid: 'x' })).toBe('meta');
  expect(detectPlatform({ msclkid: 'x' })).toBe('microsoft_ads');
  expect(detectPlatform({ utm_source: 'Newsletter' })).toBe('newsletter');
  expect(detectPlatform({})).toBeNull();
});

test('funnel entry_source uses the visit attribution when the current page has no params', () => {
  captureAttribution(loc('/nexus/', '?gclid=abc&gad_campaignid=1'));
  window.history.pushState({}, '', '/contact');
  captureFunnelTouch({});
  expect(getFunnelContext().entry_source).toBe('google_ads');
});

test('blocked storage never throws', () => {
  const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  expect(() => captureAttribution(loc('/nexus/', '?gclid=abc'))).not.toThrow();
  expect(getAttribution()).toMatchObject({ gclid: 'abc' }); // in-memory copy still applies
  spy.mockRestore();
});
