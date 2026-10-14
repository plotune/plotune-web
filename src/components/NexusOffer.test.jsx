import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { posthog } from '../posthog';
import { postLead } from '../utils/leadSubmission';
import { trackGoogleAdsOrderRequestConversion } from '../utils/googleAds';
import NexusOffer from './NexusOffer';

jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));
jest.mock('../utils/googleAds', () => ({ trackGoogleAdsOrderRequestConversion: jest.fn(() => true) }));
jest.mock('../utils/leadSubmission', () => ({ ...jest.requireActual('../utils/leadSubmission'), postLead: jest.fn() }));

global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root;
beforeEach(() => {
  posthog.capture.mockClear(); postLead.mockReset(); trackGoogleAdsOrderRequestConversion.mockReset(); trackGoogleAdsOrderRequestConversion.mockReturnValue(true);
  window.requestAnimationFrame = (cb) => cb();
  Element.prototype.scrollIntoView = jest.fn();
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
  act(() => root.render(<MemoryRouter initialEntries={['/nexus']}><NexusOffer /></MemoryRouter>));
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

const setValue = (sel, value) => act(() => {
  const el = container.querySelector(sel);
  const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
  el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
});
const click = (el) => act(() => { el.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
const button = (text) => [...container.querySelectorAll('button')].find((b) => b.textContent.includes(text));
const submit = () => act(async () => { container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
const events = () => posthog.capture.mock.calls.map(([e]) => e);

test('shows both offers with the standard price struck through, the launch limit and the tax / shipping terms', () => {
  const text = container.textContent;
  expect([...container.querySelectorAll('s')].map((s) => s.textContent)).toEqual(['$570', '$6,000']);
  expect(text).toContain('$350/ month');
  expect(text).toContain('$3,500one-time');
  expect(text).toContain('first 10 customers');
  expect(text).toMatch(/excluding VAT \/ sales tax and shipping/);
  expect(container.querySelector('form')).toBeNull(); // the form only opens from an offer
});

test('the calculator updates totals and the deposit tier', () => {
  setValue('#offer-months', '8');
  expect(container.textContent).toContain('$2,800');
  expect(container.textContent).toContain('+ $350 refundable deposit');
  click(container.querySelector('[aria-label="One month more"]'));
  expect(container.querySelector('#offer-months').value).toBe('9');
  setValue('#offer-months', '14');
  expect(container.textContent).toContain('buying costs less');
  expect(container.textContent).toContain('+ $175 refundable deposit');
});

test('validates email and country without sending', async () => {
  click(button('Request a rental'));
  setValue('#order-email', 'nope');
  await submit();
  expect(container.textContent).toContain('Enter a valid email');
  setValue('#order-email', 'eng@corp.com');
  await submit();
  expect(container.textContent).toContain('Add your country');
  expect(postLead).not.toHaveBeenCalled();
});

test('a saved rental request: order payload with the quote, conversion, confirmation; no email or company in analytics', async () => {
  postLead.mockResolvedValue({ status: 'sent' });
  setValue('#offer-months', '7');
  click(button('Request a rental'));
  expect(events()).toContain('nexus_offer_selected');
  setValue('#order-email', 'Eng@Corp.com');
  setValue('#order-company', 'Acme Robotics');
  setValue('#order-country', 'United Kingdom');
  setValue('#order-timing', 'asap');
  await submit();
  const [payload] = postLead.mock.calls[0];
  expect(payload).toMatchObject({
    kind: 'order', offer: 'rent', months: 7, email: 'Eng@Corp.com', company: 'Acme Robotics', country: 'United Kingdom',
    timing: 'asap', quote: { monthly: 350, total: 2450, deposit: 350, currency: 'USD' }, website: '',
  });
  expect(payload.submissionId).toBeTruthy();
  expect(trackGoogleAdsOrderRequestConversion).toHaveBeenCalledWith(payload.submissionId);
  expect(container.textContent).toContain('Request received');
  expect(container.textContent).toContain('Nothing is charged until you approve it');
  const submitted = posthog.capture.mock.calls.find(([e]) => e === 'nexus_order_submitted')[1];
  expect(submitted).toMatchObject({ offer: 'rent', months: 7, country: 'United Kingdom', has_company: true, delivery: 'sent', google_ads_conversion: true });
  const analytics = JSON.stringify(posthog.capture.mock.calls);
  expect(analytics).not.toContain('Eng@Corp.com');
  expect(analytics).not.toContain('Acme');
});

test('a purchase request carries no months; a failed send fires no conversion and the retry reuses the id', async () => {
  postLead.mockResolvedValueOnce({ status: 'error' }).mockResolvedValueOnce({ status: 'sent' });
  click(button('Request a purchase'));
  setValue('#order-email', 'eng@corp.com');
  setValue('#order-country', 'Ireland');
  await submit();
  expect(container.textContent).toContain("couldn't send that");
  expect(trackGoogleAdsOrderRequestConversion).not.toHaveBeenCalled();
  await submit();
  const [first, second] = postLead.mock.calls.map(([p]) => p);
  expect(first).toMatchObject({ offer: 'buy', months: null, quote: { price: 3500, supportYearly: 350 } });
  expect(second.submissionId).toBe(first.submissionId);
  expect(trackGoogleAdsOrderRequestConversion).toHaveBeenCalledTimes(1);
});
