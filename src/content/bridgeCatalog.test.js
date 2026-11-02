import fs from 'fs';
import path from 'path';
import { CATALOG_VERSION, COMMON_FEATURES, PRICE_NOTE, PRODUCTS, getProduct, getProductById, isPriced, priceLabel } from './bridgeCatalog';

test('every product has a unique id and slug, copy, three images and highlights', () => {
  expect(PRODUCTS.map((p) => p.id)).toEqual(['can', 'serial', 'daq', 'io']);
  expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(PRODUCTS.length);
  PRODUCTS.forEach((p) => {
    expect(p.name).toMatch(/^Bridge /);
    expect(p.tagline && p.blurb && p.short).toBeTruthy();
    expect(p.features.length).toBeGreaterThan(5);
    expect(p.advantages.length).toBeGreaterThanOrEqual(4);
    expect(p.definition).toBeTruthy();
    expect(p.applications.length).toBeGreaterThan(2);
    expect(p.highlights).toHaveLength(3);
    expect(p.images.length).toBeGreaterThanOrEqual(2); // real photos where we have them, placeholders otherwise
    expect(p.images.length).toBeLessThanOrEqual(3);
    p.images.forEach((image) => expect(image.alt.length).toBeGreaterThan(10));
  });
  expect(COMMON_FEATURES).toHaveLength(6);
  expect(COMMON_FEATURES[0][0]).toBe('Remote Hardware Access'); // the lead differentiator
});

test('every Bridge has the DC IN power jack in its specifications', () => {
  PRODUCTS.forEach((p) => expect(p.features).toContain('DC IN power jack'));
  expect(COMMON_FEATURES.map((c) => c[0])).toContain('USB-C, DC IN and Wi-Fi');
});

test('the prices', () => {
  expect(Object.fromEntries(PRODUCTS.map((p) => [p.id, p.price]))).toEqual({ can: 199, serial: 129, daq: 249, io: 259 });
  expect(PRICE_NOTE).toBe('Per unit, excl. tax and shipping.');
});

test('prices are null (to be quoted) or a positive number, and labels follow', () => {
  PRODUCTS.forEach((p) => expect(p.price === null || (typeof p.price === 'number' && p.price > 0)).toBe(true));
  expect(priceLabel({ price: null })).toBe('Price on request');
  expect(isPriced({ price: null })).toBe(false);
  expect(priceLabel({ price: 1250 })).toBe('$1,250');
});

test('lookups by slug and id', () => {
  expect(getProduct('daq').name).toBe('Bridge DAQ');
  expect(getProduct('nope')).toBeNull();
  expect(getProductById('io').slug).toBe('io');
  expect(CATALOG_VERSION).toBeTruthy();
});

// scripts/prerender.cjs and generate-static-routes.cjs read slugs from this file's text; they must
// find exactly the products, nothing from comments.
test('the build scripts see exactly the product slugs in the catalog source', () => {
  const source = fs.readFileSync(path.join(__dirname, 'bridgeCatalog.js'), 'utf8');
  expect([...source.matchAll(/slug: '([^']+)'/g)].map((m) => m[1])).toEqual(PRODUCTS.map((p) => p.slug));
});

// The sheet prices requests from its own copy (Code.gs): ids and version must match.
test('the Apps Script catalog copy matches ids, names, prices and version', () => {
  const script = fs.readFileSync(path.join(__dirname, '../../integrations/ai-readiness-apps-script/Code.gs'), 'utf8');
  expect(script).toContain(`version: '${CATALOG_VERSION}'`);
  PRODUCTS.forEach((p) => {
    expect(script).toContain(`${p.id}: { name: '${p.name}', price: ${p.price === null ? 'null' : p.price} }`);
  });
});

// Specs and prices are written plainly: no "target" / "not final" qualifiers or status claims. The two
// open technical questions stay as factual notes on the DAQ and I/O pages.
test('copy carries no hedging qualifiers or status claims', () => {
  const text = JSON.stringify([PRODUCTS, COMMON_FEATURES, PRICE_NOTE]);
  expect(text).not.toMatch(/target|not final|final selling|initial (price|target)|early commercial|subject to (implementation|validation)/i);
  expect(getProductById('daq').boundary).toMatch(/Sampling rate, accuracy, noise performance and isolation/);
  expect(getProductById('io').boundary).toMatch(/current capacity.*isolation and protection ratings/);
});

test('no unconfirmed claims in any product copy', () => {
  const text = JSON.stringify([PRODUCTS, COMMON_FEATURES]);
  expect(text).not.toMatch(/\d\s?(k|M)?S\/s|samples? per second|sampling rate of/i);
  expect(text).not.toMatch(/\b(certified|certification|CE marked|UL listed|RoHS|ISO 26262)\b/i);
  expect(text).not.toMatch(/\b(available (in|from|by)|ships? (in|from|by)|Q[1-4] 20\d\d|\b20(2[6-9]|3\d)\b)/i);
  expect(text).not.toMatch(/accurate to|±\s?0\.\d+\s?%/i);
});

// A product image listed in the catalog must exist in public/ (a typo would ship a broken picture).
test('every image path in the catalog points at a file that exists', () => {
  PRODUCTS.forEach((p) => p.images.forEach((image) => {
    if (image.src) expect(fs.existsSync(path.join(__dirname, '../../public', image.src))).toBe(true);
  }));
});
