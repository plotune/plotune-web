import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './Home';

global.IS_REACT_ACT_ENVIRONMENT = true;

// Home is for people who scan: count the words a visitor can see, leaving out drawings' own labels.
const visibleWords = (root) => {
  const clone = root.cloneNode(true);
  clone.querySelectorAll('svg').forEach((n) => n.remove());
  return clone.textContent.split(/\s+/).filter(Boolean).length;
};

let container; let root;
beforeEach(() => {
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
  act(() => root.render(<HelmetProvider><MemoryRouter><Home /></MemoryRouter></HelmetProvider>));
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

const path = (a) => a.getAttribute('href').split('?')[0];

test('one h1 tells the platform story, with a product chooser and a way to talk to us', () => {
  expect(container.querySelectorAll('h1')).toHaveLength(1);
  expect(container.querySelector('h1').textContent).toContain('From the physical world.');
  const actions = [...container.querySelectorAll('.lx-hero .lx-actions a')];
  expect(actions.map((a) => a.textContent)).toEqual(['Choose your product', 'Talk to us']);
  expect(actions[0].getAttribute('href')).toBe('#products');
  expect(path(actions[1])).toBe('/contact');
  expect(container.querySelector('#products')).not.toBeNull();
});

test('the system panel shows the four Bridge devices, Nexus and a Stream event window, without prices', () => {
  const panel = container.querySelector('.lx-system');
  expect(panel.querySelectorAll('.lx-dev')).toHaveLength(4);
  expect(panel.textContent).toContain('Plotune Nexus');
  expect(panel.textContent).toContain('test.completed');
  expect(panel.querySelectorAll('.lx-wire')).toHaveLength(2);
  expect(panel.querySelectorAll('h1, h2, h3, h4, h5, h6')).toHaveLength(0); // labels are not headings
});

test('the home page states no prices', () => {
  expect(container.textContent).not.toMatch(/\$\s?\d/);
});

test('twelve use case cards: four each for Nexus, Bridge and Stream, each opening its own next step', () => {
  const cards = [...container.querySelectorAll('#usecases a.lx-ucard')];
  expect(cards).toHaveLength(12);
  const hrefs = cards.map(path);
  expect(hrefs.filter((h) => h.startsWith('/solutions/'))).toHaveLength(4);
  expect(hrefs.filter((h) => /^\/bridge\/(can|serial|daq|io)$/.test(h))).toHaveLength(4);
  expect(hrefs.filter((h) => h === '/stream/demo')).toHaveLength(4);
});

test('each product row opens that product funnel', () => {
  const rows = [...container.querySelectorAll('#products .lx-row')];
  expect(rows).toHaveLength(3);
  expect(rows.map((r) => path(r.querySelector('a')))).toEqual(['/nexus/pricing', '/bridge', '/stream/demo']);
  expect(rows.map((r) => r.querySelector('a').textContent)).toEqual(['Rent or buy Nexus', 'Choose your Bridge', 'Try the demo']);
});

test('headings go in order and the page ends with a single closing action', () => {
  const levels = [...container.querySelectorAll('h1, h2, h3')].map((h) => Number(h.tagName[1]));
  levels.forEach((level, i) => { if (i > 0) expect(level - levels[i - 1]).toBeLessThanOrEqual(1); });
  expect(container.querySelectorAll('.lx-closing')).toHaveLength(1);
});

test('stays scannable: few visible words, the rest is pictures and diagrams', () => {
  expect(visibleWords(container.querySelector('main'))).toBeLessThan(560);
});
