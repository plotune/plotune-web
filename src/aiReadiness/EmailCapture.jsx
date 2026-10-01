import React, { useRef, useState } from 'react';
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
const EmailCapture = ({ onFirstInput, onSubmit, nexusTo, onNexusClick }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [delivery, setDelivery] = useState(null);
  const startedRef = useRef(false);

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
      return;
    }
    setStatus('sending');
    const outcome = await onSubmit(email);
    if (outcome === 'error') {
      setStatus('idle');
      setError('We couldn’t send that just now. Please try again.');
      return;
    }
    setDelivery(outcome);
    setStatus('done');
  };

  if (status === 'done') {
    const preview = delivery === 'not_configured';
    return (
      <div className="ai-step rounded-2xl border border-primary/40 bg-primary/10 p-6 text-center">
        <div role="status">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-dark-bg">
            <FiCheck className="text-2xl" strokeWidth={3} aria-hidden="true" />
          </span>
          {preview ? (
            <>
              <h2 className="mt-4 text-xl font-semibold text-light-text">Preview only: nothing was sent</h2>
              <p className="mt-2 text-base leading-7 text-gray-text">
                Email delivery isn’t connected in this version, so your address wasn’t stored or sent anywhere.
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-4 text-xl font-semibold text-light-text">Request received</h2>
              <p className="mt-2 text-base leading-7 text-gray-text">
                We’ll send your detailed assessment to <span className="break-all text-light-text">{email.trim()}</span>.
              </p>
            </>
          )}
        </div>
        {/* Staying on the page is the default; this is a quiet, optional way onward. */}
        <Link
          to={nexusTo}
          onClick={onNexusClick}
          className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/15 px-5 text-sm font-medium text-light-text transition-colors duration-100 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
      className="rounded-2xl border border-primary/40 bg-dark-card p-6 shadow-custom"
    >
      <h2 className="text-xl font-semibold leading-snug text-light-text sm:text-2xl">
        Want to know what’s holding your setup back?
      </h2>
      <p className="mt-2 text-base text-gray-text">Get your detailed assessment, including:</p>
      <ul className="mt-4 space-y-3">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex gap-3 text-base leading-snug text-dark-text">
            <FiCheck className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            {benefit}
          </li>
        ))}
      </ul>

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
        value={email}
        onChange={handleChange}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? 'ai-readiness-email-error' : undefined}
        // text-base (16px) so iOS Safari doesn't zoom the page when the field is focused.
        className={`mt-2 h-14 w-full rounded-xl border bg-dark-bg px-4 text-base text-light-text placeholder:text-gray-text/60 focus:outline-none focus:ring-1 ${
          error ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-white/15 focus:border-primary focus:ring-primary'
        }`}
      />
      <p id="ai-readiness-email-error" role="alert" className={`text-sm text-red-300 ${error ? 'mt-2' : 'sr-only'}`}>
        {error}
      </p>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-4 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-white transition-colors duration-100 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-card disabled:cursor-wait disabled:bg-primary-dark"
      >
        {status === 'sending' ? 'Sending…' : 'Get my detailed assessment'}
        {status !== 'sending' && <FiArrowRight aria-hidden="true" />}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-gray-text">
        Your email is used only to prepare and send this assessment.{' '}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-light-text">
          Privacy
        </a>
      </p>
    </form>
  );
};

export default EmailCapture;
