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
// PRIVACY: the visitor's email address is never passed to PostHog. The optional free-text
// "Other" answers are (on the question events only) so the options can be improved from data;
// no identity is attached to them. The email travels only through submission.js, to the
// (future) first-party endpoint.

export const AI_READINESS_EVENTS = {
  started: 'ai_readiness_started',
  questionCompleted: (n) => `ai_readiness_q${n}_completed`,
  scoreShown: 'ai_readiness_score_shown',
  emailStarted: 'ai_readiness_email_started',
  emailSubmitted: 'ai_readiness_email_submitted',
  backClicked: 'ai_readiness_back_clicked',
  nexusClicked: 'ai_readiness_nexus_clicked', // from: 'logo' | 'email_confirmation'
};

export const trackAiReadiness = (event, properties = {}) => {
  posthog.capture(event, {
    ...getFunnelContext(),
    assessment_version: ASSESSMENT_VERSION,
    scoring_version: SCORING_VERSION,
    ...properties,
  });
};

// The funnel's first step is the standard $pageview on /ai-readiness (it already carries UTM and
// referrer), so there is deliberately no separate "viewed" event.
//
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

// The optional free-text "Other" answer, only when one was actually typed (max 120 chars, the
// input's own limit). It is sent on the question events so the form's options can be improved
// from real data; it is never attached to the email-submission event.
const otherTextProperties = (questionId, answers) => {
  const text = answers.otherText[questionId].trim();
  return { [`${questionId}_other_provided`]: Boolean(text), ...(text ? { [`${questionId}_other_text`]: text } : {}) };
};

// Only the properties relevant to the question that was just completed, so each q-event is a
// clean slice of the funnel.
export const questionProperties = (questionId, answers) => {
  switch (questionId) {
    case 'interfaces':
    case 'tools':
    case 'bottlenecks':
      return { [questionId]: answers[questionId], ...otherTextProperties(questionId, answers) };
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

// LinkedIn conversion for a confirmed lead, so ad campaigns can optimise for (and report) leads
// rather than clicks. Uses the LinkedIn Insight Tag already loaded in public/index.html. Inactive
// until REACT_APP_LINKEDIN_LEAD_CONVERSION_ID is set (Campaign Manager > Analyze > Conversion
// tracking > Create conversion > Javascript/event-specific; the numeric id goes in .env.production).
const LINKEDIN_LEAD_CONVERSION_ID = Number(process.env.REACT_APP_LINKEDIN_LEAD_CONVERSION_ID || 0);

export const trackLinkedInLead = () => {
  if (!LINKEDIN_LEAD_CONVERSION_ID || typeof window === 'undefined' || typeof window.lintrk !== 'function') return false;
  try {
    window.lintrk('track', { conversion_id: LINKEDIN_LEAD_CONVERSION_ID });
    return true;
  } catch {
    return false;
  }
};
