import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { isValidEmail } from './submission';

const BENEFITS = [
  'Where an AI agent could fit into your current workflow',
  'The biggest barriers to agent-driven testing',
  'Integration opportunities in your existing toolchain',
  'A suggested first use case for your bench',
];

// The score is already on screen before this appears (peak first, ask second), and this card is
// the only competing action on the result screen -- the final peak of the experience. Rendered
// as one tidy unit: promise, the single field it needs, one dominant button.
// `submission` ({ delivery, email } or null) is owned by the page and persisted there, so after a
// reload a visitor who already sent their email sees the confirmation, not an empty form.
const EmailCapture = ({ onFirstInput, onSubmit, submission, nexusTo, onNexusClick }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending
  const startedRef = useRef(false);
  const honeypotRef = useRef(null);
  const inputRef = useRef(null);
  const confirmationRef = useRef(null);
  const justSubmittedRef = useRef(false);

  // After a fresh send the form unmounts; move focus to the confirmation so keyboard and
  // screen-reader users aren't left on nothing (not on a restored confirmation after a reload).
  useEffect(() => {
    if (submission && justSubmittedRef.current && confirmationRef.current) {
      justSubmittedRef.current = false;
      confirmationRef.current.focus({ preventScroll: false });
    }
  }, [submission]);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (!startedRef.current) {
      startedRef.current = true;
      onFirstInput();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (!isValidEmail(email)) {
      setError('Enter a valid email, like name@company.com');
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    setStatus('sending');
    justSubmittedRef.current = true;
    const outcome = await onSubmit(email, honeypotRef.current ? honeypotRef.current.value : '');
    setStatus('idle');
    if (outcome === 'error') {
      justSubmittedRef.current = false;
      setError('We couldn’t send that just now. Please check your connection and try again.');
      if (inputRef.current) inputRef.current.focus();
    }
    // On success the page records the submission, which switches this card to the confirmation.
  };

  if (submission) {
    const preview = submission.delivery === 'not_configured';
    return (
      <div className="ai-step rounded-sm border border-primary/40 bg-primary/10 p-6 text-center">
        <div role="status">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-dark-bg">
            <FiCheck className="text-2xl" strokeWidth={3} aria-hidden="true" />
          </span>
          {preview ? (
            <>
              <h2 ref={confirmationRef} tabIndex={-1} className="mt-4 text-xl font-semibold text-light-text outline-none">Preview only: nothing was sent</h2>
              <p className="mt-2 text-base leading-7 text-gray-text">
                Email delivery isn’t connected in this version, so your address wasn’t stored or sent anywhere.
              </p>
            </>
          ) : (
            <>
              <h2 ref={confirmationRef} tabIndex={-1} className="mt-4 text-xl font-semibold text-light-text outline-none">Request received</h2>
              <p className="mt-2 text-base leading-7 text-gray-text">
                We’ll send your detailed assessment to {/* ph-no-capture: keep the address out of session replays (inputs are masked; text is not). */}
                <span className="ph-no-capture break-all text-light-text">{submission.email}</span>.
              </p>
            </>
          )}
        </div>
        {/* Staying on the page is the default; this is a quiet, optional way onward. */}
        <Link
          to={nexusTo}
          onClick={onNexusClick}
          className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-ink/15 px-5 text-sm font-medium text-light-text transition-colors duration-100 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Learn about Plotune Nexus
          <FiArrowRight aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative rounded-sm border border-primary/40 bg-dark-card p-6 "
    >
      <h2 className="text-xl font-semibold leading-snug text-light-text sm:text-2xl">
        Want to know what’s holding your setup back?
      </h2>
      <p className="mt-2 text-base text-gray-text">Get your detailed assessment from the Plotune team, including:</p>
      <ul className="mt-4 space-y-3">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex gap-3 text-base leading-snug text-dark-text">
            <FiCheck className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            {benefit}
          </li>
        ))}
      </ul>

      {/* Honeypot: invisible to people and assistive tech, tempting to bots. The server discards
          any submission where it is filled. Deliberately NOT named like a real field ("website",
          "url", "company"...) so browser/password-manager autofill can't fill it and silently
          drop a genuine lead. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input ref={honeypotRef} type="text" name="hp_extra_field" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <label htmlFor="ai-readiness-email" className="mt-6 block text-sm font-medium text-light-text">
        Work email
      </label>
      <input
        id="ai-readiness-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        enterKeyHint="send"
        placeholder="name@company.com"
        ref={inputRef}
        value={email}
        onChange={handleChange}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? 'ai-readiness-email-error' : undefined}
        // text-base (16px) so iOS Safari doesn't zoom the page when the field is focused.
        className={`mt-2 h-14 w-full rounded-sm border bg-dark-bg px-4 text-base text-light-text placeholder:text-gray-text/60 focus:outline-none focus:ring-1 ${
          error ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-ink/15 focus:border-primary focus:ring-primary'
        }`}
      />
      <p id="ai-readiness-email-error" role="alert" className={`text-sm text-red-300 ${error ? 'mt-2' : 'sr-only'}`}>
        {error}
      </p>

      <button
        type="submit"
        disabled={status === 'sending'}
        // px-4 + 15px text on phones keeps the label on one line at 360-375px widths.
        className="mt-4 flex min-h-[56px] w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-[15px] font-semibold sm:gap-2 sm:px-6 sm:text-base text-white transition-colors duration-100 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-card disabled:cursor-wait disabled:bg-primary-dark"
      >
        {status === 'sending' ? 'Sending…' : 'Get my detailed assessment'}
        {status !== 'sending' && <FiArrowRight aria-hidden="true" />}
      </button>
      {status === 'sending' && (
        <p className="mt-2 text-center text-xs text-gray-text" role="status">This can take a few seconds.</p>
      )}

      {/* Plain, accurate disclosure: the email IS used for follow-up, so it must not say "only". */}
      <p className="mt-4 text-center text-xs leading-5 text-gray-text">
        We’ll use your email to send your assessment and follow up about it.
      </p>
      <details className="mt-2 text-center text-xs leading-5 text-gray-text">
        <summary className="inline-flex min-h-[44px] cursor-pointer items-center underline underline-offset-2 hover:text-light-text">
          How we handle your data
        </summary>
        <div className="mt-1 space-y-2 text-left">
          <p>Your email, answers and score are stored in Plotune’s Google Workspace so our team can prepare your assessment and reply to you.</p>
          <p>Anonymous usage analytics record which options are chosen and the score, never your email address.</p>
          <p>
            To see or delete your data, email{' '}
            <a href="mailto:contact@plotune.net" className="underline underline-offset-2 hover:text-light-text">contact@plotune.net</a>.
            {' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-light-text">
              Privacy policy
            </a>
          </p>
        </div>
      </details>
    </form>
  );
};

export default EmailCapture;
