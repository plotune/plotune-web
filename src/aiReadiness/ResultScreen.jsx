import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import EmailCapture from './EmailCapture';

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const COUNT_UP_MS = 900;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Counts 0 -> target with an ease-out so the number "lands". Screen readers get the final value
// from the aria-label immediately; the animation is decoration only.
const useCountUp = (target) => {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));
  useEffect(() => {
    if (prefersReducedMotion() || typeof window.requestAnimationFrame !== 'function') {
      setValue(target);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / COUNT_UP_MS);
      setValue(Math.round(target * (1 - (1 - t) ** 3)));
      if (t < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target]);
  return value;
};

// Von Restorff / Peak-End: this number is deliberately the loudest thing in the whole flow --
// 7rem type inside a ring -- while everything around it stays quiet.
const ScoreRing = ({ score }) => {
  const shown = useCountUp(score);
  const [drawn, setDrawn] = useState(prefersReducedMotion());
  useEffect(() => {
    const frame = window.requestAnimationFrame ? window.requestAnimationFrame(() => setDrawn(true)) : null;
    if (frame === null) setDrawn(true);
    return () => frame !== null && window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64" role="img" aria-label={`${score} percent AI-ready`} data-score={score}>
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          className="ai-ring-progress"
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="#3d5a80"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={drawn ? CIRCUMFERENCE * (1 - score / 100) : CIRCUMFERENCE}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="text-[4.5rem] font-bold leading-none tracking-tight text-light-text sm:text-7xl">
          {shown}
          <span className="text-4xl font-semibold text-primary sm:text-5xl">%</span>
        </span>
      </div>
    </div>
  );
};

// "3 of 4 areas assessed" as four pips + words: filled = assessed. Communicates confidence
// without turning an unknown into a penalty.
const Coverage = ({ assessed, total }) => (
  <div className="mt-5 flex items-center justify-center gap-3 text-sm text-gray-text">
    <span className="flex gap-1.5" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-2 w-6 rounded-full ${i < assessed ? 'bg-primary' : 'bg-dark-card'}`} />
      ))}
    </span>
    <span>{assessed} of {total} areas assessed</span>
  </div>
);

// Shown instead of the email form when the answers look careless (leadQuality.js): the visitor
// keeps their score and a way onward, but there is no lead to capture.
const NexusNext = ({ nexusTo, onNexusClick }) => (
  <div className="ai-step rounded-sm border border-ink/10 bg-dark-card p-6 text-center">
    <h2 className="text-xl font-semibold leading-snug text-light-text">See how an agent reaches your bench</h2>
    <p className="mt-2 text-base leading-7 text-gray-text">
      Plotune Nexus connects AI agents to CAN, UART, DDS and the tools you already use.
    </p>
    <Link
      to={nexusTo}
      onClick={() => onNexusClick('result_no_email')}
      className="mt-5 inline-flex min-h-[48px] items-center gap-1.5 rounded-full bg-primary px-6 text-base font-semibold text-white transition-colors duration-100 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      Explore Plotune Nexus
      <FiArrowRight aria-hidden="true" />
    </Link>
  </div>
);

const ResultScreen = ({ result, headingRef, onEmailStarted, onEmailSubmit, submission, showEmailCapture = true, nexusTo, onNexusClick, onRetake }) => (
  <div className="ai-step pb-10">
    <div className="pt-2 text-center">
      <h1 ref={headingRef} tabIndex={-1} className="text-lg font-medium text-gray-text outline-none">
        Your test bench is
      </h1>
      <div className="mt-4">
        <ScoreRing score={result.score} />
      </div>
      <p className="mt-2 text-2xl font-semibold text-light-text">AI-ready</p>

      {result.assessedAreas < result.totalAreas && (
        <Coverage assessed={result.assessedAreas} total={result.totalAreas} />
      )}

      <p className="mx-auto mt-5 max-w-md text-lg leading-8 text-dark-text">{result.interpretation}</p>
      {result.coverageNote && <p className="mx-auto mt-3 max-w-md text-base leading-7 text-gray-text">{result.coverageNote}</p>}
    </div>

    <div className="mt-10">
      {showEmailCapture || submission ? (
        <EmailCapture
          onFirstInput={onEmailStarted}
          onSubmit={onEmailSubmit}
          submission={submission}
          nexusTo={nexusTo}
          onNexusClick={() => onNexusClick('email_confirmation')}
        />
      ) : (
        <NexusNext nexusTo={nexusTo} onNexusClick={onNexusClick} />
      )}
    </div>

    <div className="mt-6 text-center">
      <button
        type="button"
        onClick={onRetake}
        className="inline-flex min-h-[44px] items-center px-4 text-sm text-gray-text underline underline-offset-4 hover:text-light-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Retake the assessment
      </button>
    </div>
  </div>
);

export default ResultScreen;
