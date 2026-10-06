const posthogModule = require('posthog-js');
const posthog = posthogModule.default || posthogModule;
const { attributionEventProperties, captureAttribution } = require('./utils/attribution');

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

// Every event carries the visit's ad/campaign attribution as attr_* properties (see
// utils/attribution.js), so pages reached after the landing page -- /contact, the email click,
// a lead -- can still be broken down by platform, campaign and click id.
function addAttribution(captureResult) {
  if (!captureResult) return captureResult;
  const props = attributionEventProperties();
  // Object.assign, not object spread: spread makes Babel inject an ES `import` helper into this
  // CommonJS file, which turns it into an ES module and silently drops its module.exports.
  if (Object.keys(props).length) captureResult.properties = Object.assign({}, props, captureResult.properties || {});
  return captureResult;
}

function beforeSend(captureResult) {
  return addAttribution(filterAssessmentNoise(captureResult));
}

function initializePostHog() {
  // Before init, so even the landing $pageview carries attr_* properties.
  captureAttribution();
  posthog.init('phc_oYVUYaQPBDJCHgaEgooHE2wSb9AeSWbwxeg5x3WAS4Je', {
    api_host: 'https://t.plotune.net',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-05-30',
    before_send: beforeSend,
  });
}

module.exports = initializePostHog;
// Exposed so other modules (e.g. ScrollDepthTracker) can call posthog.capture() against the
// same client instance instead of re-requiring posthog-js and redoing the ESM/CJS interop above.
module.exports.posthog = posthog;
module.exports.filterAssessmentNoise = filterAssessmentNoise;
module.exports.beforeSend = beforeSend;
module.exports.resetAssessmentNoiseFilter = resetAssessmentNoiseFilter;
