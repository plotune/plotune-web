import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import About from './About';
import Nexus from './Nexus';
import NexusStream from './NexusStream';
import Stream from './Stream';

jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root;
const render = (ui) => act(() => root.render(<HelmetProvider><MemoryRouter>{ui}</MemoryRouter></HelmetProvider>));
beforeEach(() => { container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });
const path = (a) => a.getAttribute('href').split('?')[0];

test('About: four product cards, three principles and a closing action', () => {
  render(<About />);
  expect(container.querySelectorAll('h1')).toHaveLength(1);
  expect([...container.querySelectorAll('.lx-ugrid a')].map(path)).toEqual(['/nexus', '/stream', '/download', '/research']);
  container.querySelectorAll('.lx-ugrid .lx-art').forEach((art) => expect(art.querySelector('svg, img')).not.toBeNull());
  expect(container.querySelectorAll('#mission .lx-icard')).toHaveLength(3);
  expect(container.querySelector('.lx-closing a').getAttribute('href')).toBe('/contact');
});

test('Nexus: four use case cards in a balanced grid, five interface cards, three steps and the pricing link', () => {
  render(<Nexus />);
  expect(container.querySelectorAll('h1')).toHaveLength(1);
  const grid = container.querySelector('#nexus-use-cases .lx-ugrid');
  expect(grid.getAttribute('data-n')).toBe('4');
  expect([...grid.querySelectorAll('a')].every((a) => path(a).startsWith('/solutions/'))).toBe(true);
  expect(container.querySelectorAll('.interface-section .lx-icard')).toHaveLength(5);
  expect(container.querySelectorAll('.lx-step')).toHaveLength(3);
  expect([...container.querySelectorAll('a')].some((a) => path(a) === '/nexus/pricing')).toBe(true);
  [...container.querySelectorAll('.section-index span')].forEach((span) => expect(span.textContent).not.toMatch(/^0\d \//)); // no decorative numbering
});

test('Nexus/Stream: the integration model, four steps and the demo link', () => {
  render(<NexusStream />);
  expect(container.querySelectorAll('h1')).toHaveLength(1);
  expect(container.querySelectorAll('.lx-flow .lx-wire')).toHaveLength(2);
  expect(container.querySelectorAll('.lx-step')).toHaveLength(4);
  expect([...container.querySelectorAll('a')].some((a) => path(a) === '/stream/demo')).toBe(true);
  expect(container.querySelector('.lx-code code').textContent).toContain('"event": "test.completed"');
});

test('Stream: keeps its own interactive demo and adds no duplicate use case strip', () => {
  render(<Stream />);
  expect(container.querySelector('.sl-scenarios')).not.toBeNull();
  expect(container.querySelector('.lx-ucard')).toBeNull();
});
