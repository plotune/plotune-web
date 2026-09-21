jest.mock('posthog-js', () => ({ init: jest.fn() }), { virtual: true });

const posthog = require('posthog-js');
const initializePostHog = require('./posthog');

test('initializes PostHog with the configured project and US ingestion host', () => {
  initializePostHog();

  expect(posthog.init).toHaveBeenCalledWith(
    'phc_oYVUYaQPBDJCHgaEgooHE2wSb9AeSWbwxeg5x3WAS4Je',
    expect.objectContaining({
      api_host: 'https://us.i.posthog.com',
    })
  );
});
