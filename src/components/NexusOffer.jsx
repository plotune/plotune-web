import React, { useEffect, useRef, useState } from 'react';
import { posthog } from '../posthog';
import { getFunnelContext } from '../utils/funnel';
import { useCtaTracking } from '../utils/ctaTracking';
import { suggestEmailFix } from '../utils/emailTypos';
import { trackGoogleAdsOrderRequestConversion } from '../utils/googleAds';
import { buildOrderPayload, isValidEmail, newSubmissionId, postLead } from '../utils/leadSubmission';
import {
  BUY, BUY_PAYS_OFF_AFTER_MONTHS, DEPOSIT, LAUNCH_CUSTOMERS, MAX_MONTHS, MIN_MONTHS, OFFER_VERSION, RENT,
  clampMonths, quote, usd,
} from '../utils/nexusOffer';

const CONTACT_EMAIL = 'contact@plotune.net';
const REPLY_TIME = 'within 1 business day';
const TIMINGS = [
  ['asap', 'As soon as possible'],
  ['1_month', 'Within a month'],
  ['1_3_months', 'In 1–3 months'],
  ['comparing', 'Just comparing costs for now'],
];
const OFFER_LABEL = { rent: 'Rent', buy: 'Buy' };

// Shown beside the form: what a request commits the visitor to (nothing until they approve).
const NEXT_STEPS = {
  rent: [
    ['We confirm the details', `Availability, tax, shipping and any import duties for your country, ${REPLY_TIME}.`],
    ['You approve the invoice', 'First month and the refundable deposit. Nothing is charged before you approve.'],
    ['We ship Nexus ready to connect', 'Return it when the project ends; the deposit comes back after the return check.'],
  ],
  buy: [
    ['We confirm the details', `Availability, tax, shipping and any import duties for your country, ${REPLY_TIME}.`],
    ['You approve the invoice', 'Nothing is charged before you approve. Add the support plan now or later.'],
    ['We ship Nexus ready to connect', 'Yours to keep, with the setup guide and software updates.'],
  ],
};

// Analytics: choices and outcomes only. Never the email or company name (personal data); the
// country is kept because it decides tax and shipping and is not personal on its own.
const track = (event, properties = {}) => {
  posthog.capture(event, { ...getFunnelContext(), path: window.location.pathname, offer_version: OFFER_VERSION, ...properties });
};

const months_ = (n) => `${n} month${n === 1 ? '' : 's'}`;

