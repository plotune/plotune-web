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

describe('dropAssessmentAutocapture', () => {
  const { dropAssessmentAutocapture } = initializePostHog;
  const at = (path) => window.history.pushState({}, '', path);

  test('is registered as before_send', () => {
    initializePostHog();
    expect(posthog.init).toHaveBeenLastCalledWith(expect.any(String), expect.objectContaining({ before_send: dropAssessmentAutocapture }));
  });

  test('drops $autocapture only on the assessment page', () => {
    at('/ai-readiness/?utm_source=linkedin');
    expect(dropAssessmentAutocapture({ event: '$autocapture' })).toBeNull();
    at('/ai-readiness');
    expect(dropAssessmentAutocapture({ event: '$autocapture' })).toBeNull();
  });

  test('keeps every other event on the assessment page', () => {
    at('/ai-readiness');
    const pageview = { event: '$pageview' };
    expect(dropAssessmentAutocapture(pageview)).toBe(pageview);
    const custom = { event: 'ai_readiness_q1_completed' };
    expect(dropAssessmentAutocapture(custom)).toBe(custom);
  });

  test('keeps $autocapture on all other pages, including look-alike paths', () => {
    ['/', '/nexus', '/ai-readiness-fake', '/research/ai-readiness'].forEach((path) => {
      at(path);
      const click = { event: '$autocapture' };
      expect(dropAssessmentAutocapture(click)).toBe(click);
    });
  });
});
