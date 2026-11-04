import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Footer from '../components/Footer';
import Docs from './Docs';
import ResearchMethodology from '../research/ResearchMethodology';
import { Insight } from '../components/research/ResearchBlocks';

global.IS_REACT_ACT_ENVIRONMENT = true;

// Fixes from a site-wide axe scan, kept as structural checks (colour contrast is checked in
// src/linear.contrast.test.js; the full scan runs in a real browser).
let container; let root;
const render = (ui) => act(() => root.render(<HelmetProvider><MemoryRouter>{ui}</MemoryRouter></HelmetProvider>));
beforeEach(() => { container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });

test('footer column titles are level-two headings, so they never skip a level after the page h1', () => {
  render(<Footer />);
  const titles = [...container.querySelectorAll('#footer-product, #footer-resources, #footer-company')];
  expect(titles).toHaveLength(3);
  titles.forEach((t) => expect(t.tagName).toBe('H2'));
});

test('the docs page has exactly one main landmark that also holds the intro', () => {
  render(<Docs />);
  const mains = container.querySelectorAll('main');
  expect(mains).toHaveLength(1);
  expect(mains[0].querySelector('.page-intro')).not.toBeNull();
  expect(mains[0].querySelector('h1')).not.toBeNull();
});

test('docs sub-headings state their level so the outline never jumps', () => {
  render(<Docs />);
  container.querySelectorAll('h4').forEach((h) => expect(h.getAttribute('aria-level')).toBe('3'));
});

test('the methodology page jump list is a labelled navigation, not a nested complementary landmark', () => {
  render(<ResearchMethodology />);
  expect(container.querySelector('aside')).toBeNull();
  expect(container.querySelector('nav.methodology-nav').getAttribute('aria-label')).toBe('On this page');
});

test('an article callout is a note, not a sidebar landmark', () => {
  render(<Insight>Example callout</Insight>);
  const aside = container.querySelector('aside');
  expect(aside.getAttribute('role')).toBe('note');
  expect(aside.textContent).toContain('Example callout');
});
