import { contactHref, productForPath, recordProductVisit, getFunnelContext } from './funnel';

beforeEach(() => window.sessionStorage.clear());

test('which product a path belongs to (and which belong to none)', () => {
  const cases = {
    '/bridge': 'bridge', '/bridge/': 'bridge', '/bridge/daq': 'bridge', '/bridge/authorize': 'bridge', '/request': 'bridge',
    '/stream': 'stream', '/stream/workspace': 'stream', '/stream/demo': 'stream', '/streams': 'stream',
    '/nexus': 'nexus', '/nexus/pricing': 'nexus', '/solutions/can-ecu-testing': 'nexus', '/docs/nexus/mcp-api': 'nexus', '/ai-readiness': 'nexus', '/agentic-test-development': 'nexus',
    '/': null, '/about': null, '/contact': null, '/research/results': null, '/docs': null, '/bridged': null, '/requests': null,
  };
  Object.entries(cases).forEach(([path, product]) => expect([path, productForPath(path)]).toEqual([path, product]));
  expect(productForPath('/BRIDGE/CAN')).toBe('bridge');
});

test('recording a visit keeps the item with its product and drops it when the product changes', () => {
  recordProductVisit('bridge', 'Bridge DAQ');
  expect(getFunnelContext()).toMatchObject({ product: 'bridge', item: 'Bridge DAQ' });
  recordProductVisit('bridge');                       // the Bridge landing page: still the same item
  expect(getFunnelContext().item).toBe('Bridge DAQ');
  recordProductVisit('stream');                       // another product: the item must not follow
  expect(getFunnelContext()).toMatchObject({ product: 'stream' });
  expect(getFunnelContext().item).toBeUndefined();
});

test('recording keeps the first-touch entry_source and the other funnel fields', () => {
  window.sessionStorage.setItem('plotune_funnel', JSON.stringify({ entry_source: 'google_ads', solution: 'can-ecu-testing' }));
  recordProductVisit('nexus');
  expect(getFunnelContext()).toMatchObject({ entry_source: 'google_ads', solution: 'can-ecu-testing', product: 'nexus' });
});

test('contactHref names the product and keeps the funnel context', () => {
  window.sessionStorage.setItem('plotune_funnel', JSON.stringify({ entry_source: 'linkedin' }));
  const href = contactHref('bridge');
  expect(href.startsWith('/contact?')).toBe(true);
  const params = new URLSearchParams(href.split('?')[1]);
  expect(params.get('product')).toBe('bridge');
  expect(params.get('entry_source')).toBe('linkedin');
});

test('storage that throws never breaks recording', () => {
  const set = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  expect(() => recordProductVisit('bridge', 'Bridge CAN')).not.toThrow();
  set.mockRestore();
});
