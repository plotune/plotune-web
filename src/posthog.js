const posthogModule = require('posthog-js');
const posthog = posthogModule.default || posthogModule;

// The AI readiness assessment emits its own structured events (answers included), so the generic
// "clicked span with text ..." autocapture on that page is pure noise. Dropped here, by path,
// rather than with the ph-no-capture class, which would also blank the page in session replays.
// Every other event, including $pageview, rageclicks and replay, is untouched.
function dropAssessmentAutocapture(captureResult) {
  if (
    captureResult &&
    captureResult.event === '$autocapture' &&
    typeof window !== 'undefined' &&
    /^\/ai-readiness(\/|$)/.test(window.location.pathname)
  ) {
    return null;
  }
  return captureResult;
}

function initializePostHog() {
  posthog.init('phc_oYVUYaQPBDJCHgaEgooHE2wSb9AeSWbwxeg5x3WAS4Je', {
    api_host: 'https://t.plotune.net',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-05-30',
    before_send: dropAssessmentAutocapture,
  });
}

module.exports = initializePostHog;
// Exposed so other modules (e.g. ScrollDepthTracker) can call posthog.capture() against the
// same client instance instead of re-requiring posthog-js and redoing the ESM/CJS interop above.
module.exports.posthog = posthog;
module.exports.dropAssessmentAutocapture = dropAssessmentAutocapture;
