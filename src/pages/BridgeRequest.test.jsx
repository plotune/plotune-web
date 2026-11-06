import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { posthog } from '../posthog';
import { getEndpointKinds, postLead } from '../utils/leadSubmission';
import { addItem, clearCart, readCart } from '../utils/bridgeCart';
import BridgeRequest from './BridgeRequest';
import { PRODUCTS } from '../content/bridgeCatalog';
import { trackGoogleAdsOrderRequestConversion } from '../utils/googleAds';

jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));
jest.mock('../utils/googleAds', () => ({ trackGoogleAdsOrderRequestConversion: jest.fn() }));
jest.mock('../utils/leadSubmission', () => ({ ...jest.requireActual('../utils/leadSubmission'), postLead: jest.fn(), getEndpointKinds: jest.fn() }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root;
const render = () => act(() => root.render(<HelmetProvider><MemoryRouter initialEntries={['/request']}><BridgeRequest /></MemoryRouter></HelmetProvider>));
beforeEach(() => {
  window.localStorage.clear(); clearCart(); posthog.capture.mockClear(); postLead.mockReset();
  trackGoogleAdsOrderRequestConversion.mockReset(); trackGoogleAdsOrderRequestConversion.mockReturnValue(true);
  getEndpointKinds.mockReset(); getEndpointKinds.mockResolvedValue(['assessment', 'contact', 'order', 'cart']);
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

const type = (sel, value) => act(() => {
  const el = container.querySelector(sel);
  const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
  el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
});
const click = (el) => act(() => { el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); });
const submit = () => act(async () => { container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
const fillValid = () => { type('#cart-email', 'ada@example.com'); type('#cart-country', 'Germany'); click(container.querySelector('#cart-consent')); };

test('an empty request points back to the products', () => {
  render();
  expect(container.querySelector('h1').textContent).toBe('Your request is empty.');
  expect(container.querySelector('form')).toBeNull();
  expect([...container.querySelectorAll('.bridge-chips a')].map((a) => a.getAttribute('href').split('?')[0])).toEqual(['/bridge/can', '/bridge/serial', '/bridge/daq', '/bridge/io']);
});

test('lists the cart with target prices, changes quantity (the total follows), removes a line', () => {
  addItem('can'); addItem('daq');
  render();
  expect(container.querySelectorAll('.bridge-lines li')).toHaveLength(2);
  expect(container.querySelector('.bridge-total strong').textContent).toBe('$448'); // 199 + 249
  expect(container.querySelector('.offer-terms').textContent).toMatch(/excluding VAT.*exact amounts/);
  expect(container.textContent).not.toMatch(/target|not final/i);
  click(container.querySelector('[aria-label="Increase quantity of Bridge CAN"]'));
  expect(readCart().find((l) => l.id === 'can').qty).toBe(2);
  expect(container.querySelector('.bridge-total strong').textContent).toBe('$647'); // 2 × 199 + 249
  expect(container.querySelector('.bridge-line-price small').textContent).toBe('$199 each');
  expect(container.querySelector('[aria-label="Decrease quantity of Bridge DAQ"]').disabled).toBe(true);
  click(container.querySelector('[aria-label="Remove Bridge DAQ"]'));
  expect(container.querySelectorAll('.bridge-lines li')).toHaveLength(1);
});

test('a line without a price makes the whole request "To be quoted"', () => {
  const daq = PRODUCTS.find((p) => p.id === 'daq');
  const price = daq.price;
  daq.price = null;
  try {
    addItem('can'); addItem('daq');
    render();
    expect(container.querySelector('.bridge-total strong').textContent).toBe('To be quoted');
  } finally { daq.price = price; }
});

test('does not send an incomplete form', async () => {
  addItem('can');
  render();
  await submit();
  expect(postLead).not.toHaveBeenCalled();
  expect(container.querySelector('#cart-email-error')).toBeTruthy();
  type('#cart-email', 'ada@example.com');
  await submit();
  expect(container.querySelector('#cart-country-error')).toBeTruthy();
});

test('a valid request posts the cart, confirms, clears the cart and never tracks the address', async () => {
  addItem('can', 2); addItem('io');
  postLead.mockResolvedValue({ status: 'sent' });
  render();
  fillValid();
  type('#cart-sector', 'automotive');
  await submit();
  expect(postLead).toHaveBeenCalledTimes(1);
  const payload = postLead.mock.calls[0][0];
  expect(payload).toMatchObject({
    kind: 'cart', email: 'ada@example.com', country: 'Germany', sector: 'automotive',
    items: [{ id: 'can', qty: 2 }, { id: 'io', qty: 1 }], quote: { currency: 'USD', total: 657 }, // 2 × 199 + 259
  });
  expect(payload.catalogVersion).toBeTruthy();
  expect(payload.submissionId).toBeTruthy();
  expect(container.querySelector('h1').textContent).toBe('Request received');
  expect(container.textContent).toContain('2 × Bridge CAN, 1 × Bridge I/O');
  expect(readCart()).toEqual([]);
  const tracked = JSON.stringify(posthog.capture.mock.calls);
  expect(tracked).not.toContain('ada@example.com');
  expect(posthog.capture).toHaveBeenCalledWith('bridge_request_submitted', expect.objectContaining({ lines: 2, units: 3, products: 'can,io', priced: true, delivery: 'sent', google_ads_conversion: true }));
  // Counted as the "Nexus Order Request" Google Ads action, de-duplicated by the submission id.
  expect(trackGoogleAdsOrderRequestConversion).toHaveBeenCalledTimes(1);
  expect(trackGoogleAdsOrderRequestConversion).toHaveBeenCalledWith(payload.submissionId);
});

test('a failed send keeps the cart and offers a retry with the same submission id', async () => {
  addItem('serial');
  postLead.mockResolvedValueOnce({ status: 'error' }).mockResolvedValueOnce({ status: 'sent' });
  render();
  fillValid();
  await submit();
  expect(container.querySelector('.offer-send-error')).toBeTruthy();
  expect(readCart()).toHaveLength(1);
  await submit();
  expect(postLead.mock.calls[1][0].submissionId).toBe(postLead.mock.calls[0][0].submissionId);
  expect(container.querySelector('h1').textContent).toBe('Request received');
});

test('a filled honeypot is discarded without a conversion-like signal', async () => {
  addItem('can');
  postLead.mockResolvedValue({ status: 'sent' });
  render();
  fillValid();
  type('input[name="hp_extra_field"]', 'spam');
  await submit();
  expect(posthog.capture).toHaveBeenCalledWith('bridge_request_submitted', expect.objectContaining({ delivery: 'ignored' }));
  expect(trackGoogleAdsOrderRequestConversion).not.toHaveBeenCalled();
});

test('preview builds (no endpoint) say nothing was sent and keep the cart', async () => {
  addItem('can');
  postLead.mockResolvedValue({ status: 'not_configured' });
  render();
  fillValid();
  await submit();
  expect(container.querySelector('h1').textContent).toBe('Preview only: nothing was sent');
  expect(readCart()).toHaveLength(1);
  expect(trackGoogleAdsOrderRequestConversion).not.toHaveBeenCalled();
});

test('while the deployed script predates cart requests, the same request goes through the contact path (never filed as something else)', async () => {
  getEndpointKinds.mockResolvedValue(['assessment', 'contact', 'order']); // what the live script reports today
  addItem('can', 2); addItem('io');
  postLead.mockResolvedValue({ status: 'sent' });
  render();
  fillValid();
  type('#cart-sector', 'automotive');
  await submit();
  const payload = postLead.mock.calls[0][0];
  expect(payload.kind).toBe('contact');
  expect(payload.topic).toBe('Bridge request');
  expect(payload.items).toBeUndefined();
  expect(payload.message).toContain('2 × Bridge CAN; 1 × Bridge I/O');
  expect(payload.message).toContain('Estimated total: $657 USD (excl. tax and shipping)');
  expect(payload.message).toContain('Delivery country: Germany');
  expect(payload.message).toContain('Sector: automotive');
  expect(payload.email).toBe('ada@example.com');
  expect(payload.submissionId).toBeTruthy();
  expect(container.querySelector('h1').textContent).toBe('Request received'); // same confirmation for the visitor
  expect(posthog.capture).toHaveBeenCalledWith('bridge_request_submitted', expect.objectContaining({ route: 'contact_fallback', delivery: 'sent' }));
});

test('an unknown answer (offline, slow, no reply) also takes the safe contact path', async () => {
  getEndpointKinds.mockResolvedValue([]);
  addItem('daq');
  postLead.mockResolvedValue({ status: 'sent' });
  render(); fillValid(); await submit();
  expect(postLead.mock.calls[0][0].kind).toBe('contact');
});

test('once the script supports it, the structured cart request is used', async () => {
  addItem('serial');
  postLead.mockResolvedValue({ status: 'sent' });
  render(); fillValid(); await submit();
  expect(postLead.mock.calls[0][0].kind).toBe('cart');
  expect(posthog.capture).toHaveBeenCalledWith('bridge_request_submitted', expect.objectContaining({ route: 'cart' }));
});

test('a to-be-quoted request says so in the contact message', async () => {
  getEndpointKinds.mockResolvedValue(['contact']);
  const serial = PRODUCTS.find((p) => p.id === 'serial'); const price = serial.price; serial.price = null;
  try {
    addItem('serial'); postLead.mockResolvedValue({ status: 'sent' });
    render(); fillValid(); await submit();
    expect(postLead.mock.calls[0][0].message).toContain('Estimated total: to be quoted');
  } finally { serial.price = price; }
});

test('the country must be one from the suggestions; an alias is sent as the proper name', async () => {
  addItem('can');
  postLead.mockResolvedValue({ status: 'sent' });
  render();
  type('#cart-email', 'ada@example.com');
  type('#cart-country', 'Recep200789'); // what iPhone autofill put in this field once
  click(container.querySelector('#cart-consent'));
  await submit();
  expect(postLead).not.toHaveBeenCalled();
  expect(container.querySelector('#cart-country-error').textContent).toMatch(/Pick your country/);
  type('#cart-country', 'uk');
  await submit();
  expect(postLead.mock.calls[0][0].country).toBe('United Kingdom');
});
