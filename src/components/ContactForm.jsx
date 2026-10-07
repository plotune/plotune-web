import React, { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { posthog } from '../posthog';
import { getFunnelContext } from '../utils/funnel';
import { trackGoogleAdsContactConversion } from '../utils/googleAds';
import { buildContactPayload, isValidEmail, newSubmissionId, postLead } from '../utils/leadSubmission';

const CONTACT_EMAIL = 'contact@plotune.net';
const MAX_MESSAGE = 3000;

// Analytics for the form. Never the email address or the message text (both can contain personal
// data); only that the form was started / submitted, the outcome and the message length.
const track = (event, properties = {}) => {
  posthog.capture(event, { ...getFunnelContext(), path: window.location.pathname, ...properties });
};

// Contact form on /contact: the primary way to reach us. It replaces relying on a mailto: link, which
// hands the visitor to their mail app (on Android: Gmail with a draft) where most never press send --
// 15 taps produced 1 email. Two fields only (Hick / cognitive load), labels above inputs (Jakob),
// 56px submit (Fitts), one solid button on the page (Von Restorff), clear confirmation (peak-end).
// A sent message is the Google Ads "Kişi" conversion.
const ContactForm = ({ topic = null }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | preview
  const [sendError, setSendError] = useState(false);
  const startedRef = useRef(false);
  const honeypotRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const doneRef = useRef(null);
  const submissionRef = useRef({ key: null, id: null });

  useEffect(() => {
    if ((status === 'sent' || status === 'preview') && doneRef.current) doneRef.current.focus();
  }, [status]);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track('contact_form_started', { topic });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    const nextErrors = {};
    if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email, like name@company.com';
    if (!message.trim()) nextErrors.message = 'Tell us briefly what you would like to discuss.';
    setErrors(nextErrors);
    setSendError(false);
    if (nextErrors.email) { emailRef.current?.focus(); return; }
    if (nextErrors.message) { messageRef.current?.focus(); return; }

    // Same id for a retry of the same message, so a slow first reply can't create a duplicate.
    const key = `${email.trim().toLowerCase()}|${message.trim()}`;
    if (submissionRef.current.key !== key) submissionRef.current = { key, id: newSubmissionId() };

    setStatus('sending');
    const outcome = await postLead(buildContactPayload({
      email,
      message,
      topic,
      funnel: getFunnelContext(),
      website: honeypotRef.current ? honeypotRef.current.value : '',
      submissionId: submissionRef.current.id,
    }));
    const googleAdsConversion = outcome.status === 'sent' ? trackGoogleAdsContactConversion() : false;
    track('contact_form_submitted', {
      topic,
      delivery: outcome.status, // sent | not_configured | error
      message_length: message.trim().length,
      google_ads_conversion: googleAdsConversion,
    });
    if (outcome.status === 'error') {
      setStatus('idle');
      setSendError(true);
      return;
    }
    setStatus(outcome.status === 'sent' ? 'sent' : 'preview');
  };

  if (status === 'sent' || status === 'preview') {
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/10 p-6 text-center" role="status">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-dark-bg">
          <FiCheck className="text-2xl" strokeWidth={3} aria-hidden="true" />
        </span>
        {status === 'sent' ? (
          <>
            <h2 ref={doneRef} tabIndex={-1} className="mt-4 text-xl font-semibold text-light-text outline-none">Message sent</h2>
            <p className="mt-2 text-base leading-7 text-gray-text">
              Thanks. We&apos;ll reply to{' '}
              {/* ph-no-capture: keep the address out of session replays. */}
              <span className="ph-no-capture break-all text-light-text">{email.trim()}</span>.
            </p>
          </>
        ) : (
          <>
            <h2 ref={doneRef} tabIndex={-1} className="mt-4 text-xl font-semibold text-light-text outline-none">Preview only: nothing was sent</h2>
            <p className="mt-2 text-base leading-7 text-gray-text">The contact form isn&apos;t connected in this build.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative rounded-2xl border border-white/10 bg-dark-card/80 p-6 shadow-2xl backdrop-blur-xl md:p-7">
      {/* Honeypot: hidden from people and assistive tech; the server discards submissions that fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input ref={honeypotRef} type="text" name="hp_extra_field" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <label htmlFor="contact-email" className="block text-sm font-medium text-light-text">Work email</label>
      <input
        id="contact-email"
        ref={emailRef}
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="name@company.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((x) => ({ ...x, email: undefined })); markStarted(); }}
        aria-invalid={errors.email ? 'true' : undefined}
        aria-describedby={errors.email ? 'contact-email-error' : undefined}
        className={`mt-2 h-14 w-full rounded-xl border bg-dark-bg px-4 text-base text-light-text placeholder:text-gray-text/60 focus:outline-none focus:ring-1 ${
          errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-white/15 focus:border-primary focus:ring-primary'
        }`}
      />
      {errors.email && <p id="contact-email-error" role="alert" className="mt-2 text-sm text-red-300">{errors.email}</p>}

      <label htmlFor="contact-message" className="mt-5 block text-sm font-medium text-light-text">How can we help?</label>
      <textarea
        id="contact-message"
        ref={messageRef}
        rows={4}
        maxLength={MAX_MESSAGE}
        placeholder={topic ? `e.g. We'd like to automate ${topic} on our bench…` : 'What do you test, and what would you like to automate?'}
        value={message}
        onChange={(e) => { setMessage(e.target.value); if (errors.message) setErrors((x) => ({ ...x, message: undefined })); markStarted(); }}
        aria-invalid={errors.message ? 'true' : undefined}
        aria-describedby={errors.message ? 'contact-message-error' : undefined}
        // text-base (16px): smaller makes iOS Safari zoom the page on focus.
        className={`mt-2 w-full resize-y rounded-xl border bg-dark-bg px-4 py-3 text-base leading-6 text-light-text placeholder:text-gray-text/60 focus:outline-none focus:ring-1 ${
          errors.message ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-white/15 focus:border-primary focus:ring-primary'
        }`}
      />
      {errors.message && <p id="contact-message-error" role="alert" className="mt-2 text-sm text-red-300">{errors.message}</p>}

      {sendError && (
        <p role="alert" className="mt-4 text-sm leading-6 text-red-300">
          We couldn&apos;t send that just now. Please try again, or email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">{CONTACT_EMAIL}</a>.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-5 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-white transition-colors duration-100 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-card disabled:cursor-wait disabled:bg-primary-dark"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
        {status !== 'sending' && <FiArrowRight aria-hidden="true" />}
      </button>
      {status === 'sending' && <p className="mt-2 text-center text-xs text-gray-text" role="status">This can take a few seconds.</p>}

      <p className="mt-4 text-center text-xs leading-5 text-gray-text">
        We&apos;ll use your email to reply to your request.{' '}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-light-text">Privacy</a>
      </p>
    </form>
  );
};

export default ContactForm;
