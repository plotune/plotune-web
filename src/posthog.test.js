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
