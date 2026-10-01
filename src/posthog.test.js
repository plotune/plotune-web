jest.mock('posthog-js', () => ({ init: jest.fn() }), { virtual: true });

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
    expect(posthog.init).toHaveBeenLastCalledWith(expect.any(String), expect.objectContaining({ before_send: filterAssessmentNoise }));
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

  test('never touches other pages: repeat pageviews and autocapture pass, incl. look-alike paths', () => {
    ['/', '/nexus', '/ai-readiness-fake', '/research/ai-readiness'].forEach((path) => {
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
