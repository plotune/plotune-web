import React, { useEffect, useRef, useState } from 'react';
import { suggestEmailFix } from '../utils/emailTypos';
import { trackGoogleAdsOrderRequestConversion } from '../utils/googleAds';
import { buildOrderPayload, isValidEmail, newSubmissionId, postLead } from '../utils/leadSubmission';
import { getFunnelContext } from '../utils/funnel';
import { OFFER_VERSION } from '../utils/nexusOffer';

const CONTACT_EMAIL = 'contact@plotune.net';
export const REPLY_TIME = 'within 1 business day';

// The Nexus rent / buy request (last step of /nexus/pricing). No payment is taken: the request is
// saved and emailed to us, and we confirm availability, tax and shipping and send an invoice --
// said plainly next to the button so nobody expects to pay here. A saved request is the Google
// Ads "Nexus Order Request" conversion.
//
// Two fields only: where to send the offer (work email; its domain already says which company)
// and the delivery country (tax and shipping depend on it). Anything else is asked by email, not
// in the way of the request.
//
// `summary` (the chosen offer in one line) is repeated on the confirmation; the page shows it above
// the form already. `track(event, props)` is the page's analytics function. It only ever receives choices and
// outcomes, never the email address; the country is kept because it decides tax and
// shipping and is not personal on its own.
const OrderRequestForm = ({ offer, months, quote, summary, track, headingRef, onDone = () => {} }) => {
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState({});
  const [emailFix, setEmailFix] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | preview
  const [sendError, setSendError] = useState(false);
  const startedRef = useRef(false);
  const honeypotRef = useRef(null);
  const emailRef = useRef(null);
  const countryRef = useRef(null);
  const doneRef = useRef(null);
  const submissionRef = useRef({ key: null, id: null });

  useEffect(() => {
    if ((status === 'sent' || status === 'preview') && doneRef.current) doneRef.current.focus();
  }, [status]);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track('pricing_request_started', { offer });
  };

  const handleEmailBlur = () => {
    if (!email.trim()) return;
    if (!isValidEmail(email)) {
      setErrors((x) => ({ ...x, email: 'Enter a valid email, like name@company.com' }));
      setEmailFix(null);
      return;
    }
    setEmailFix(suggestEmailFix(email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    const nextErrors = {};
    if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email, like name@company.com';
    if (!country.trim()) nextErrors.country = 'Add your country, so we can quote tax and shipping.';
    setErrors(nextErrors);
    setSendError(false);
    if (nextErrors.email) { emailRef.current?.focus(); return; }
    if (nextErrors.country) { countryRef.current?.focus(); return; }

    // The same id for a retry of the same request, so a slow first reply can't make a duplicate.
    const key = [email.trim().toLowerCase(), country.trim(), offer, JSON.stringify(quote)].join('|');
    if (submissionRef.current.key !== key) submissionRef.current = { key, id: newSubmissionId() };

    setStatus('sending');
    const outcome = await postLead(buildOrderPayload({
      email, country, offer,
      months: offer === 'rent' ? months : null,
      quote,
      offerVersion: OFFER_VERSION,
      funnel: getFunnelContext(),
      website: honeypotRef.current ? honeypotRef.current.value : '',
      submissionId: submissionRef.current.id,
    }));
    const googleAdsConversion = outcome.status === 'sent' ? trackGoogleAdsOrderRequestConversion(submissionRef.current.id) : false;
    track('pricing_request_submitted', {
      offer,
      months: offer === 'rent' ? months : null,
      with_support: offer === 'buy' ? Boolean(quote.withSupport) : null,
      country: country.trim().slice(0, 80),
      delivery: outcome.status, // sent | not_configured | error
      google_ads_conversion: googleAdsConversion,
    });
    if (outcome.status === 'error') {
      setStatus('idle');
      setSendError(true);
      return;
    }
    setStatus(outcome.status === 'sent' ? 'sent' : 'preview');
    onDone();
  };

  if (status === 'sent' || status === 'preview') {
    return (
      <div className="offer-done" role="status">
        {status === 'sent' ? (
          <>
            <h2 ref={doneRef} tabIndex={-1}>Request received</h2>
            <p>{summary}.</p>
            <p>
              We&apos;ll email{' '}
              {/* ph-no-capture: keep the address out of session replays. */}
              <span className="ph-no-capture">{email.trim()}</span> {REPLY_TIME} with availability, the exact tax and
              shipping for {country.trim()}, and the invoice. Nothing is charged until you approve it.
            </p>
          </>
        ) : (
          <>
            <h2 ref={doneRef} tabIndex={-1}>Preview only: nothing was sent</h2>
            <p>The request form isn&apos;t connected in this build.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <form className="offer-form" onSubmit={handleSubmit} noValidate>
      <div aria-hidden="true" className="offer-honeypot">
        <label>
          Leave this field empty
          <input ref={honeypotRef} type="text" name="hp_extra_field" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <h2 ref={headingRef} tabIndex={-1}>Where should we send the offer?</h2>

      <label htmlFor="order-email">Work email</label>
      <input
        id="order-email"
        ref={emailRef}
        className="ph-no-capture"
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
        aria-describedby={errors.email ? 'order-email-error' : emailFix ? 'order-email-fix' : undefined}
      />
      {(email || errors.email) && (
        <div className="field-hint">
          {errors.email ? (
            <div id="order-email-error" role="alert" className="field-error">{errors.email}</div>
          ) : emailFix ? (
            <div id="order-email-fix" role="status">
              Did you mean{' '}
              <button type="button" className="ph-no-capture" onClick={() => { setEmail(emailFix); setEmailFix(null); track('pricing_email_fix_accepted'); }}>{emailFix}</button>?
            </div>
          ) : null}
        </div>
      )}

      <label htmlFor="order-country">Delivery country</label>
      <input
        id="order-country"
        ref={countryRef}
        type="text"
        autoComplete="country-name"
        value={country}
        maxLength={80}
        onChange={(e) => { setCountry(e.target.value); if (errors.country) setErrors((x) => ({ ...x, country: undefined })); markStarted(); }}
        aria-invalid={errors.country ? 'true' : undefined}
        aria-describedby={errors.country ? 'order-country-error' : 'order-country-note'}
      />
      {errors.country
        ? <div id="order-country-error" role="alert" className="field-error">{errors.country}</div>
        : <div id="order-country-note" className="field-note">For the exact tax, shipping and any import duties.</div>}

      {sendError && (
        <div role="alert" className="field-error offer-send-error">
          We couldn&apos;t send that just now. Please try again, or email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </div>
      )}

      <button type="submit" className="design-button offer-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send me the offer ↗'}
      </button>
      {status === 'sending' && <div className="offer-fineprint" role="status">This can take a few seconds.</div>}
      <div className="offer-fineprint">
        No payment now. We reply {REPLY_TIME} with availability, tax, shipping and an invoice, and use your email only
        for that. <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
      </div>
    </form>
  );
};

export default OrderRequestForm;
