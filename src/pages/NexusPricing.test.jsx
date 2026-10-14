import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { posthog } from '../posthog';
import { postLead } from '../utils/leadSubmission';
import { trackGoogleAdsOrderRequestConversion } from '../utils/googleAds';
import NexusPricing from './NexusPricing';

jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));
jest.mock('../utils/googleAds', () => ({ trackGoogleAdsOrderRequestConversion: jest.fn(() => true) }));
jest.mock('../utils/leadSubmission', () => ({ ...jest.requireActual('../utils/leadSubmission'), postLead: jest.fn() }));

global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root;
const render = (url = '/nexus/pricing?from=nexus_pricing_band') => {
  act(() => root.render(
    <HelmetProvider><MemoryRouter initialEntries={[url]}><Routes><Route path="/nexus/pricing" element={<NexusPricing />} /></Routes></MemoryRouter></HelmetProvider>,
  ));
};
beforeEach(() => {
  jest.useFakeTimers();
  posthog.capture.mockClear(); postLead.mockReset();
  trackGoogleAdsOrderRequestConversion.mockReset(); trackGoogleAdsOrderRequestConversion.mockReturnValue(true);
  window.scrollTo = jest.fn();
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); window.sessionStorage.clear(); jest.useRealTimers(); });

const click = (el) => act(() => { el.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
const byText = (text, sel = 'button') => [...container.querySelectorAll(sel)].find((b) => b.textContent.includes(text));
const pick = (text) => { click(byText(text)); act(() => { jest.advanceTimersByTime(300); }); };
const setValue = (sel, value) => act(() => {
  const el = container.querySelector(sel);
  const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
  el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
});
const submit = () => act(async () => { container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
const calls = (event) => posthog.capture.mock.calls.filter(([e]) => e === event).map(([, p]) => p);
const heading = () => container.querySelector('h1, form h2, [role="status"] h2').textContent;

test('step 1 shows both offers with struck standard prices; the entry is tracked with its placement', () => {
  render();
  expect(container.textContent).toContain('Step 1 of 4');
  expect([...container.querySelectorAll('s')].map((s) => s.textContent)).toEqual(['$570', '$6,000']);
  expect(container.textContent).toContain('first 10 customers');
  expect(calls('pricing_viewed')[0]).toMatchObject({ from: 'nexus_pricing_band', entry_offer: null });
  expect(calls('pricing_step_viewed')[0]).toMatchObject({ step: 1, step_name: 'choose' });
});

test('rent: choose, set the length (deposit tier), see the terms, request; every step is tracked', async () => {
  postLead.mockResolvedValue({ status: 'sent' });
  render();
  pick('Rent Nexus');
  expect(container.textContent).toContain('Step 2 of 4');
  expect(heading()).toBe('How long do you need it?');
  setValue('#offer-months', '8');
  expect(container.textContent).toContain('$2,800');
  expect(container.textContent).toContain('$350'); // deposit over 6 months
  act(() => { jest.advanceTimersByTime(1100); });
  expect(calls('pricing_months_set')[0]).toMatchObject({ months: 8 });
  click(byText('Continue'));
  expect(heading()).toBe('What you get');
  expect(container.textContent).toContain('Refundable deposit of $350 for 8 months');
  click(byText('Request this offer'));
  expect(heading()).toBe('Where should we send the offer?');
  setValue('#order-email', 'Eng@Corp.com');
  setValue('#order-company', 'Acme Robotics');
  setValue('#order-country', 'United Kingdom');
  await submit();
  expect(postLead.mock.calls[0][0]).toMatchObject({
    kind: 'order', offer: 'rent', months: 8, country: 'United Kingdom', quote: { monthly: 350, total: 2800, deposit: 350 },
  });
  expect(trackGoogleAdsOrderRequestConversion).toHaveBeenCalledTimes(1);
  expect(container.textContent).toContain('Request received');
  expect(byText('Back')).toBeUndefined();
  expect(calls('pricing_step_completed').map((p) => p.step_name)).toEqual(['choose', 'configure', 'terms']);
  expect(calls('pricing_request_submitted')[0]).toMatchObject({ offer: 'rent', months: 8, delivery: 'sent', google_ads_conversion: true });
  const analytics = JSON.stringify(posthog.capture.mock.calls);
  expect(analytics).not.toContain('Eng@Corp.com');
  expect(analytics).not.toContain('Acme');
});

test('buy: the support plan choice changes the first-year total and travels with the request', async () => {
  postLead.mockResolvedValue({ status: 'sent' });
  render();
  pick('Buy Nexus');
  expect(heading()).toBe('Add the support plan?');
  expect(container.textContent).toContain('$3,500');
  click(byText('Yes, add support'));
  expect(container.textContent).toContain('$3,850');
  expect(calls('pricing_support_chosen')[0]).toEqual(expect.objectContaining({ with_support: true }));
  click(byText('Continue'));
  click(byText('Request this offer'));
  setValue('#order-email', 'eng@corp.com');
  setValue('#order-country', 'Ireland');
  await submit();
  expect(postLead.mock.calls[0][0]).toMatchObject({ offer: 'buy', months: null, quote: { price: 3500, withSupport: true, firstYear: 3850 } });
});

test('a long rental offers a switch to buying; Back goes one step and is tracked', () => {
  render();
  pick('Rent Nexus');
  setValue('#offer-months', '14');
  click(byText('Switch to buying'));
  expect(heading()).toBe('Add the support plan?');
  expect(calls('pricing_offer_switched')[0]).toMatchObject({ from: 'rent', to: 'buy', months: 14 });
  click(byText('Back'));
  expect(container.textContent).toContain('Step 1 of 4');
  expect(calls('pricing_back')[0]).toMatchObject({ from_step: 2, to_step: 1, via: 'button' });
});

test('a reload restores the choices; a deep link past step 1 without an offer starts at step 1', () => {
  render();
  pick('Rent Nexus');
  setValue('#offer-months', '5');
  act(() => root.unmount());
  root = createRoot(container);
  render();
  pick('Rent Nexus');
  expect(container.querySelector('#offer-months').value).toBe('5');
  window.sessionStorage.clear();
  act(() => root.unmount());
  root = createRoot(container);
  act(() => root.render(
    <HelmetProvider><MemoryRouter initialEntries={[{ pathname: '/nexus/pricing', state: { npStep: 3 } }]}><Routes><Route path="/nexus/pricing" element={<NexusPricing />} /></Routes></MemoryRouter></HelmetProvider>,
  ));
  expect(container.textContent).toContain('Step 1 of 4');
});
