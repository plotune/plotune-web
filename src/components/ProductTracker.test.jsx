import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import ProductTracker from './ProductTracker';
import { getFunnelContext } from '../utils/funnel';

global.IS_REACT_ACT_ENVIRONMENT = true;
let container; let root; let go;
const Nav = () => { go = useNavigate(); return null; };
beforeEach(() => { window.sessionStorage.clear(); container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container); });
afterEach(() => { act(() => root.unmount()); container.remove(); });
const mount = (start) => act(() => root.render(<MemoryRouter initialEntries={[start]}><ProductTracker /><Nav /></MemoryRouter>));
const visit = (path) => act(() => go(path));

test('follows the visitor between product areas, and names the Bridge model on a product page', () => {
  mount('/');
  expect(getFunnelContext().product).toBeUndefined();     // the home page belongs to no product
  visit('/bridge');
  expect(getFunnelContext()).toMatchObject({ product: 'bridge' });
  visit('/bridge/daq');
  expect(getFunnelContext()).toMatchObject({ product: 'bridge', item: 'Bridge DAQ' });
  visit('/request');
  expect(getFunnelContext()).toMatchObject({ product: 'bridge', item: 'Bridge DAQ' });
  visit('/stream');
  expect(getFunnelContext()).toMatchObject({ product: 'stream' });
  expect(getFunnelContext().item).toBeUndefined();         // the model does not follow them to Stream
});

test('pages that belong to no product leave the last product in place (so header "Contact" still knows)', () => {
  mount('/nexus');
  visit('/about'); visit('/contact'); visit('/research');
  expect(getFunnelContext().product).toBe('nexus');
});

test('an unknown /bridge/<slug> records the product but no model', () => {
  mount('/bridge/not-a-product');
  expect(getFunnelContext()).toMatchObject({ product: 'bridge' });
  expect(getFunnelContext().item).toBeUndefined();
});