// Rent / buy offer on /nexus, with a cost calculator and a request form. There is no checkout: a
// request is saved and emailed to us, and we confirm availability, tax and shipping and send an
// invoice. That is said plainly next to the button so nobody expects to pay here. A saved request
// is the Google Ads "Nexus Order Request" conversion.
const NexusOffer = () => {
  const [months, setMonths] = useState(3);
  const [offer, setOffer] = useState(null); // null until a card's button is used: the form stays hidden
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');
  const [timing, setTiming] = useState('');
  const [errors, setErrors] = useState({});
  const [emailFix, setEmailFix] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | preview
  const [sendError, setSendError] = useState(false);
  const startedRef = useRef(false);
  const honeypotRef = useRef(null);
  const formHeadingRef = useRef(null);
  const emailRef = useRef(null);
  const countryRef = useRef(null);
  const doneRef = useRef(null);
  const calcTimerRef = useRef(null);
  const submissionRef = useRef({ key: null, id: null });
  const offerCta = useCtaTracking('nexus_offer');
  const q = quote(months);

  useEffect(() => () => window.clearTimeout(calcTimerRef.current), []);
  useEffect(() => {
    if ((status === 'sent' || status === 'preview') && doneRef.current) doneRef.current.focus();
  }, [status]);

  // The calculator reports the length people settle on (a second after the last change), not
  // every step of the slider.
  const changeMonths = (value) => {
    const next = clampMonths(value);
    setMonths(next);
    window.clearTimeout(calcTimerRef.current);
    calcTimerRef.current = window.setTimeout(() => track('nexus_calculator_used', { months: next, cheaper: quote(next).cheaper }), 1000);
  };

  // Opening the form moves focus to its heading (not into a field), so a phone doesn't pop its
  // keyboard over the summary the visitor is about to read.
  const chooseOffer = (next, source) => {
    const opening = offer === null;
    setOffer(next);
    track('nexus_offer_selected', { offer: next, source, months: next === 'rent' ? months : null });
    if (opening) {
      window.requestAnimationFrame(() => {
        const heading = formHeadingRef.current;
        if (!heading) return;
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track('nexus_order_started', { offer });
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
    const key = [email.trim().toLowerCase(), company.trim(), country.trim(), timing, offer, offer === 'rent' ? months : ''].join('|');
    if (submissionRef.current.key !== key) submissionRef.current = { key, id: newSubmissionId() };

    setStatus('sending');
    const outcome = await postLead(buildOrderPayload({
      email, company, country, timing, offer,
      months: offer === 'rent' ? months : null,
      quote: offer === 'rent'
        ? { monthly: RENT.monthly, total: q.rentTotal, deposit: q.deposit, currency: 'USD' }
        : { price: BUY.price, supportYearly: BUY.supportYearly, currency: 'USD' },
      offerVersion: OFFER_VERSION,
      funnel: getFunnelContext(),
      website: honeypotRef.current ? honeypotRef.current.value : '',
      submissionId: submissionRef.current.id,
    }));
    const googleAdsConversion = outcome.status === 'sent' ? trackGoogleAdsOrderRequestConversion(submissionRef.current.id) : false;
    track('nexus_order_submitted', {
      offer,
      months: offer === 'rent' ? months : null,
      timing: timing || null,
      country: country.trim().slice(0, 80),
      has_company: Boolean(company.trim()),
      delivery: outcome.status, // sent | not_configured | error
      google_ads_conversion: googleAdsConversion,
    });
    if (outcome.status === 'error') {
      setStatus('idle');
      setSendError(true);
      return;
    }
    setStatus(outcome.status === 'sent' ? 'sent' : 'preview');
  };

  const summary = offer === 'rent'
    ? `Rent for ${months_(months)}: ${usd(q.rentTotal)} + ${usd(q.deposit)} refundable deposit`
    : `Buy: ${usd(BUY.price)} one-time`;

  return (
    <section id="pricing" className="design-container nexus-offer" aria-labelledby="nexus-offer-title">
      <div className="section-index"><span>05 / Rent or buy</span><span>Launch price · first {LAUNCH_CUSTOMERS} customers</span></div>
      <div className="offer-head">
        <h2 id="nexus-offer-title" ref={offerCta.ref}>Rent it for a project.<br /><span>Or keep it.</span></h2>
        <p>Full functionality either way. Start with a monthly rental and return it when the project ends, or buy the appliance outright.</p>
      </div>

      <div className="offer-grid">
        <article className="offer-card">
          <p className="technical-label">Rent · monthly</p>
          <div className="offer-price">
            <s aria-label={`Standard price ${usd(RENT.standardMonthly)} per month`}>{usd(RENT.standardMonthly)}</s>
            <strong>{usd(RENT.monthly)}</strong><span>/ month</span>
          </div>
          <ul>
            <li>{RENT.minimumMonths}-month minimum, then month by month. Return it when you're done.</li>
            <li>Refundable deposit: {usd(DEPOSIT.base)}, or {usd(DEPOSIT.over6Months)} for rentals over 6 months, {usd(DEPOSIT.over12Months)} over 12 months.</li>
            <li>Managed appliance with software updates included.</li>
          </ul>
          <button type="button" className="design-button" aria-pressed={offer === 'rent'} onClick={() => chooseOffer('rent', 'card')}>Request a rental ↗</button>
        </article>
        <article className="offer-card">
          <p className="technical-label">Buy · one-time</p>
          <div className="offer-price">
            <s aria-label={`Standard price ${usd(BUY.standardPrice)}`}>{usd(BUY.standardPrice)}</s>
            <strong>{usd(BUY.price)}</strong><span>one-time</span>
          </div>
          <ul>
            <li>Yours to keep, for continuous or long-running benches.</li>
            <li>Optional support plan: {usd(BUY.supportYearly)} / year (SLA and updates).</li>
            <li>Costs less than renting from month {BUY_PAYS_OFF_AFTER_MONTHS}.</li>
          </ul>
          <button type="button" className="design-button secondary" aria-pressed={offer === 'buy'} onClick={() => chooseOffer('buy', 'card')}>Request a purchase ↗</button>
        </article>
      </div>
      <div className="offer-terms">
        Launch price for the first {LAUNCH_CUSTOMERS} customers. Prices in USD, excluding VAT / sales tax and shipping:
        we confirm the exact tax, shipping and any import duties for your country before you pay.
      </div>

      <div className="offer-calc">
        <label htmlFor="offer-months" className="technical-label">How long do you need it?</label>
        <div className="calc-row">
          <button type="button" className="calc-step" aria-label="One month less" onClick={() => changeMonths(months - 1)} disabled={months <= MIN_MONTHS}>−</button>
          <input
            id="offer-months"
            type="range"
            min={MIN_MONTHS}
            max={MAX_MONTHS}
            step={1}
            value={months}
            onChange={(e) => changeMonths(e.target.value)}
            aria-valuetext={months_(months)}
          />
          <button type="button" className="calc-step" aria-label="One month more" onClick={() => changeMonths(months + 1)} disabled={months >= MAX_MONTHS}>+</button>
          <output htmlFor="offer-months" className="calc-months">{months_(months)}</output>
        </div>
        <dl className="calc-result" aria-live="polite">
          <div className={q.cheaper === 'rent' ? 'is-cheaper' : undefined}>
            <dt>Renting</dt>
            <dd><strong>{usd(q.rentTotal)}</strong> <span>+ {usd(q.deposit)} refundable deposit</span></dd>
          </div>
          <div className={q.cheaper === 'buy' ? 'is-cheaper' : undefined}>
            <dt>Buying</dt>
            <dd><strong>{usd(q.buyTotal)}</strong> <span>yours to keep</span></dd>
          </div>
        </dl>
        <div className="calc-note">
          {q.cheaper === 'rent' && `For ${months_(months)}, renting costs less.`}
          {q.cheaper === 'buy' && `For ${months_(months)}, buying costs less.`}
          {q.cheaper === 'same' && `For ${months_(months)}, both cost the same.`}
          {' '}Plus tax and shipping, quoted for your country.
        </div>
      </div>

      {offer && (
        <div className="offer-form-wrap">
          <aside className="offer-steps" aria-label="What happens next">
            <p className="technical-label">What happens next</p>
            <ol>
              {NEXT_STEPS[offer].map(([title, copy], i) => (
                <li key={title}><span>0{i + 1}</span><div><strong>{title}</strong><div>{copy}</div></div></li>
              ))}
            </ol>
          </aside>
          {status === 'sent' || status === 'preview' ? (
            <div className="offer-done" role="status">
              {status === 'sent' ? (
                <>
                  <h3 ref={doneRef} tabIndex={-1}>Request received</h3>
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
                  <h3 ref={doneRef} tabIndex={-1}>Preview only: nothing was sent</h3>
                  <p>The request form isn&apos;t connected in this build.</p>
                </>
              )}
            </div>
          ) : (
            <form className="offer-form" onSubmit={handleSubmit} noValidate>
              <div aria-hidden="true" className="offer-honeypot">
                <label>
                  Leave this field empty
                  <input ref={honeypotRef} type="text" name="hp_extra_field" tabIndex={-1} autoComplete="off" defaultValue="" />
                </label>
              </div>
              <h3 ref={formHeadingRef} tabIndex={-1}>Request {offer === 'rent' ? 'a rental' : 'a purchase'}</h3>
              <div role="radiogroup" aria-label="Rent or buy" className="offer-toggle">
                {['rent', 'buy'].map((value) => (
                  <button key={value} type="button" role="radio" aria-checked={offer === value} onClick={() => offer !== value && chooseOffer(value, 'toggle')}>
                    {OFFER_LABEL[value]}
                  </button>
                ))}
              </div>
              <div className="offer-summary">{summary}{offer === 'rent' && <> · <a href="#offer-months">change length</a></>}</div>

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
                      <button type="button" className="ph-no-capture" onClick={() => { setEmail(emailFix); setEmailFix(null); track('nexus_order_email_fix_accepted'); }}>{emailFix}</button>?
                    </div>
                  ) : null}
                </div>
              )}

              <div className="field-pair">
                <div>
                  <label htmlFor="order-company">Company <span>(optional)</span></label>
                  <input id="order-company" className="ph-no-capture" type="text" autoComplete="organization" value={company} maxLength={120}
                    onChange={(e) => { setCompany(e.target.value); markStarted(); }} />
                </div>
                <div>
                  <label htmlFor="order-country">Country</label>
                  <input
                    id="order-country"
                    ref={countryRef}
                    type="text"
                    autoComplete="country-name"
                    value={country}
                    maxLength={80}
                    onChange={(e) => { setCountry(e.target.value); if (errors.country) setErrors((x) => ({ ...x, country: undefined })); markStarted(); }}
                    aria-invalid={errors.country ? 'true' : undefined}
                    aria-describedby={errors.country ? 'order-country-error' : undefined}
                  />
                  {errors.country && <div id="order-country-error" role="alert" className="field-error">{errors.country}</div>}
                </div>
              </div>

              <label htmlFor="order-timing">When do you need it? <span>(optional)</span></label>
              <select id="order-timing" value={timing} onChange={(e) => { setTiming(e.target.value); markStarted(); }}>
                <option value="">Choose…</option>
                {TIMINGS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>

              {sendError && (
                <div role="alert" className="field-error offer-send-error">
                  We couldn&apos;t send that just now. Please try again, or email{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </div>
              )}

              <button type="submit" className="design-button offer-submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send request ↗'}
              </button>
              {status === 'sending' && <div className="offer-fineprint" role="status">This can take a few seconds.</div>}
              <div className="offer-fineprint">
                No payment now. We reply {REPLY_TIME} with availability, tax, shipping and an invoice, and use your email only
                for that. <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
};

export default NexusOffer;
