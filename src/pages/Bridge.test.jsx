import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { posthog } from '../posthog';
import Bridge from './Bridge';

jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;


// A page for people who scan: count the words a visitor can see, leaving out the drawings' own
// labels and the collapsed "Full specifications" fold.
const visibleWords = (root) => {
  const clone = root.cloneNode(true);
  clone.querySelectorAll('svg, details').forEach((n) => n.remove());
  return clone.textContent.split(/\s+/).filter(Boolean).length;
};

let container; let root;
beforeEach(() => {
  posthog.capture.mockClear();
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
  act(() => root.render(<HelmetProvider><MemoryRouter initialEntries={['/bridge']}><Bridge /></MemoryRouter></HelmetProvider>));
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

test('one h1, a carousel of the four products and a product grid that leads to each product page', () => {
  expect(container.querySelectorAll('h1')).toHaveLength(1);
  const carousel = container.querySelector('[aria-roledescription="carousel"]');
  expect(carousel.querySelectorAll('[aria-roledescription="slide"]')).toHaveLength(4);
  const gridLinks = [...container.querySelectorAll('.bridge-product-grid a')].map((a) => a.getAttribute('href').split('?')[0]);
  expect(gridLinks).toEqual(['/bridge/can', '/bridge/serial', '/bridge/daq', '/bridge/io']);
});

test('the page stays product-level: no V1 wording and no raw spec dump', () => {
  const text = container.textContent;
  expect(text).not.toMatch(/\bV1\b/);
  expect(text).not.toMatch(/Classical CAN channels|RS-232|±10 V/); // spec detail lives on product pages
  expect(text).not.toMatch(/early commercial|commercial development|subject to (implementation|validation)/i);
  expect(text).toContain('One connected workflow.');
  expect(text).toContain('$199');
  expect(text).not.toMatch(/target price|not final|initial target/i);
});

test('product clicks and carousel moves are tracked with their placement', () => {
  act(() => { container.querySelector('.bridge-product-grid a').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); });
  expect(posthog.capture).toHaveBeenCalledWith('bridge_product_clicked', expect.objectContaining({ product: 'can', placement: 'grid' }));
  act(() => { container.querySelector('[aria-label="Next slide"]').dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  expect(posthog.capture).toHaveBeenCalledWith('bridge_carousel_slide', expect.objectContaining({ slide: 'serial', placement: 'hero' }));
  expect(container.querySelector('[aria-label="Previous slide"]').disabled).toBe(false);
});

test('stays scannable: few visible words, the rest is pictures and diagrams', () => {
  
  const words = visibleWords(container.querySelector('main'));
  expect(words).toBeLessThan(210);
});
