import React, { useEffect, useRef, useState } from 'react';
import { CATALOG_VERSION } from '../../content/bridgeCatalog';
import { suggestEmailFix } from '../../utils/emailTypos';
import { buildCartContactPayload, buildCartPayload, getEndpointKinds, isValidEmail, newSubmissionId, postLead } from '../../utils/leadSubmission';
import { getFunnelContext } from '../../utils/funnel';
import { SECTORS } from '../OrderRequestForm';

const CONTACT_EMAIL = 'contact@plotune.net';

// The last step of the Bridge funnel: where to send the offer. Same shape and fields as the Nexus
// request (OrderRequestForm): an email, the delivery country (tax and shipping depend on it), an
// optional sector and the privacy consent. No payment is taken; the request is saved to the same
// Google sheet endpoint and we reply by email. The form styles are the shared `offer-form` ones.
//
// `items` are the cart lines ({ id, qty }), `quote` is { currency, total } (total null when the order
// is to be quoted). `track(event, props)` only ever receives choices and outcomes, never the
// address. On a saved (or preview) request it calls onSent({ status, email, country }).
const CartRequestForm = ({ items, quote, track, onSent }) => {
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [sector, setSector] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailFix, setEmailFix] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const startedRef = useRef(false);
  const honeypotRef = useRef(null);
  const emailRef = useRef(null);
  const countryRef = useRef(null);
  const consentRef = useRef(null);
  const submissionRef = useRef({ key: null, id: null });

  // Ask the deployed script what it understands while the visitor fills the form (a cold Apps Script can take
  // seconds to answer), so submitting does not wait for it.
  useEffect(() => { getEndpointKinds(); }, []);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track('bridge_request_started');
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
    if (sending) return;
    const next = {};
    if (!isValidEmail(email)) next.email = 'Enter a valid email, like name@company.com';
    if (!country.trim()) next.country = 'Add your country, so we can quote tax and shipping.';
    if (!consent) next.consent = 'Please accept the Privacy Policy to send the request.';
    setErrors(next);
    setSendError(false);
    if (next.email) { emailRef.current?.focus(); return; }
    if (next.country) { countryRef.current?.focus(); return; }
    if (next.consent) { consentRef.current?.focus(); return; }

    // The same id for a retry of the same request, so a slow first reply can't make a duplicate.
    const key = [email.trim().toLowerCase(), country.trim(), sector, JSON.stringify(items)].join('|');
    if (submissionRef.current.key !== key) submissionRef.current = { key, id: newSubmissionId() };

    // A filled honeypot means a bot: the server discards it but still answers ok, so it must not
    // be counted as a request.
    const honeypot = honeypotRef.current ? honeypotRef.current.value : '';
    setSending(true);
    // The structured 'cart' row only when the deployed script says it understands it; otherwise the same request
    // goes through the contact path that every deployed version has (see buildCartContactPayload).
    const structured = (await getEndpointKinds()).includes('cart');
    const fields = {
      email, country, sector, items, quote,
      catalogVersion: CATALOG_VERSION,
      funnel: getFunnelContext(),
      website: honeypot,
      submissionId: submissionRef.current.id,
    };
    const outcome = await postLead(structured ? buildCartPayload(fields) : buildCartContactPayload(fields));
    setSending(false);
    track('bridge_request_submitted', {
      lines: items.length,
      units: items.reduce((sum, item) => sum + item.qty, 0),
      products: items.map((item) => item.id).join(','),
      priced: quote.total !== null,
      country: country.trim().slice(0, 80),
      sector: sector || null,
      delivery: honeypot ? 'ignored' : outcome.status, // sent | not_configured | error | ignored
      route: structured ? 'cart' : 'contact_fallback',
    });
    if (outcome.status === 'error') { setSendError(true); return; }
    onSent({ status: outcome.status === 'sent' ? 'sent' : 'preview', email: email.trim(), country: country.trim() });
  };

  return (
    <form className="offer-form" onSubmit={handleSubmit} noValidate>
      <div aria-hidden="true" className="offer-honeypot">
        <label>
          Leave this field empty
          <input ref={honeypotRef} type="text" name="hp_extra_field" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <h2>Where should we send the offer?</h2>

      <label htmlFor="cart-email">Email</label>
      <input
        id="cart-email"
        ref={emailRef}
        className="ph-no-capture"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="you@company.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setEmailFix(null); if (errors.email) setErrors((x) => ({ ...x, email: undefined })); markStarted(); }}
        onBlur={handleEmailBlur}
        aria-invalid={errors.email ? 'true' : undefined}
        aria-describedby={errors.email ? 'cart-email-error' : emailFix ? 'cart-email-fix' : undefined}
      />
      {(email || errors.email) && (
        <div className="field-hint">
          {errors.email ? (
            <div id="cart-email-error" role="alert" className="field-error">{errors.email}</div>
          ) : emailFix ? (
            <div id="cart-email-fix" role="status">
              Did you mean{' '}
              <button type="button" className="ph-no-capture" onClick={() => { setEmail(emailFix); setEmailFix(null); track('bridge_request_email_fix_accepted'); }}>{emailFix}</button>?
            </div>
          ) : null}
        </div>
      )}

      <div className="field-pair">
        <div>
          <label htmlFor="cart-country">Delivery country</label>
          <input
            id="cart-country"
            ref={countryRef}
            type="text"
            autoComplete="country-name"
            value={country}
            maxLength={80}
            onChange={(e) => { setCountry(e.target.value); if (errors.country) setErrors((x) => ({ ...x, country: undefined })); markStarted(); }}
            aria-invalid={errors.country ? 'true' : undefined}
            aria-describedby={errors.country ? 'cart-country-error' : undefined}
          />
          {errors.country && <div id="cart-country-error" role="alert" className="field-error">{errors.country}</div>}
        </div>
        <div>
          <label htmlFor="cart-sector">Sector <span>(optional)</span></label>
          <select id="cart-sector" value={sector} onChange={(e) => { setSector(e.target.value); markStarted(); }}>
            <option value="">Choose…</option>
            {SECTORS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </div>

      <label className={`consent${errors.consent ? ' has-error' : ''}`} htmlFor="cart-consent">
        <input
          id="cart-consent"
          ref={consentRef}
          type="checkbox"
          checked={consent}
          onChange={(e) => { setConsent(e.target.checked); if (errors.consent) setErrors((x) => ({ ...x, consent: undefined })); markStarted(); }}
          aria-invalid={errors.consent ? 'true' : undefined}
          aria-describedby={errors.consent ? 'cart-consent-error' : undefined}
        />
        <span>I agree to the <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</span>
      </label>
      {errors.consent && <div id="cart-consent-error" role="alert" className="field-error">{errors.consent}</div>}

      {sendError && (
        <div role="alert" className="field-error offer-send-error">
          We couldn&apos;t send that just now. Please try again, or email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </div>
      )}

      <button type="submit" className="design-button offer-submit" disabled={sending}>
        {sending ? 'Sending…' : 'Send my request ↗'}
      </button>
      {sending && <div className="offer-fineprint" role="status">This can take a few seconds.</div>}
    </form>
  );
};

export default CartRequestForm;
