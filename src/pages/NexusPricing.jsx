import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Seo from '../components/Seo';
import OrderRequestForm from '../components/OrderRequestForm';
import { posthog } from '../posthog';
import { getFunnelContext } from '../utils/funnel';
import {
  BUY, BUY_PAYS_OFF_AFTER_MONTHS, DEPOSIT, LAUNCH_CUSTOMERS, MAX_MONTHS, MIN_MONTHS, OFFER_VERSION, RENT,
  buyQuote, clampMonths, quote, usd,
} from '../utils/nexusOffer';

// /nexus/pricing: the Nexus offer as four short steps, so the funnel shows exactly where people
// stop -- 1 rent or buy (the first time prices are shown), 2 rental length / support plan with
// live totals, 3 what's included and the terms, 4 the request form.
//
// Like the AI readiness assessment, the step lives in react-router *history state*: the phone's
// Back gesture goes one step back, and the URL (with its attribution) never changes mid-flow.
// The choices are kept in sessionStorage so a reload (common on phones) restores them; a step the
// visitor hasn't reached yet (no offer chosen) is clamped back to step 1.
//
// Entry: /nexus links here with ?from=<placement>. An optional ?offer=rent|buy pre-selects an
// offer (for a future ad or link); the page still starts at step 1 so every visitor sees both.

const STEPS = { choose: 1, configure: 2, terms: 3, request: 4 };
const STEP_NAMES = ['', 'choose', 'configure', 'terms', 'request'];
const LAST_STEP = STEPS.request;
const AUTO_ADVANCE_MS = 220;
const STORAGE_KEY = 'plotune_nexus_pricing_v1';
const OFFERS = ['rent', 'buy'];

const months_ = (n) => `${n} month${n === 1 ? '' : 's'}`;

const loadChoices = () => {
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || 'null');
    if (!raw || typeof raw !== 'object') return null;
    return {
      offer: OFFERS.includes(raw.offer) ? raw.offer : null,
      months: clampMonths(raw.months || 3),
      withSupport: Boolean(raw.withSupport),
    };
  } catch {
    return null;
  }
};

const saveChoices = (choices) => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(choices));
  } catch {
    // storage blocked: the page works the same, a reload just starts over
  }
};

// Analytics: steps, choices and outcomes only (never the email address).
const track = (event, properties = {}) => {
  posthog.capture(event, { ...getFunnelContext(), path: '/nexus/pricing', offer_version: OFFER_VERSION, ...properties });
};

