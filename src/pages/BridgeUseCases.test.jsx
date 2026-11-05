import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Bridge from './Bridge';
import BridgeProduct from './BridgeProduct';

jest.mock('../posthog', () => ({ posthog: { capture: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let container; let root;
const render = (url) => act(() => root.render(
  <HelmetProvider><MemoryRouter initialEntries={[url]}>
    <Routes><Route path="/bridge" element={<Bridge />} /><Route path="/bridge/:slug" element={<BridgeProduct />} /></Routes>
  </MemoryRouter></HelmetProvider>,
));
beforeEach(() => { container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });
const path = (a) => a.getAttribute('href').split('?')[0];

test('the Bridge landing shows four use cases, one per model, in a balanced two-by-two grid', () => {
  render('/bridge');
  const grid = container.querySelector('#bridge-use-cases .lx-ugrid');
  expect(grid.getAttribute('data-n')).toBe('4');
  expect([...grid.querySelectorAll('a')].map(path)).toEqual(['/bridge/can', '/bridge/serial', '/bridge/daq', '/bridge/io']);
});

describe.each(['can', 'serial', 'daq', 'io'])('/bridge/%s', (slug) => {
  test('shows exactly three use cases of its own, all opening the model page', () => {
    render(`/bridge/${slug}`);
    const grid = container.querySelector('#bridge-model-use-cases .lx-ugrid');
    expect(grid.getAttribute('data-n')).toBe('3');
    const cards = [...grid.querySelectorAll('a')];
    expect(cards).toHaveLength(3);
    cards.forEach((a) => expect(path(a)).toBe(`/bridge/${slug}`));
    expect(new Set(cards.map((a) => a.querySelector('h3').textContent)).size).toBe(3);
  });
});
