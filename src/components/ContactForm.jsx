import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { posthog } from '../posthog';
import { getFunnelContext, withFunnelParams } from '../utils/funnel';
import { suggestEmailFix } from '../utils/emailTypos';
import { trackGoogleAdsContactConversion } from '../utils/googleAds';
import { buildContactPayload, isValidEmail, newSubmissionId, postLead } from '../utils/leadSubmission';

const CONTACT_EMAIL = 'contact@plotune.net';
const MAX_MESSAGE = 3000;
const REPLY_TIME = 'within 1 business day';

// Starter chips (Tesler's law: we take on the "how do I start this message" work). Three at most
// (Hick). Each fills an editable opening sentence; the visitor finishes it in their own words.
const buildStarters = (topic) => [
  {
    id: 'evaluate',
    label: 'Evaluate Nexus for our bench',
    text: topic
      ? `We'd like to evaluate Plotune Nexus for ${topic} on our bench. Our setup: `
      : "We'd like to evaluate Plotune Nexus on our test bench. Our setup: ",
  },
  { id: 'demo', label: 'Book a demo', text: "We'd like a short demo of Plotune Nexus. Good times for us: " },
  { id: 'pricing', label: 'Pricing', text: "We'd like to understand pricing for Plotune Nexus. Benches / team size: " },
];

// Analytics for the form. Never the email address or the message text (both can contain personal
// data); only that the form was started / submitted, the outcome and the message length.
const track = (event, properties = {}) => {
  posthog.capture(event, { ...getFunnelContext(), path: window.location.pathname, ...properties });
};

