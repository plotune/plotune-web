import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import Seo from '../components/Seo';
import logo from '../assets/logo.png';
import { getFunnelContext, withFunnelParams } from '../utils/funnel';
import './AiReadiness.css';
import QuestionScreen from './QuestionScreen';
import ResultScreen from './ResultScreen';
import { EMPTY_ANSWERS, OTHER_ID, QUESTIONS, QUESTION_COUNT, isAnswered } from './questions';
import { scoreAssessment } from './scoring';
import {
  AI_READINESS_EVENTS,
  answerProperties,
  captureAssessmentEntry,
  questionProperties,
  resultProperties,
  trackAiReadiness,
} from './analytics';
import { buildSubmissionPayload, submitAssessment } from './submission';

// Standalone route (/ai-readiness). Steps: 0 = intro, 1..4 = questions, 5 = result.
//
// The current step lives in react-router *history state*, not in component state or the URL:
//  - the phone's Back gesture / browser Back moves one step back, as people expect (Jakob),
//  - answers stay in this component's state so Back never loses a selection,
//  - the URL (and with it utm_* attribution) never changes mid-flow.
// If a refresh wipes the answers, the step is clamped back to the first unanswered question.

const INTRO = 0;
const RESULT = QUESTION_COUNT + 1;
const AUTO_ADVANCE_MS = 220; // long enough to *see* the selection land, short enough to feel instant
const PATH = '/ai-readiness';

const reachableStep = (answers) => {
  let step = 1;
  for (const question of QUESTIONS) {
    if (!isAnswered(question, answers)) return step;
    step += 1;
  }
  return step; // RESULT
};

const AiReadinessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [advancing, setAdvancing] = useState(false);

  const requested = Number.isInteger(location.state?.alStep) ? location.state.alStep : INTRO;
  const step = Math.min(requested, Math.max(INTRO, reachableStep(answers)));

  const headingRef = useRef(null);
  const timerRef = useRef(null);
  const stepEnteredAtRef = useRef(Date.now());
  const completedRef = useRef(new Set());
  const backByButtonRef = useRef(false);
  const prevStepRef = useRef(step);
  const scoreShownForRef = useRef(null);

  const result = useMemo(() => scoreAssessment(answers), [answers]);

  const goTo = useCallback((next, { replace = false } = {}) => {
    navigate(`${location.pathname}${location.search}`, { state: { alStep: next }, replace });
  }, [navigate, location.pathname, location.search]);

  // Refresh / deep-link guard: normalise a state that points past the user's actual progress.
  useEffect(() => {
    if (requested !== step) goTo(step, { replace: true });
  }, [requested, step, goTo]);

  useEffect(() => {
    captureAssessmentEntry();
  }, []);

  // New screen: reset scroll instantly (smooth-scroll would make the new step feel laggy),
  // move focus to the heading for keyboard/screen-reader users, restart the step timer.
  useEffect(() => {
    window.clearTimeout(timerRef.current);
    setAdvancing(false);
    stepEnteredAtRef.current = Date.now();
    window.scrollTo(0, 0);
    if (headingRef.current) headingRef.current.focus({ preventScroll: true });

    // Back via browser/phone gesture (the in-app button reports itself).
    if (step < prevStepRef.current && !backByButtonRef.current) {
      trackAiReadiness(AI_READINESS_EVENTS.backClicked, { from_step: prevStepRef.current, to_step: step, via: 'browser' });
    }
    backByButtonRef.current = false;
    prevStepRef.current = step;
  }, [step]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (step === RESULT && scoreShownForRef.current !== result.score) {
      scoreShownForRef.current = result.score;
      trackAiReadiness(AI_READINESS_EVENTS.scoreShown, { ...answerProperties(answers), ...resultProperties(result) });
    }
  }, [step, result, answers]);

  const question = step >= 1 && step <= QUESTION_COUNT ? QUESTIONS[step - 1] : null;

  const advance = useCallback((fromStep, currentAnswers) => {
    const q = QUESTIONS[fromStep - 1];
    trackAiReadiness(AI_READINESS_EVENTS.questionCompleted(fromStep), {
      ...questionProperties(q.id, currentAnswers),
      seconds_on_step: Math.round((Date.now() - stepEnteredAtRef.current) / 100) / 10,
      is_revisit: completedRef.current.has(q.id),
    });
    completedRef.current.add(q.id);
    goTo(fromStep + 1);
  }, [goTo]);

  const handleStart = () => {
    trackAiReadiness(AI_READINESS_EVENTS.started);
    goTo(1);
  };

  const handleSelect = (optionId) => {
    if (!question) return;
    if (question.type === 'single') {
      const next = { ...answers, [question.id]: optionId };
      setAnswers(next);
      setAdvancing(true);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => advance(step, next), AUTO_ADVANCE_MS);
      return;
    }
    const current = answers[question.id];
    const isSelected = current.includes(optionId);
    // Defensive: the UI already dims options at the limit, this guards against fast double taps.
    if (!isSelected && question.max && current.length >= question.max) return;
    const nextList = isSelected ? current.filter((id) => id !== optionId) : [...current, optionId];
    const next = { ...answers, [question.id]: nextList };
    if (optionId === OTHER_ID && isSelected) next.otherText = { ...answers.otherText, [question.id]: '' };
    setAnswers(next);
  };

  const handleOtherText = (text) => {
    setAnswers((prev) => ({ ...prev, otherText: { ...prev.otherText, [question.id]: text } }));
  };

  const handleBack = () => {
    backByButtonRef.current = true;
    trackAiReadiness(AI_READINESS_EVENTS.backClicked, { from_step: step, to_step: step - 1, via: 'button' });
    // Pop history when this entry was pushed by the flow itself; otherwise replace, so Back
    // can never throw the visitor out of the assessment to whatever page they came from.
    if (window.history.state && window.history.state.idx > 0 && window.history.state.usr?.alStep === step) {
      navigate(-1);
    } else {
      goTo(step - 1, { replace: true });
    }
  };

  const handleRetake = () => {
    setAnswers(EMPTY_ANSWERS);
    completedRef.current = new Set();
    scoreShownForRef.current = null;
    goTo(INTRO, { replace: true });
  };

  const handleEmailSubmit = async (email) => {
    const payload = buildSubmissionPayload({ email, answers, result, funnel: getFunnelContext() });
    const outcome = await submitAssessment(payload);
    // The email itself is intentionally NOT sent to PostHog.
    trackAiReadiness(AI_READINESS_EVENTS.emailSubmitted, {
      ...answerProperties(answers),
      ...resultProperties(result),
      delivery: outcome.status, // sent | not_configured | error
    });
    return outcome.status;
  };

  const progress = question ? step / QUESTION_COUNT : 0;

  return (
    <div className="relative min-h-screen min-h-[100dvh] overflow-x-hidden bg-dark-bg text-dark-text">
      <Seo
        title="How AI-ready is your test bench? | Plotune"
        description="Four quick questions to assess how accessible your test environment is to AI-agent-driven testing."
        path={PATH}
      />
      {/* V1 is intentionally unlinked from the rest of the site: keep it out of search indexes. */}
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(38,166,154,0.12),transparent_45%)]" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-screen min-h-[100dvh] w-full max-w-xl flex-col px-5">
        {/* Selective attention: no site header/footer here. The only chrome is Back + progress. */}
        <header className="flex h-14 shrink-0 items-center justify-between">
          {question || step === RESULT ? (
            <button
              type="button"
              onClick={handleBack}
              className="-ml-3 inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-base text-gray-text hover:text-light-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <FiArrowLeft aria-hidden="true" />
              Back
            </button>
          ) : (
            // On this page the logo leads to Plotune Nexus (the product behind the assessment),
            // not the homepage. It only appears on the intro screen, before any answer exists,
            // so following it never costs the visitor progress.
            <Link
              to={withFunnelParams('/nexus')}
              onClick={() => trackAiReadiness(AI_READINESS_EVENTS.nexusClicked, { from: 'logo' })}
              aria-label="Plotune Nexus"
              className="-ml-1 inline-flex min-h-[44px] items-center rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <img src={logo} alt="" className="h-8 w-auto" />
            </Link>
          )}
          {question && (
            // Goal-gradient: the counter and bar are always visible, and the bar starts
            // already one segment filled on Q1 (endowed progress) and ends full on Q4.
            <span className="text-base font-medium tabular-nums text-light-text" aria-hidden="true">
              {step} / {QUESTION_COUNT}
            </span>
          )}
        </header>

        {question && (
          <div
            role="progressbar"
            aria-label="Assessment progress"
            aria-valuemin={1}
            aria-valuemax={QUESTION_COUNT}
            aria-valuenow={step}
            aria-valuetext={`Question ${step} of ${QUESTION_COUNT}`}
            className="mb-8 mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
          >
            <div className="ai-progress-fill h-full rounded-full bg-primary" style={{ width: `${progress * 100}%` }} />
          </div>
        )}

        {step === INTRO && (
          <main className="ai-step flex flex-1 flex-col justify-center pb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">AI Test Readiness</p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-4 text-4xl font-bold leading-tight text-light-text outline-none sm:text-5xl"
            >
              How AI-ready is your test bench?
            </h1>
            <p className="mt-5 text-lg font-medium text-light-text">4 questions. ~30 seconds.</p>
            <p className="mt-3 text-lg leading-8 text-gray-text">
              Assess how accessible your current test environment is to AI-agent-driven testing.
            </p>
            <button
              type="button"
              onClick={handleStart}
              className="mt-10 flex min-h-[60px] w-full items-center justify-center gap-2 rounded-full bg-primary px-8 text-lg font-semibold text-white shadow-custom transition-colors duration-100 hover:bg-primary-dark active:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg sm:w-auto sm:self-start"
            >
              Start assessment
              <FiArrowRight aria-hidden="true" />
            </button>
            <p className="mt-4 text-sm text-gray-text">No sign-up needed to see your score.</p>
          </main>
        )}

        {question && (
          <main className="flex flex-1 flex-col" key={question.id}>
            <QuestionScreen
              question={question}
              value={answers[question.id]}
              otherText={answers.otherText[question.id] || ''}
              advancing={advancing}
              isLast={step === QUESTION_COUNT}
              headingRef={headingRef}
              onSelect={handleSelect}
              onOtherText={handleOtherText}
              onContinue={() => advance(step, answers)}
            />
          </main>
        )}

        {step === RESULT && (
          <main className="flex-1">
            <ResultScreen
              result={result}
              headingRef={headingRef}
              onEmailStarted={() => trackAiReadiness(AI_READINESS_EVENTS.emailStarted, resultProperties(result))}
              onEmailSubmit={handleEmailSubmit}
              nexusTo={withFunnelParams('/nexus')}
              onNexusClick={() => trackAiReadiness(AI_READINESS_EVENTS.nexusClicked, { from: 'email_confirmation', ...resultProperties(result) })}
              onRetake={handleRetake}
            />
          </main>
        )}
      </div>
    </div>
  );
};

export default AiReadinessPage;
