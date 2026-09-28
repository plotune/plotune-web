const posthogModule = require('posthog-js');
const posthog = posthogModule.default || posthogModule;

function initializePostHog() {
  posthog.init('phc_oYVUYaQPBDJCHgaEgooHE2wSb9AeSWbwxeg5x3WAS4Je', {
    api_host: 'https://t.plotune.net',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-05-30',
  });
}

module.exports = initializePostHog;
// Exposed so other modules (e.g. ScrollDepthTracker) can call posthog.capture() against the
// same client instance instead of re-requiring posthog-js and redoing the ESM/CJS interop above.
module.exports.posthog = posthog;