// Contact form on /contact: the primary way to reach us. It replaces relying on a mailto: link, which
// hands the visitor to their mail app (on Android: Gmail with a draft) where most never press send --
// 15 taps produced 1 email. Two fields only (Hick / cognitive load), labels above inputs (Jakob),
// 56px submit (Fitts), one solid button on the page (Von Restorff), starter chips (Tesler), the email
// checked as soon as the field is left, with a typo fix offered (Postel), a stated reply time, and a
// confirmation that ends on a next step (peak-end). A sent message is the Google Ads "Kişi" conversion.
const ContactForm = ({ topic = null }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | preview
  const [sendError, setSendError] = useState(false);
  const [emailFix, setEmailFix] = useState(null);
  const [starter, setStarter] = useState(null);
  const starters = buildStarters(topic);
  const startedRef = useRef(false);
  const honeypotRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const doneRef = useRef(null);
  const submissionRef = useRef({ key: null, id: null });

  useEffect(() => {
    if ((status === 'sent' || status === 'preview') && doneRef.current) doneRef.current.focus();
  }, [status]);

  // After a chip fills the message, put the cursor at the end so the visitor just keeps typing.
  useEffect(() => {
    const el = messageRef.current;
    if (!starter || !el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [starter]);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track('contact_form_started', { topic });
  };

  // Chips stay while the box is empty or still holds an untouched starter; they go away once the
  // visitor writes their own text, so they never overwrite it.
  const showStarters = !message.trim() || starters.some((x) => x.text === message);

  const chooseStarter = (item) => {
    setMessage(item.text);
    setStarter(item.id);
    if (errors.message) setErrors((x) => ({ ...x, message: undefined }));
    markStarted();
    track('contact_starter_selected', { starter: item.id, topic });
  };

  // Check the address when the visitor leaves the field, not only on submit.
  const handleEmailBlur = () => {
    if (!email.trim()) return;
    if (!isValidEmail(email)) {
      setErrors((x) => ({ ...x, email: 'Enter a valid email, like name@company.com' }));
      setEmailFix(null);
      return;
    }
    setEmailFix(suggestEmailFix(email));
  };

  const acceptEmailFix = () => {
    setEmail(emailFix);
    setEmailFix(null);
    track('contact_email_fix_accepted', { topic }); // never the address itself
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
      starter: starters.some((x) => x.id === starter && message.startsWith(x.text)) ? starter : null,
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
      <div className="rounded-sm border border-primary/40 bg-primary/10 p-6 text-center" role="status">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-dark-bg">
          <FiCheck className="text-2xl" strokeWidth={3} aria-hidden="true" />
        </span>
        {status === 'sent' ? (
          <>
            <h2 ref={doneRef} tabIndex={-1} className="mt-4 text-xl font-semibold text-light-text outline-none">Message sent</h2>
            <p className="mt-2 text-base leading-7 text-gray-text">
              Thanks. We&apos;ll reply to{' '}
              {/* ph-no-capture: keep the address out of session replays. */}
              <span className="ph-no-capture break-all text-light-text">{email.trim()}</span> {REPLY_TIME}.
            </p>
            {/* Peak-end: finish on a useful next step, not a dead end. */}
            <div className="mt-6 border-t border-ink/15 pt-5">
              <p className="text-sm font-semibold text-light-text">While you wait</p>
              <p className="mt-1 text-sm leading-6 text-gray-text">See how AI-ready your test bench is: 4 questions, about 30 seconds.</p>
              <Link
                to={withFunnelParams('/ai-readiness')}
                onClick={() => track('contact_sent_next_clicked', { target: 'ai_readiness', topic })}
                className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-semibold text-light-text transition-colors duration-100 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Check your test bench
                <FiArrowRight aria-hidden="true" />
              </Link>
              <Link
                to="/nexus"
                onClick={() => track('contact_sent_next_clicked', { target: 'nexus', topic })}
                className="mt-2 inline-flex min-h-[44px] items-center text-sm font-medium text-gray-text underline-offset-4 hover:text-primary hover:underline"
              >
                Or see how Plotune Nexus works
              </Link>
            </div>
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
    <form onSubmit={handleSubmit} noValidate className="relative rounded-sm border border-ink/15 bg-dark-card/80 p-6   md:p-7">
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
        onChange={(e) => { setEmail(e.target.value); setEmailFix(null); if (errors.email) setErrors((x) => ({ ...x, email: undefined })); markStarted(); }}
        onBlur={handleEmailBlur}
        aria-invalid={errors.email ? 'true' : undefined}
        aria-describedby={errors.email ? 'contact-email-error' : emailFix ? 'contact-email-fix' : undefined}
        className={`mt-2 h-14 w-full rounded-sm border bg-dark-bg px-4 text-base text-light-text placeholder:text-gray-text/60 focus:outline-none focus:ring-1 ${
          errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-ink/15 focus:border-primary focus:ring-primary'
        }`}
      />
      {/* One line is reserved once an email is typed, so the error or typo hint that appears when the
          field is left never shifts the chips and button below (a tap aimed at them would land on the
          moved layout). The hint's button gets its 44px tap height from padding, not layout. */}
      {(email || errors.email) && (
        <div className="mt-1 min-h-[24px] text-sm leading-6">
          {errors.email ? (
            <p id="contact-email-error" role="alert" className="text-red-300">{errors.email}</p>
          ) : emailFix ? (
            <p id="contact-email-fix" role="status" className="text-gray-text">
              Did you mean{' '}
              <button
                type="button"
                onClick={acceptEmailFix}
                className="ph-no-capture -my-2.5 break-all py-2.5 font-semibold text-primary underline underline-offset-4 hover:text-light-text"
              >
                {emailFix}
              </button>
              ?
            </p>
          ) : null}
        </div>
      )}

      <label htmlFor="contact-message" className="mt-5 block text-sm font-medium text-light-text">How can we help?</label>
      {showStarters && (
        <div role="group" aria-label="Start with" className="mt-2 flex flex-wrap gap-2">
          {starters.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={message === item.text}
              onClick={() => chooseStarter(item)}
              className={`min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                message === item.text ? 'border-primary bg-primary/15 text-light-text' : 'border-ink/15 text-gray-text hover:border-primary/60 hover:text-light-text'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
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
        className={`${showStarters ? 'mt-3' : 'mt-2'} w-full resize-y rounded-sm border bg-dark-bg px-4 py-3 text-base leading-6 text-light-text placeholder:text-gray-text/60 focus:outline-none focus:ring-1 ${
          errors.message ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-ink/15 focus:border-primary focus:ring-primary'
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
        We reply {REPLY_TIME} and use your email only for that.{' '}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-light-text">Privacy</a>
      </p>
    </form>
  );
};

export default ContactForm;
