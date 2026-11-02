import { useMemo, useSyncExternalStore } from 'react';
import { getProductById, isPriced } from '../content/bridgeCatalog';

// The request cart: what a visitor has picked so far on the way to /request. Lines are
// { id, qty } where `id` is a catalog product id. It is kept in localStorage so a request survives
// a closed tab (a buyer often compares and comes back); where storage is blocked it falls back to
// memory for the visit. Only ids and quantities are stored, never prices: prices are always read
// from the catalog, so a stale cart can't show an old price.
//
// The cart is deliberately generic ({ id, qty }) so Nexus lines can join it later: the request
// page and the order payload only need an id that the catalog (and the Apps Script) understands.
const STORAGE_KEY = 'plotune_request_cart_v1';
const CHANGE_EVENT = 'plotune-cart-change';
export const MAX_QTY = 99;
export const MAX_LINES = 10;

let memory = '[]'; // fallback when storage is unavailable

const readRaw = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || '[]';
  } catch {
    return memory;
  }
};

const writeRaw = (raw) => {
  memory = raw;
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // blocked storage: the in-memory copy still serves this visit
  }
  try {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // no window (never in the browser)
  }
};

export const clampQty = (value) => {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return 1;
  return Math.min(MAX_QTY, Math.max(1, n));
};

// Parse defensively: the stored text may be old, edited or from another catalog. Unknown ids are
// dropped, quantities are clamped and duplicate ids are merged.
export const parseCart = (raw) => {
  let list;
  try {
    list = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(list)) return [];
  const merged = new Map();
  list.forEach((line) => {
    if (!line || typeof line !== 'object' || !getProductById(line.id)) return;
    merged.set(line.id, clampQty((merged.get(line.id) || 0) + clampQty(line.qty)));
  });
  return [...merged].slice(0, MAX_LINES).map(([id, qty]) => ({ id, qty }));
};

export const readCart = () => parseCart(readRaw());
const save = (items) => writeRaw(JSON.stringify(items));

// Add `qty` of a product (more of one already in the cart).
export const addItem = (id, qty = 1) => {
  if (!getProductById(id)) return;
  const items = readCart();
  const line = items.find((item) => item.id === id);
  if (line) line.qty = clampQty(line.qty + qty);
  else if (items.length < MAX_LINES) items.push({ id, qty: clampQty(qty) });
  save(items);
};

// Make sure a product is in the cart without raising its quantity. "Request this Bridge" uses it, so
// pressing the button twice, or coming back to the page, doesn't order two.
export const ensureItem = (id) => {
  if (!readCart().some((item) => item.id === id)) addItem(id, 1);
};

export const setQty = (id, qty) => {
  save(readCart().map((item) => (item.id === id ? { ...item, qty: clampQty(qty) } : item)));
};

export const removeItem = (id) => save(readCart().filter((item) => item.id !== id));
export const clearCart = () => save([]);

export const cartCount = (items) => items.reduce((sum, item) => sum + item.qty, 0);

// Lines joined with their catalog product, for display.
export const withProducts = (items) => items
  .map((item) => ({ ...item, product: getProductById(item.id) }))
  .filter((line) => line.product);

// The estimated total, only when every line has a price; otherwise the order is "to be quoted".
export const cartTotal = (items) => {
  const lines = withProducts(items);
  const complete = lines.length > 0 && lines.every((line) => isPriced(line.product));
  return { complete, total: complete ? lines.reduce((sum, line) => sum + line.product.price * line.qty, 0) : null };
};

const subscribe = (callback) => {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
};

// The cart as React state. The snapshot is the raw string (stable between changes), parsed once per
// change. The server snapshot is empty, so prerendered pages never contain a visitor's cart.
export const useCart = () => {
  const raw = useSyncExternalStore(subscribe, readRaw, () => '[]');
  return useMemo(() => parseCart(raw), [raw]);
};
