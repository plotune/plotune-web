const loadAnalytics = (conversionId) => {
  let mod;
  const original = process.env.REACT_APP_LINKEDIN_LEAD_CONVERSION_ID;
  process.env.REACT_APP_LINKEDIN_LEAD_CONVERSION_ID = conversionId;
  jest.isolateModules(() => { mod = require('./analytics'); });
  process.env.REACT_APP_LINKEDIN_LEAD_CONVERSION_ID = original;
  return mod;
};

jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));
afterEach(() => { delete window.lintrk; });

test('does nothing until a conversion id is configured', () => {
  window.lintrk = jest.fn();
  expect(loadAnalytics('').trackLinkedInLead()).toBe(false);
  expect(window.lintrk).not.toHaveBeenCalled();
});

test('fires the configured conversion through the Insight Tag', () => {
  window.lintrk = jest.fn();
  expect(loadAnalytics('1234567').trackLinkedInLead()).toBe(true);
  expect(window.lintrk).toHaveBeenCalledWith('track', { conversion_id: 1234567 });
});

test('never throws if the Insight Tag is missing or broken (e.g. blocked by an ad blocker)', () => {
  expect(loadAnalytics('1234567').trackLinkedInLead()).toBe(false);
  window.lintrk = () => { throw new Error('boom'); };
  expect(loadAnalytics('1234567').trackLinkedInLead()).toBe(false);
});
