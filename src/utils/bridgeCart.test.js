import { addItem, cartCount, cartTotal, clearCart, ensureItem, parseCart, readCart, removeItem, setQty, withProducts, MAX_QTY } from './bridgeCart';
import * as catalog from '../content/bridgeCatalog';

beforeEach(() => { window.localStorage.clear(); clearCart(); });

test('add, merge, set, remove and clear', () => {
  addItem('can');
  addItem('can', 2);
  addItem('daq');
  expect(readCart()).toEqual([{ id: 'can', qty: 3 }, { id: 'daq', qty: 1 }]);
  expect(cartCount(readCart())).toBe(4);
  setQty('can', 5);
  removeItem('daq');
  expect(readCart()).toEqual([{ id: 'can', qty: 5 }]);
  clearCart();
  expect(readCart()).toEqual([]);
});

test('ensureItem adds once and never raises the quantity', () => {
  ensureItem('io');
  ensureItem('io');
  expect(readCart()).toEqual([{ id: 'io', qty: 1 }]);
});

test('unknown ids are ignored and quantities are clamped', () => {
  addItem('nope');
  expect(readCart()).toEqual([]);
  addItem('can');
  setQty('can', 100000);
  expect(readCart()[0].qty).toBe(MAX_QTY);
  setQty('can', -4);
  expect(readCart()[0].qty).toBe(1);
  setQty('can', 'abc');
  expect(readCart()[0].qty).toBe(1);
});

test('stored text from an older or edited cart is parsed defensively', () => {
  expect(parseCart('not json')).toEqual([]);
  expect(parseCart('{"id":"can"}')).toEqual([]);
  expect(parseCart(JSON.stringify([{ id: 'can', qty: 2 }, { id: 'can', qty: 3 }, { id: 'ghost', qty: 1 }, null, 7]))).toEqual([{ id: 'can', qty: 5 }]);
});

test('the total is the sum of target prices, and exists only when every line is priced', () => {
  addItem('can', 2);
  addItem('daq');
  expect(cartTotal(readCart())).toEqual({ complete: true, total: 647 }); // 2 × 199 + 249
  expect(cartTotal([])).toEqual({ complete: false, total: null });
  const daq = catalog.getProductById('daq');
  const price = daq.price;
  daq.price = null;
  try {
    expect(cartTotal(readCart())).toEqual({ complete: false, total: null });
  } finally { daq.price = price; }
  expect(withProducts([{ id: 'can', qty: 1 }])[0].product.name).toBe('Bridge CAN');
});

test('keeps working when storage is blocked', () => {
  const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  const get = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  try {
    addItem('serial');
    expect(readCart()).toEqual([{ id: 'serial', qty: 1 }]);
  } finally { spy.mockRestore(); get.mockRestore(); }
});