const NexusPricing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [restored] = useState(loadChoices);
  const params = new URLSearchParams(location.search);
  const entryOffer = OFFERS.includes(params.get('offer')) ? params.get('offer') : null;
  const [offer, setOffer] = useState(() => (restored && restored.offer) || entryOffer);
  const [months, setMonths] = useState(() => (restored ? restored.months : 3));
  const [withSupport, setWithSupport] = useState(() => (restored ? restored.withSupport : false));
  const [requestDone, setRequestDone] = useState(false); // after a request: no Back into an emptied form

  const requested = Number.isInteger(location.state?.npStep) ? location.state.npStep : STEPS.choose;
  const step = offer ? Math.min(Math.max(requested, STEPS.choose), LAST_STEP) : STEPS.choose;

  const headingRef = useRef(null);
  const formHeadingRef = useRef(null);
  const timerRef = useRef(null);
  const monthsTimerRef = useRef(null);
  const stepEnteredAtRef = useRef(Date.now());
  const prevStepRef = useRef(step);
  const backByButtonRef = useRef(false);
  const advancedFromRef = useRef(null);
  const viewedRef = useRef(false);

  const goTo = useCallback((next, { replace = false } = {}) => {
    navigate(`${location.pathname}${location.search}`, { state: { npStep: next }, replace });
  }, [navigate, location.pathname, location.search]);

  useEffect(() => {
    if (requested !== step) goTo(step, { replace: true });
  }, [requested, step, goTo]);

  useEffect(() => { saveChoices({ offer, months, withSupport }); }, [offer, months, withSupport]);

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    let referrerPath = null;
    try { referrerPath = document.referrer ? new URL(document.referrer).pathname : null; } catch { /* ignore */ }
    track('pricing_viewed', { from: params.get('from') || null, entry_offer: entryOffer, restored: Boolean(restored && restored.offer), referrer_path: referrerPath });
  }, []);

  // New step: top of the page, focus on the heading (no keyboard pop-up on phones), step timer.
  useEffect(() => {
    if (step !== STEPS.request) setRequestDone(false); // left the sent form (e.g. phone Back): a new request is possible
    window.clearTimeout(timerRef.current);
    stepEnteredAtRef.current = Date.now();
    advancedFromRef.current = null;
    window.scrollTo(0, 0);
    const heading = step === STEPS.request ? formHeadingRef.current : headingRef.current;
    if (heading) heading.focus({ preventScroll: true });
    if (step < prevStepRef.current && !backByButtonRef.current) {
      track('pricing_back', { from_step: prevStepRef.current, to_step: step, via: 'browser', offer });
    }
    backByButtonRef.current = false;
    prevStepRef.current = step;
    track('pricing_step_viewed', { step, step_name: STEP_NAMES[step], offer });
  }, [step]);

  useEffect(() => () => { window.clearTimeout(timerRef.current); window.clearTimeout(monthsTimerRef.current); }, []);

  const advance = (fromStep, extra = {}) => {
    // A double tap must not record a second completion or push a second history entry.
    if (advancedFromRef.current === fromStep) return;
    advancedFromRef.current = fromStep;
    track('pricing_step_completed', {
      step: fromStep,
      step_name: STEP_NAMES[fromStep],
      offer: extra.offer || offer,
      seconds_on_step: Math.round((Date.now() - stepEnteredAtRef.current) / 100) / 10,
    });
    goTo(fromStep + 1);
  };

  const chooseOffer = (next) => {
    track('pricing_offer_chosen', { offer: next, previous_offer: offer, entry_offer: entryOffer });
    setOffer(next);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => advance(STEPS.choose, { offer: next }), AUTO_ADVANCE_MS);
  };

  const changeMonths = (value) => {
    const next = clampMonths(value);
    setMonths(next);
    window.clearTimeout(monthsTimerRef.current);
    monthsTimerRef.current = window.setTimeout(() => track('pricing_months_set', { months: next, cheaper: quote(next).cheaper }), 1000);
  };

  const chooseSupport = (value) => {
    setWithSupport(value);
    track('pricing_support_chosen', { with_support: value });
  };

  const handleBack = () => {
    window.clearTimeout(timerRef.current);
    backByButtonRef.current = true;
    track('pricing_back', { from_step: step, to_step: step - 1, via: 'button', offer });
    if (window.history.state && window.history.state.idx > 0 && window.history.state.usr?.npStep === step) {
      navigate(-1);
    } else {
      goTo(step - 1, { replace: true });
    }
  };

  const rq = quote(months);
  const bq = buyQuote(withSupport);
  const summary = offer === 'rent'
    ? `Rent for ${months_(months)}: ${usd(rq.rentTotal)} + ${usd(rq.deposit)} refundable deposit`
    : `Buy: ${usd(BUY.price)} one-time${withSupport ? ` + support plan ${usd(BUY.supportYearly)} / year` : ''}`;
  const requestQuote = offer === 'rent'
    ? { monthly: RENT.monthly, total: rq.rentTotal, deposit: rq.deposit, currency: 'USD' }
    : { price: BUY.price, supportYearly: BUY.supportYearly, withSupport, firstYear: bq.firstYear, currency: 'USD' };

  const stepTitle = ['', 'Choose', offer === 'buy' ? 'Support' : 'Length', 'Included', 'Your details'];

  // The order summary (desktop: a sticky card beside the step; phones: the chip above it).
  const summaryCard = (
    <aside className="pricing-summary" aria-label="Your selection">
      <figure>
        <img src="/assets/plotune-nexus.webp" width="1088" height="725" alt="Plotune Nexus appliance" />
      </figure>
      <p className="technical-label">Plotune Nexus · {offer === 'rent' ? 'Rental' : 'Purchase'}</p>
      <dl>
        {offer === 'rent' ? (
          <>
            <div><dt>{usd(RENT.monthly)} × {months_(months)}</dt><dd>{usd(rq.rentTotal)}</dd></div>
            <div><dt>Refundable deposit</dt><dd>{usd(rq.deposit)}</dd></div>
          </>
        ) : (
          <>
            <div><dt>Nexus appliance</dt><dd>{usd(BUY.price)}</dd></div>
            <div><dt>Support plan</dt><dd>{withSupport ? `${usd(BUY.supportYearly)} / yr` : '—'}</dd></div>
          </>
        )}
        <div className="summary-muted"><dt>Tax &amp; shipping</dt><dd>Quoted for your country</dd></div>
      </dl>
      <div className="summary-note">Launch price for the first {LAUNCH_CUSTOMERS} customers.</div>
    </aside>
  );

  return (
    <main className="nexus-design pricing-page">
      <Seo
        title="Plotune Nexus Pricing: Rent or Buy"
        description={`Rent Plotune Nexus from ${usd(RENT.monthly)} a month or buy it for ${usd(BUY.price)}. Launch prices for the first ${LAUNCH_CUSTOMERS} customers; tax and shipping quoted for your country.`}
        path="/nexus/pricing"
      />
      <div className="design-container pricing-shell">
        <div className="section-index">
          <span><Link to="/nexus">Plotune Nexus</Link> / Pricing</span>
          <span>Step {step} of {LAST_STEP} · {stepTitle[step]}</span>
        </div>
        <div className="pricing-progress" aria-hidden="true"><span style={{ width: `${(step / LAST_STEP) * 100}%` }} /></div>

        {step > STEPS.choose && !(requestDone && step === STEPS.request) && (
          <div className="pricing-topbar">
            <button type="button" className="pricing-back" onClick={handleBack}>← Back</button>
            <span className="pricing-chip">{summary}</span>
          </div>
        )}

        {step === STEPS.choose && (
          <section className="pricing-step pricing-intro" aria-labelledby="pricing-h">
            <div className="pricing-intro-copy">
              <p className="technical-label">Launch price · first {LAUNCH_CUSTOMERS} customers</p>
              <h1 id="pricing-h" ref={headingRef} tabIndex={-1}>Rent it for a project,<br /><span>or keep it.</span></h1>
              <p className="pricing-lede">The same appliance and full functionality either way. Pick one to see the costs; you can switch later.</p>
            </div>
            <figure className="pricing-hero-image">
              <img src="/assets/plotune-nexus.webp" width="1088" height="725" alt="Plotune Nexus appliance with a finned enclosure and physical connectors" />
            </figure>
            <div className="pricing-choices" role="radiogroup" aria-label="Rent or buy">
              <button type="button" role="radio" aria-checked={offer === 'rent'} className="pricing-choice" onClick={() => chooseOffer('rent')}>
                <span className="technical-label">Rent · monthly</span>
                <span className="offer-price">
                  <s aria-label={`Standard price ${usd(RENT.standardMonthly)} per month`}>{usd(RENT.standardMonthly)}</s>
                  <strong>{usd(RENT.monthly)}</strong><span>/ month</span>
                </span>
                <span className="pricing-choice-copy">For a project or an evaluation. {RENT.minimumMonths}-month minimum, return it when you&apos;re done.</span>
                <span className="pricing-choice-cta">Rent Nexus →</span>
              </button>
              <button type="button" role="radio" aria-checked={offer === 'buy'} className="pricing-choice" onClick={() => chooseOffer('buy')}>
                <span className="technical-label">Buy · one-time</span>
                <span className="offer-price">
                  <s aria-label={`Standard price ${usd(BUY.standardPrice)}`}>{usd(BUY.standardPrice)}</s>
                  <strong>{usd(BUY.price)}</strong><span>one-time</span>
                </span>
                <span className="pricing-choice-copy">For a bench that runs for good. Costs less than renting from month {BUY_PAYS_OFF_AFTER_MONTHS}.</span>
                <span className="pricing-choice-cta">Buy Nexus →</span>
              </button>
            </div>
            <div className="offer-terms">
              Prices in USD, excluding VAT / sales tax and shipping: the exact tax, shipping and any import duties for your
              country are confirmed before you pay.
            </div>
          </section>
        )}

        {step > STEPS.choose && (
          <div className={`pricing-body${step === STEPS.request ? ' is-request' : ''}`}>
            <div className="pricing-main">
              {step === STEPS.configure && offer === 'rent' && (
                <section className="pricing-step" aria-labelledby="pricing-h">
                  <h1 id="pricing-h" ref={headingRef} tabIndex={-1}>How long do you need it?</h1>
                  <div className="offer-calc">
                    <label htmlFor="offer-months" className="technical-label">Rental length</label>
                    <div className="calc-row">
                      <button type="button" className="calc-step" aria-label="One month less" onClick={() => changeMonths(months - 1)} disabled={months <= MIN_MONTHS}>−</button>
                      <input id="offer-months" type="range" min={MIN_MONTHS} max={MAX_MONTHS} step={1} value={months}
                        onChange={(e) => changeMonths(e.target.value)} aria-valuetext={months_(months)} />
                      <button type="button" className="calc-step" aria-label="One month more" onClick={() => changeMonths(months + 1)} disabled={months >= MAX_MONTHS}>+</button>
                      <output htmlFor="offer-months" className="calc-months">{months_(months)}</output>
                    </div>
                    <dl className="calc-result" aria-live="polite">
                      <div className="is-cheaper">
                        <dt>Rental, {months_(months)}</dt>
                        <dd><strong>{usd(rq.rentTotal)}</strong> <span>{usd(RENT.monthly)} × {months}</span></dd>
                      </div>
                      <div>
                        <dt>Refundable deposit</dt>
                        <dd><strong>{usd(rq.deposit)}</strong> <span>back when Nexus is returned</span></dd>
                      </div>
                    </dl>
                    <ol className="deposit-tiers" aria-label="Deposit by rental length">
                      {[[1, 6, DEPOSIT.base], [7, 12, DEPOSIT.over6Months], [13, MAX_MONTHS, DEPOSIT.over12Months]].map(([from, to, amount]) => (
                        <li key={from} className={months >= from && months <= to ? 'is-current' : undefined}>
                          <span>{from === 13 ? 'Over 12 months' : from === 7 ? '7–12 months' : 'Up to 6 months'}</span>
                          <strong>{usd(amount)}</strong>
                        </li>
                      ))}
                    </ol>
                    {rq.cheaper === 'buy' && (
                      <div className="calc-switch">
                        For {months_(months)}, buying ({usd(BUY.price)}) costs less.{' '}
                        <button type="button" className="inline-link" onClick={() => { track('pricing_offer_switched', { from: 'rent', to: 'buy', months }); setOffer('buy'); }}>Switch to buying</button>
                      </div>
                    )}
                  </div>
                  <div className="pricing-actions">
                    <button type="button" className="design-button" onClick={() => advance(STEPS.configure)}>Continue ↗</button>
                  </div>
                </section>
              )}

              {step === STEPS.configure && offer === 'buy' && (
                <section className="pricing-step" aria-labelledby="pricing-h">
                  <h1 id="pricing-h" ref={headingRef} tabIndex={-1}>Add the support plan?</h1>
                  <p className="pricing-lede">Optional. You can also add it later.</p>
                  <div className="pricing-options" role="radiogroup" aria-label="Support plan">
                    <button type="button" role="radio" aria-checked={withSupport} className="pricing-option" onClick={() => chooseSupport(true)}>
                      <strong>Add support · {usd(BUY.supportYearly)} / year</strong>
                      <span>SLA support and software updates.</span>
                    </button>
                    <button type="button" role="radio" aria-checked={!withSupport} className="pricing-option" onClick={() => chooseSupport(false)}>
                      <strong>Not now</strong>
                      <span>Just the appliance.</span>
                    </button>
                  </div>
                  <dl className="calc-result" aria-live="polite">
                    <div className="is-cheaper">
                      <dt>First year</dt>
                      <dd><strong>{usd(bq.firstYear)}</strong> <span>{usd(BUY.price)}{withSupport ? ` + ${usd(BUY.supportYearly)} support` : ' one-time'}</span></dd>
                    </div>
                    <div>
                      <dt>Renting instead</dt>
                      <dd><strong>{usd(RENT.monthly)}</strong> <span>/ month, costs more from month {BUY_PAYS_OFF_AFTER_MONTHS}</span></dd>
                    </div>
                  </dl>
                  <div className="pricing-actions">
                    <button type="button" className="design-button" onClick={() => advance(STEPS.configure)}>Continue ↗</button>
                  </div>
                </section>
              )}

              {step === STEPS.terms && (
                <section className="pricing-step" aria-labelledby="pricing-h">
                  <h1 id="pricing-h" ref={headingRef} tabIndex={-1}>What you get</h1>
                  {/* Phones: the summary card (with the image) is hidden, so the product is shown here. */}
                  <figure className="included-figure"><img src="/assets/plotune-nexus.webp" width="1088" height="725" loading="lazy" alt="Plotune Nexus appliance" /></figure>
                  <div className="included-grid">
                    <div className="included-item"><span>01</span><strong>The appliance</strong><p>Nexus with its software pre-installed, ready to connect to your bench.</p></div>
                    <div className="included-item"><span>02</span><strong>Agent access</strong><p>MCP access to CAN, UART, XCP, UDS / DoIP and ROS 2 / DDS. <Link to="/docs/nexus/hardware-compatibility">Compatibility ↗</Link></p></div>
                    <div className="included-item"><span>03</span><strong>Setup guide</strong><p>Documentation to get from unboxing to the first test.</p></div>
                    <div className="included-item"><span>04</span><strong>Updates</strong><p>{offer === 'rent' ? 'Software updates for the whole rental.' : withSupport ? 'SLA support and software updates for a year.' : 'Add the support plan any time for SLA support and updates.'}</p></div>
                  </div>
                  <div className="terms-box">
                    <p className="technical-label">Terms</p>
                    <ul className="pricing-list">
                      {offer === 'rent' ? (
                        <>
                          <li>{RENT.minimumMonths}-month minimum, then month by month. Return it when the project ends.</li>
                          <li>Refundable deposit of {usd(rq.deposit)} for {months_(months)}, returned after the return check.</li>
                        </>
                      ) : (
                        <li>One-time payment; the appliance is yours.</li>
                      )}
                      <li>Tax, shipping and any import duties are confirmed for your country before you pay.</li>
                      <li>You approve an invoice before anything is charged.</li>
                    </ul>
                  </div>
                  <div className="pricing-actions">
                    <button type="button" className="design-button" onClick={() => advance(STEPS.terms)}>Request this offer ↗</button>
                  </div>
                </section>
              )}

              {step === STEPS.request && (
                <section className="pricing-step">
                  <OrderRequestForm offer={offer} months={months} quote={requestQuote} summary={summary} track={track} headingRef={formHeadingRef} onDone={() => setRequestDone(true)} />
                </section>
              )}
            </div>

            <div className="pricing-side">
              {summaryCard}
              {step === STEPS.request && (
                <div className="offer-steps" aria-label="What happens next">
                  <p className="technical-label">What happens next</p>
                  <ol>
                    <li><span>01</span><div><strong>We confirm the details</strong><div>Availability, tax, shipping and any import duties for your country.</div></div></li>
                    <li><span>02</span><div><strong>You approve the invoice</strong><div>{offer === 'rent' ? 'First month and the refundable deposit. ' : ''}Nothing is charged before you approve.</div></div></li>
                    <li><span>03</span><div><strong>We ship Nexus ready to connect</strong><div>{offer === 'rent' ? 'Return it when the project ends; the deposit comes back after the return check.' : 'Yours to keep, with the setup guide.'}</div></div></li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pricing-help">
          Questions first? <Link to="/contact" onClick={() => track('pricing_contact_clicked', { step, offer })}>Talk to us</Link>
        </div>
      </div>
    </main>
  );
};

export default NexusPricing;
