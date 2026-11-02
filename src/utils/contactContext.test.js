import { resolveContactContext } from './contactContext';
import { CONTACT_CONTEXTS, PRODUCT_CHOICES } from '../content/contactContexts';

const pick = (search, funnel) => { const r = resolveContactContext(search, funnel); return [r.id, r.source]; };

test('priority: a named product, then a Nexus solution, then the session, then neutral', () => {
  expect(pick('?product=bridge', { product: 'stream' })).toEqual(['bridge', 'link']);
  expect(pick('?solution=can-ecu-testing', { product: 'stream' })).toEqual(['nexus', 'solution']);
  expect(pick('', { product: 'stream' })).toEqual(['stream', 'session']);
  expect(pick('', {})).toEqual(['neutral', 'default']);
  expect(pick('?product=BRIDGE', {})).toEqual(['bridge', 'link']);   // case does not matter
});

test('unknown or malformed values never pick a context', () => {
  expect(pick('?product=toasters', {})).toEqual(['neutral', 'default']);
  expect(pick('?product=', { product: 'nope' })).toEqual(['neutral', 'default']);
  expect(pick('?solution=not-a-real-solution', {})).toEqual(['neutral', 'default']);
});

test('a Bridge model counts only when the visitor really looked at it', () => {
  expect(resolveContactContext('', { product: 'bridge', item: 'Bridge DAQ' }).topic).toBe('Bridge · Bridge DAQ');
  expect(resolveContactContext('?product=bridge', {}).topic).toBe('Bridge');
  // the item belongs to Bridge: it must not leak into another product's page
  expect(resolveContactContext('?product=stream', { product: 'bridge', item: 'Bridge DAQ' }).topic).toBe('Stream');
  expect(resolveContactContext('?product=bridge', { product: 'nexus', item: 'Bridge DAQ' }).topic).toBe('Bridge');
});

test('every context has the same shape, three starters and complete copy', () => {
  Object.values(CONTACT_CONTEXTS).forEach((c) => {
    expect(c.heading && c.intro && c.seoDescription).toBeTruthy();
    expect(c.steps).toHaveLength(3);
    expect(c.starters({ solution: null, item: '' })).toHaveLength(3);
    expect(typeof c.assessment).toBe('boolean');
    expect(c.next.to && c.next.label && c.next.target).toBeTruthy();
  });
  PRODUCT_CHOICES.forEach(([id]) => expect(CONTACT_CONTEXTS[id]).toBeTruthy());
});

test('the sheet topic: null when nothing is known, the product otherwise', () => {
  expect(resolveContactContext('', {}).topic).toBeNull();
  expect(resolveContactContext('?product=stream', {}).topic).toBe('Stream');
  expect(resolveContactContext('?product=nexus', {}).topic).toBe('Plotune Nexus');
});

test('no hedging or status wording in any contact copy', () => {
  expect(JSON.stringify(Object.values(CONTACT_CONTEXTS).map((c) => [c.heading, c.intro, c.seoDescription, c.steps, c.starters({}), c.next.label]))).not.toMatch(/target|not final|early commercial|subject to validation/i);
});
