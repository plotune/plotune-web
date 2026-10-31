// Not { virtual: true }: posthog-js really exists, and a virtual mock of a real package is not
// reliably applied -- when it isn't, the real library loads, patches history.pushState and
// fires real pageviews through the filter under test.
jest.mock('posthog-js', () => ({ init: jest.fn() }));

const posthog = require('posthog-js');
const initializePostHog = require('./posthog');

test('initializes PostHog with the configured project through the Cloudflare reverse proxy', () => {
  initializePostHog();

  expect(posthog.init).toHaveBeenCalledWith(
    'phc_oYVUYaQPBDJCHgaEgooHE2wSb9AeSWbwxeg5x3WAS4Je',
    expect.objectContaining({
      api_host: 'https://t.plotune.net',
      ui_host: 'https://us.posthog.com',
    })
  );
});

describe('filterAssessmentNoise', () => {
  const { filterAssessmentNoise, resetAssessmentNoiseFilter } = initializePostHog;
  const at = (path) => window.history.pushState({}, '', path);
  beforeEach(() => resetAssessmentNoiseFilter());

  test('is registered as before_send', () => {
    initializePostHog();
    expect(posthog.init).toHaveBeenLastCalledWith(expect.any(String), expect.objectContaining({ before_send: initializePostHog.beforeSend }));
  });

  test('drops $autocapture only on the assessment page', () => {
    at('/ai-readiness/?utm_source=linkedin');
    expect(filterAssessmentNoise({ event: '$autocapture' })).toBeNull();
    at('/ai-readiness');
    expect(filterAssessmentNoise({ event: '$autocapture' })).toBeNull();
  });

  test('keeps custom events on the assessment page', () => {
    at('/ai-readiness');
    const custom = { event: 'ai_readiness_q1_completed' };
    expect(filterAssessmentNoise(custom)).toBe(custom);
  });

  test('keeps the first assessment pageview and drops repeats from history changes (Back gesture)', () => {
    at('/ai-readiness');
    const first = { event: '$pageview' };
    expect(filterAssessmentNoise(first)).toBe(first);
    expect(filterAssessmentNoise({ event: '$pageview' })).toBeNull();
    expect(filterAssessmentNoise({ event: '$pageview' })).toBeNull();
  });

  test('a pageview on another path re-arms the assessment pageview', () => {
    at('/ai-readiness');
    expect(filterAssessmentNoise({ event: '$pageview' })).not.toBeNull();
    at('/nexus');
    const nexus = { event: '$pageview' };
    expect(filterAssessmentNoise(nexus)).toBe(nexus);
    at('/ai-readiness');
    expect(filterAssessmentNoise({ event: '$pageview' })).not.toBeNull();
  });

  test('the Nexus pricing steps count one pageview per visit too, and keep their clicks', () => {
    at('/nexus/pricing/?from=nexus_pricing_band');
    const first = { event: '$pageview' };
    expect(filterAssessmentNoise(first)).toBe(first);
    expect(filterAssessmentNoise({ event: '$pageview' })).toBeNull();
    const click = { event: '$autocapture' };
    expect(filterAssessmentNoise(click)).toBe(click);
    at('/ai-readiness'); // a different step flow is a new page
    expect(filterAssessmentNoise({ event: '$pageview' })).not.toBeNull();
    at('/nexus/pricing');
    expect(filterAssessmentNoise({ event: '$pageview' })).not.toBeNull();
  });

  test('never touches other pages: repeat pageviews and autocapture pass, incl. look-alike paths', () => {
    ['/', '/nexus', '/ai-readiness-fake', '/research/ai-readiness', '/nexus/pricing-old'].forEach((path) => {
      at(path);
      const click = { event: '$autocapture' };
      const view1 = { event: '$pageview' };
      const view2 = { event: '$pageview' };
      expect(filterAssessmentNoise(click)).toBe(click);
      expect(filterAssessmentNoise(view1)).toBe(view1);
      expect(filterAssessmentNoise(view2)).toBe(view2);
    });
  });
});

describe('beforeSend: noise filter + visit attribution', () => {
  const { beforeSend, resetAssessmentNoiseFilter } = initializePostHog;
  const { resetAttributionCache } = require('./utils/attribution');
  const at = (url) => window.history.pushState({}, '', url);
  beforeEach(() => { resetAssessmentNoiseFilter(); resetAttributionCache(); window.sessionStorage.clear(); });

  test('a Google Ads landing is remembered and stamped on later pages, e.g. /contact', () => {
    at('/nexus/?gad_source=5&gad_campaignid=24328199458&gclid=Cj0KCQ');
    initializePostHog(); // captures attribution from the landing URL
    at('/contact');
    const ev = beforeSend({ event: '$pageview', properties: { $current_url: 'https://www.plotune.net/contact' } });
    expect(ev.properties).toMatchObject({
      attr_platform: 'google_ads',
      attr_gad_campaignid: '24328199458',
      attr_gad_source: '5',
      attr_gclid: 'Cj0KCQ',
      attr_landing_path: '/nexus/',
      $current_url: 'https://www.plotune.net/contact',
    });
  });

  test('a dropped event stays dropped (assessment autocapture)', () => {
    at('/ai-readiness?utm_source=linkedin');
    initializePostHog();
    expect(beforeSend({ event: '$autocapture', properties: {} })).toBeNull();
  });

  test('no campaign params: events pass through untouched', () => {
    at('/about');
    initializePostHog();
    const ev = { event: '$pageview', properties: { a: 1 } };
    expect(beforeSend(ev).properties).toEqual({ a: 1 });
  });
});

describe('Bridge sign-in hand-off is never sent', () => {
  const { beforeSend } = initializePostHog;
  const at = (path) => window.history.pushState({}, '', path);
  const event = (name) => ({ event: name, properties: {} });

  test('the authorize page sends nothing: pageviews, pageleaves, autocapture and replay snapshots', () => {
    at('/bridge/authorize?code_challenge=abc&state=def');
    ['$pageview', '$pageleave', '$autocapture', '$snapshot'].forEach((name) => {
      expect(beforeSend(event(name))).toBeNull();
    });
  });

  test('the login page reached with a Bridge next is silent too', () => {
    at('/login?next=%2Fbridge%2Fauthorize%3Fcode_challenge%3Dabc%26state%3Ddef');
    expect(beforeSend(event('$pageview'))).toBeNull();
  });

  test('other login pages and look-alike paths are unaffected', () => {
    ['/login', '/login?next=%2Fstream%2Fworkspace', '/bridge', '/bridge/authorize-old'].forEach((path) => {
      at(path);
      expect(beforeSend(event('$pageview'))).not.toBeNull();
    });
  });
});
