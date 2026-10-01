const posthogModule = require('posthog-js');
const posthog = posthogModule.default || posthogModule;

// The AI readiness assessment emits its own structured events (answers included), so on that
// page (and only that page):
//  - generic "clicked span with text ..." $autocapture is pure noise and is dropped. (Done here,
//    by path, rather than with the ph-no-capture class, which would also blank the page in
//    session replays.)
//  - repeat $pageview events are dropped. The assessment moves between steps with history
//    entries, and PostHog counts every history change (e.g. the Back gesture) as a new page
//    view, which inflates page-view counts. Only the first view of the page per visit is kept;
//    any pageview on another path re-arms it, so leaving for /nexus and coming back counts again.
// Everything else -- rageclicks, scroll depth, replay, every other page -- is untouched.
const isAssessmentPath = (path) => /^\/ai-readiness(\/|$)/.test(path);
let lastPageviewWasAssessment = false;

function filterAssessmentNoise(captureResult) {
  if (!captureResult || typeof window === 'undefined') return captureResult;
  const onAssessment = isAssessmentPath(window.location.pathname);

  if (captureResult.event === '$autocapture' && onAssessment) return null;

  if (captureResult.event === '$pageview') {
    const isRepeat = onAssessment && lastPageviewWasAssessment;
    lastPageviewWasAssessment = onAssessment;
    if (isRepeat) return null;
  }
  return captureResult;
}

// Test hook: the filter keeps one bit of module state.
const resetAssessmentNoiseFilter = () => { lastPageviewWasAssessment = false; };

function initializePostHog() {
  posthog.init('phc_oYVUYaQPBDJCHgaEgooHE2wSb9AeSWbwxeg5x3WAS4Je', {
    api_host: 'https://t.plotune.net',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-05-30',
    before_send: filterAssessmentNoise,
  });
}

module.exports = initializePostHog;
// Exposed so other modules (e.g. ScrollDepthTracker) can call posthog.capture() against the
// same client instance instead of re-requiring posthog-js and redoing the ESM/CJS interop above.
module.exports.posthog = posthog;
module.exports.filterAssessmentNoise = filterAssessmentNoise;
module.exports.resetAssessmentNoiseFilter = resetAssessmentNoiseFilter;
