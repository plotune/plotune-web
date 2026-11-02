import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { posthog } from '../posthog';
import { clearCart, readCart } from '../utils/bridgeCart';
import BridgeProduct from './BridgeProduct';

jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const Where = () => <p id="where">{useLocation().pathname}</p>;

// A page for people who scan: count the words a visitor can see, leaving out the drawings' own
// labels and the collapsed "Full specifications" fold.
const visibleWords = (root) => {
  const clone = root.cloneNode(true);
  clone.querySelectorAll('svg, details').forEach((n) => n.remove());
  return clone.textContent.split(/\s+/).filter(Boolean).length;
};

let container; let root;
const render = (url) => act(() => root.render(
  <HelmetProvider><MemoryRouter initialEntries={[url]}>
    <Routes>
      <Route path="/bridge" element={<Where />} />
      <Route path="/bridge/:slug" element={<BridgeProduct />} />
      <Route path="/request" element={<Where />} />
    </Routes>
  </MemoryRouter></HelmetProvider>,
));
beforeEach(() => {
  window.localStorage.clear(); clearCart(); posthog.capture.mockClear();
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

test('shows the product with its price and three pictures', () => {
  render('/bridge/daq');
  expect(container.querySelector('h1').textContent).toBe('Capture Real-World Signals with Confidence.');
  expect(container.querySelector('.bridge-price strong').textContent).toBe('$249');
  expect(container.querySelector('.bridge-price').textContent).toMatch(/excl\. tax and shipping/);
  expect(container.textContent).toMatch(/Sampling rate, accuracy, noise performance and isolation are still to be determined/);
  expect(container.textContent).toMatch(/16-bit ADC resolution/);
  expect(container.textContent).not.toMatch(/target price|not final|initial target|\(target\)/i);
  expect(container.querySelectorAll('[aria-roledescription="slide"]')).toHaveLength(3);
  expect(container.textContent).not.toMatch(/early commercial|commercial development|subject to (implementation|validation)/i);
  expect(container.querySelectorAll('.bridge-stats dt')).toHaveLength(3);
  expect(container.querySelectorAll('.bridge-product-grid a')).toHaveLength(3); // the other three
});

test('Request puts the product in the cart once and goes to /request', () => {
  render('/bridge/can');
  const button = [...container.querySelectorAll('button')].find((b) => b.textContent === 'Request Bridge CAN ↗');
  act(() => { button.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  expect(container.querySelector('#where').textContent).toBe('/request');
  expect(readCart()).toEqual([{ id: 'can', qty: 1 }]);
  expect(posthog.capture).toHaveBeenCalledWith('bridge_request_clicked', expect.objectContaining({ product: 'can', placement: 'hero' }));
});

test('a second request does not raise the quantity', () => {
  render('/bridge/can');
  const press = () => act(() => { [...container.querySelectorAll('button')].find((b) => b.textContent === 'Request Bridge CAN ↗').dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  press();
  act(() => root.unmount()); // a later visit: a fresh page and router
  root = createRoot(container);
  render('/bridge/can');
  press();
  expect(readCart()).toEqual([{ id: 'can', qty: 1 }]);
});

test('an unknown product goes back to the Bridge landing page', () => {
  render('/bridge/nope');
  expect(container.querySelector('#where').textContent).toBe('/bridge');
});

test('stays scannable: few visible words, the rest is pictures and diagrams', () => {
  render('/bridge/io');
  const words = visibleWords(container.querySelector('main'));
  expect(words).toBeLessThan(230);
});
