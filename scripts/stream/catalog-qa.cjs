// Visual QA for the C03 catalog: /stream/workspace?view=catalog (events, properties,
// actions, path rules) and Explorer with an action and a unit. Every non-local request
// is mocked. Usage (dev server with REACT_APP_STREAM_WORKSPACE_ENABLED=true on :3000):
//   node scripts/stream/catalog-qa.cjs docs/redesign/evidence/stream-catalog
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const out = process.argv[2] || 'docs/redesign/evidence/stream-catalog';
fs.mkdirSync(out, { recursive: true });
const origin = 'http://localhost:3000', nowMs = Date.now(), iso = (min) => new Date(nowMs - min * 60000).toISOString();
const project = { id: 'robot-validation', name: 'Robot validation', ownerId: 'o', revision: 1, keyPrefix: 'plt_demo', createdAt: iso(0), updatedAt: iso(0) };
const edited = (by, min, via = 'workspace', client) => ({ updatedBy: by, updatedVia: via, ...(client ? { updatedClient: client } : {}), updatedAt: iso(min) });
const discovery = {
  eventNames: ['motor.sample', 'drone.error', 'bench.cycle'],
  properties: [
    { path: 'temp', types: ['number'], values: [71.5, 95.2, 64] },
    { path: 'rpm', types: ['number'], values: [1480, 1520] },
    { path: 'device_id', types: ['string'], values: ['m-3', 'm-7'] },
    { path: 'topic', types: ['string'], values: ['/robot/7/arm', '/robot/12/arm', '/robot/7/base'] },
    { path: 'code', types: ['string'], values: ['THERMAL', 'GPS'] },
  ],
  deviceIds: ['m-3', 'm-7'], sessionIds: [], truncated: false,
};
async function run(browser, device, width, height, role) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  await context.addCookies([{ name: 'auth_token', value: 'Bearer synthetic-account-token', url: origin }]);
  const catalog = {
    events: [{ name: 'motor.sample', description: 'One reading per second from a drive controller', owner: 'firmware', tags: ['motor'], verified: true, revision: 2, ...edited('carol@example.test', 300, 'mcp', 'Claude') }],
    properties: [{ path: 'temp', description: 'Winding temperature', unit: '°C', kind: 'measurement', owner: 'firmware', revision: 0, ...edited('user@example.test', 600) },
      { path: 'device_id', description: 'Controller serial', unit: '', kind: 'identifier', owner: '', revision: 0, ...edited('user@example.test', 600) }],
    actions: [{ id: 'action-1', name: 'Overheat', description: 'Any thermal problem', steps: [{ name: 'motor.sample', filterId: 'hot', conditions: [] }, { name: 'drone.error', filterId: null, conditions: [{ path: 'code', operator: 'equals', value: 'THERMAL' }] }], revision: 0, ...edited('user@example.test', 120) }],
    pathRules: { rules: [{ pattern: '/robot/[0-9]+/', replacement: '/robot/:id/' }], revision: 0, ...edited('user@example.test', 1000) },
  };
  const queries = [];
  await context.route('**/*', async (route) => {
    const req = route.request(), u = new URL(req.url());
    if (u.origin === origin) return route.continue();
    const respond = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data), headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
    if (req.method() === 'OPTIONS') return respond({}, 204);
    if (u.hostname === 'api.plotune.net') return respond(u.pathname === '/auth/validate' ? { valid: true, username: 'Fixture user' } : { user_id: 'o', username: 'Fixture user', email: 'user@example.test', full_name: 'Fixture User' });
    if (u.hostname !== 'stream.plotune.net') return route.fulfill({ status: 204, body: '' });
    const p = u.pathname, parts = p.split('/').filter(Boolean);
    if (p.endsWith('/discovery')) return respond({ ...discovery, catalog: { events: catalog.events, properties: catalog.properties,
      actions: catalog.actions.map((a) => ({ id: a.id, name: a.name, description: a.description, revision: a.revision, eventNames: a.steps.map((s) => s.name) })),
      pathRules: catalog.pathRules.rules.map((r) => ({ ...r, valid: true })), cleanedNames: [] } });
    if (p.endsWith('/path-preview')) return respond({ changed: [{ name: '/robot/12/arm', cleaned: '/robot/:id/arm' }, { name: '/robot/7/arm', cleaned: '/robot/:id/arm' }, { name: '/robot/7/base', cleaned: '/robot/:id/base' }], distinctBefore: 6, distinctAfter: 4, invalidPatterns: [] });
    if (p.endsWith('/events/query')) {
      queries.push(JSON.parse(req.postData() || '{}'));
      return respond({ items: [
        { id: 'e2', event: 'drone.error', timestamp: iso(4), device_id: 'd-11', properties: { code: 'THERMAL', altitude: 42 } },
        { id: 'e1', event: 'motor.sample', timestamp: iso(2), device_id: 'm-3', properties: { temp: 95.2, rpm: 1520, topic: '/robot/7/arm' } },
      ], nextCursor: null, now: iso(0), snapshot: 1 });
    }
    if (parts[1] === 'data') return respond({ items: [], nextCursor: null, now: iso(0), snapshot: 1, ids: [], cursor: '0', reset: false });
    if (p === '/v1/projects') return respond({ items: [project] });
    if (parts.length === 3) return respond({ project, membership: { email: 'user@example.test', role } });
    if (parts[3] === 'catalog' && parts.length === 4) return respond(catalog);
    if (parts[3] === 'catalog' && parts[4] === 'events') {
      const body = JSON.parse(req.postData()); const name = decodeURIComponent(parts[5]);
      const next = { name, description: body.description, owner: body.owner, tags: body.tags, verified: body.verified, revision: (body.revision ?? -1) + 1, ...edited('user@example.test', 0) };
      catalog.events = [...catalog.events.filter((e) => e.name !== name), next];
      return respond(next);
    }
    if (parts[3] === 'filters') return respond({ items: [{ id: 'hot', kind: 'filter', data: { id: 'hot', name: 'Hot', conditions: [{ path: 'temp', operator: 'greater_than', value: 90 }] }, revision: 0, createdAt: iso(0), updatedAt: iso(0) }] });
    return respond({ items: [] });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const shot = (name) => page.screenshot({ path: path.join(out, `${device}-${role.toLowerCase()}-${name}.png`), fullPage: true });
  const result = { device, role, errors };
  await page.goto(`${origin}/stream/workspace?project=${project.id}&view=catalog`);
  await page.getByRole('tab', { name: 'Events' }).waitFor({ timeout: 60000 });
  await page.getByText('One reading per second').waitFor();
  await shot('events');
  await page.getByRole('button', { name: 'drone.error' }).click();
  await page.locator('dialog textarea').fill('A drone reported a fault; code says which');
  await shot('event-dialog');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByText('A drone reported a fault').waitFor();
  result.eventSaved = true;
  await page.getByRole('tab', { name: 'Properties' }).click();
  await page.getByText('Winding temperature').waitFor();
  await shot('properties');
  await page.getByRole('button', { name: 'temp', exact: true }).click();
  await page.getByText('Recent values').waitFor();
  await shot('property-dialog');
  await page.keyboard.press('Escape');
  await page.getByRole('tab', { name: 'Actions' }).click();
  await page.getByRole('button', { name: 'Overheat' }).click();
  await page.getByText('Steps (any of)').waitFor();
  await shot('action-dialog');
  await page.keyboard.press('Escape');
  await page.getByRole('tab', { name: 'Path rules' }).click();
  await page.getByRole('button', { name: 'Preview' }).click();
  await page.getByText('6 observed names become 4').waitFor();
  result.saveRulesShown = (await page.getByRole('button', { name: 'Save rules' }).count()) === 1;
  await shot('path-rules');
  // Explorer: pick the action; the stored value shows its unit.
  await page.goto(`${origin}/stream/workspace?project=${project.id}&view=events`);
  await page.locator('.live-action-select select').waitFor({ timeout: 60000 });
  await page.locator('.live-action-select select').selectOption('action-1');
  await page.getByText('95.2 °C').first().waitFor();
  result.actionQuery = queries.some((q) => q.actionId === 'action-1' && !q.name);
  await shot('explorer-action');
  result.overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  await context.close();
  return result;
}
(async () => {
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const report = [];
  for (const [device, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]])
    for (const role of ['Owner', 'Member']) report.push(await run(browser, device, w, h, role));
  await browser.close();
  console.log(JSON.stringify(report, null, 1));
})();
