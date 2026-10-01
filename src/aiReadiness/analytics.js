import { posthog } from '../posthog';
import { captureFunnelTouch, getFunnelContext } from '../utils/funnel';
import { ASSESSMENT_VERSION } from './questions';
import { SCORING_VERSION } from './scoring';

// Thin wrapper over the project's existing PostHog client so every assessment event carries
// the same funnel context as the rest of the site (entry_source, segment, ...). UTM/referrer
// attribution is handled by posthog-js itself from the landing URL; the assessment keeps the
// query string intact for the whole visit (steps live in router history *state*, not in the
// URL) so those params are never lost mid-flow.
//
// PRIVACY: the visitor's email address is never passed to PostHog, and neither is any
// free-text "Other" answer -- only a boolean saying whether they typed something. Free text
// and email travel only through submission.js, to the (future) first-party endpoint.

export const AI_READINESS_EVENTS = {
  viewed: 'ai_readiness_viewed',
  started: 'ai_readiness_started',
  questionCompleted: (n) => `ai_readiness_q${n}_completed`,
  scoreShown: 'ai_readiness_score_shown',
  emailStarted: 'ai_readiness_email_started',
  emailSubmitted: 'ai_readiness_email_submitted',
  backClicked: 'ai_readiness_back_clicked',
};

export const trackAiReadiness = (event, properties = {}) => {
  posthog.capture(event, {
    ...getFunnelContext(),
    assessment_version: ASSESSMENT_VERSION,
    scoring_version: SCORING_VERSION,
    ...properties,
  });
};

// First-touch attribution for the session (utm_source / ref / referrer host), same helper the
// solution and article pages use.
export const captureAssessmentEntry = () => captureFunnelTouch({});

// Structured, PII-free view of an answer set for event properties.
export const answerProperties = (answers) => ({
  interfaces: answers.interfaces,
  interfaces_other_provided: Boolean(answers.otherText.interfaces.trim()),
  tools: answers.tools,
  tools_other_provided: Boolean(answers.otherText.tools.trim()),
  bottlenecks: answers.bottlenecks,
  bottlenecks_other_provided: Boolean(answers.otherText.bottlenecks.trim()),
  automation_level: answers.automation,
});

// Only the properties relevant to the question that was just completed, so each q-event is a
// clean slice of the funnel (and "other" detail stays a boolean).
export const questionProperties = (questionId, answers) => {
  switch (questionId) {
    case 'interfaces':
      return { interfaces: answers.interfaces, interfaces_other_provided: Boolean(answers.otherText.interfaces.trim()) };
    case 'tools':
      return { tools: answers.tools, tools_other_provided: Boolean(answers.otherText.tools.trim()) };
    case 'bottlenecks':
      return { bottlenecks: answers.bottlenecks, bottlenecks_other_provided: Boolean(answers.otherText.bottlenecks.trim()) };
    case 'automation':
      return { automation_level: answers.automation };
    default:
      return {};
  }
};

export const resultProperties = (result) => ({
  readiness_score: result.score,
  assessment_coverage: `${result.assessedAreas}/${result.totalAreas}`,
  areas_assessed: result.assessedAreas,
  score_confidence: result.confidence,
  score_band: result.band,
});
