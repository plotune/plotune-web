// Visual QA for C04/C05: a dashboard with a note, a chart and one insight tile of every
// kind (each run on screen), the add-tile chooser and the insight builder. Every non-local
// request is mocked. Usage (dev server with REACT_APP_STREAM_WORKSPACE_ENABLED=true on :3000):
//   node scripts/stream/insights-qa.cjs docs/redesign/evidence/stream-insights
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const out = process.argv[2] || 'docs/redesign/evidence/stream-insights';
fs.mkdirSync(out, { recursive: true });
const origin = 'http://localhost:3000', nowMs = Date.now(), iso = (min) => new Date(nowMs - min * 60000).toISOString();
const dayStart = (n) => { const d = new Date(nowMs); d.setUTCHours(0, 0, 0, 0); return new Date(d.getTime() - (6 - n) * 86400000).toISOString(); };
const project = { id: 'robot-validation', name: 'Robot validation', ownerId: 'o', revision: 4, keyPrefix: 'plt_demo', createdAt: iso(0), updatedAt: iso(0) };
const discovery = { eventNames: ['robot.boot', 'robot.ready', 'run.start', 'run.done', 'run.fail', 'motor.sample'], properties: [], deviceIds: ['m-3', 'm-7'], sessionIds: [], truncated: false };
const range = { query: { range: '7d' } };
const insight = (id, name, kind, extra) => ({ id, name, kind, description: '', revision: 0, updatedAt: iso(30), usedBy: [], query: { kind, actor: 'device', ...range, ...extra } });
const insights = [
  insight('i-funnel', 'Boot to finished run', 'funnel', { steps: [{ name: 'robot.boot' }, { name: 'run.start' }, { name: 'run.done' }] }),
  insight('i-retention', 'Robots coming back', 'retention', { startEvent: { name: 'run.start' }, interval: 'day' }),
  insight('i-lifecycle', 'Fleet lifecycle', 'lifecycle', { event: { name: 'run.start' }, interval: 'day' }),
  insight('i-stickiness', 'Active days per robot', 'stickiness', { event: { name: 'run.start' }, interval: 'day' }),
  insight('i-paths', 'After a run starts', 'paths', { startEvent: { name: 'run.start' }, depth: 4 }),
  { ...insight('i-trends', 'Daily runs', 'trends', {}), query: { kind: 'trends', query: { name: 'run.start', range: '7d' }, metrics: [{ id: 'count', operation: 'count' }], bucketSeconds: 86400 } },
];
const summary = (kind, extra = {}) => ({ kind, actor: 'device', actors: 48, unattributedEvents: 0, truncatedActors: 0, ...extra });
const complete = { complete: true, reason: null, scope: 'retained-snapshot' };
const results = {
  'i-funnel': { rows: [
    { step: 1, name: 'robot.boot', actors: 48, conversionFromStart: 1, conversionFromPrevious: null, dropped: 0, medianSecondsFromPrevious: null },
    { step: 2, name: 'run.start', actors: 41, conversionFromStart: 0.854, conversionFromPrevious: 0.854, dropped: 7, medianSecondsFromPrevious: 420 },
    { step: 3, name: 'run.done', actors: 33, conversionFromStart: 0.6875, conversionFromPrevious: 0.805, dropped: 8, medianSecondsFromPrevious: 5400 }], summary: summary('funnel'), coverage: complete },
  'i-retention': { rows: Array.from({ length: 7 }, (_, c) => ({ cohort: c, cohortStart: dayStart(c), cohortSize: [14, 9, 7, 6, 5, 4, 3][c],
    periods: Array.from({ length: 7 - c }, (_, j) => (j === 0 ? [14, 9, 7, 6, 5, 4, 3][c] : Math.round([14, 9, 7, 6, 5, 4, 3][c] * Math.pow(0.72, j)))) })),
    summary: summary('retention', { interval: 'day', intervals: Array.from({ length: 7 }, (_, i) => dayStart(i)) }), coverage: complete },
  'i-lifecycle': { rows: Array.from({ length: 6 }, (_, i) => ({ period: i + 1, periodStart: dayStart(i + 1), new: [6, 4, 3, 5, 2, 3][i], returning: [20, 22, 23, 21, 25, 24][i], resurrecting: [2, 3, 1, 4, 2, 3][i], dormant: [3, 4, 5, 2, 6, 3][i] })),
    summary: summary('lifecycle', { interval: 'day' }), coverage: complete },
  'i-stickiness': { rows: Array.from({ length: 7 }, (_, i) => ({ intervals: i + 1, actors: [5, 7, 9, 8, 7, 6, 6][i] })), summary: summary('stickiness', { interval: 'day' }),
    coverage: { complete: false, reason: 'actor_event_limit', scope: 'retained-snapshot' } },
  'i-paths': { rows: [
    { step: 1, source: 'run.start', target: 'motor.sample', actors: 39 }, { step: 2, source: 'motor.sample', target: 'run.done', actors: 30 },
    { step: 2, source: 'motor.sample', target: 'run.fail', actors: 8 }, { step: 3, source: 'run.done', target: 'run.start', actors: 21 }, { step: 1, source: 'run.start', target: 'run.fail', actors: 2 }],
    summary: summary('paths', { transitions: 5 }), coverage: complete },
  'i-trends': { rows: Array.from({ length: 7 }, (_, i) => ({ bucketStart: dayStart(i), group: null, matched: [120, 140, 98, 160, 175, 150, 90][i], metrics: [] })), coverage: complete },
};
const widget = { id: 'w-samples', title: 'Motor samples', eventName: 'motor.sample', visualization: 'count', chartType: 'bar', measureProperty: '', breakdownProperty: '', filterId: null, range: '24h' };
const dashboard = { id: 'fleet', name: 'Fleet health', description: 'How the validation robots run this week.', widgets: [widget],
  tiles: [{ id: 'note', type: 'text', text: 'Rig B moved to firmware 2.4 on Tuesday.\nIgnore failures before 10:00 that day.' }, { id: 'w-samples', type: 'widget' },
    ...insights.map((i) => ({ id: `t-${i.id}`, type: 'insight', insightId: i.id, title: '' }))] };
const samples = Array.from({ length: 60 }, (_, i) => ({ id: `s${i}`, event: 'motor.sample', timestamp: iso(i * 23), device_id: i % 2 ? 'm-3' : 'm-7', properties: { temp: 70 + (i % 9) } }));

async function run(browser, device, width, height) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  await context.addCookies([{ name: 'auth_token', value: 'Bearer synthetic-account-token', url: origin }]);
  const jobs = {};
  await context.route('**/*', async (route) => {
    const req = route.request(), u = new URL(req.url());
    if (u.origin === origin) return route.continue();
    const respond = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data), headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
    if (req.method() === 'OPTIONS') return respond({}, 204);
    if (u.hostname === 'api.plotune.net') return respond(u.pathname === '/auth/validate' ? { valid: true, username: 'Fixture user' } : { user_id: 'o', username: 'Fixture user', email: 'user@example.test', full_name: 'Fixture User' });
    if (u.hostname !== 'stream.plotune.net') return route.fulfill({ status: 204, body: '' });
    const p = u.pathname, parts = p.split('/').filter(Boolean);
    if (p.endsWith('/discovery')) return respond({ ...discovery, catalog: { events: [], properties: [], actions: [], pathRules: [], cleanedNames: [] } });
    if (p.includes('/widgets/')) return respond({ status: 'ready', widget, page: { items: samples, nextCursor: null, now: iso(0), snapshot: 1 } });
    if (parts[1] === 'data') return respond({ items: [], nextCursor: null, now: iso(0), snapshot: 1, ids: [], cursor: '0', reset: false });
    if (p === '/v1/projects') return respond({ items: [project], plan: { plan: 'free', projectLimit: 2, ownedProjects: 1 } });
    if (parts.length === 3) return respond({ project, membership: { email: 'user@example.test', role: 'Owner' } });
    if (parts[3] === 'dashboards') return respond({ items: [{ id: dashboard.id, kind: 'dashboard', data: dashboard, revision: 3, createdAt: iso(900), updatedAt: iso(20) }] });
    if (parts[3] === 'insights' && parts[5] === 'run') { const id = `job-${parts[4]}`; jobs[id] = parts[4]; return respond({ insight: { id: parts[4] }, tool: 'x', job: { id, state: 'queued' } }); }
    if (parts[3] === 'insights') return respond({ items: insights, nextAfter: null });
    if (parts[3] === 'jobs') return respond({ job: { id: parts[4], state: 'complete', progress: { candidates: 1800 }, result: results[jobs[parts[4]]] } });
    if (parts[3] === 'members') return respond({ items: [{ email: 'user@example.test', role: 'Owner' }] });
    return respond({ items: [] });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const shot = (name) => page.screenshot({ path: path.join(out, `${device}-${name}.png`), fullPage: true });
  await page.goto(`${origin}/stream/workspace?project=${project.id}&view=dashboards&dashboard=fleet`);
  await page.getByText('Fleet health').first().waitFor({ timeout: 60000 });
  await page.getByText('Boot to finished run').first().waitFor();
  await shot('dashboard-before-run');
  for (const b of await page.getByRole('button', { name: /^Run$/ }).all()) await b.click();
  await page.getByText('Run again').first().waitFor({ timeout: 20000 });
  await page.waitForFunction(() => document.querySelectorAll('.st-insight-result').length >= 6, null, { timeout: 20000 });
  await shot('dashboard-results');
  await page.getByRole('button', { name: /Add tile/ }).click();
  await page.getByText('What should this tile show?').waitFor();
  await shot('add-tile');
  await page.getByRole('button', { name: /^Insight/ }).click();
  await page.getByText('Create a new insight').click();
  await page.locator('.st-insight-kinds label', { hasText: 'Funnel' }).click();
  await page.getByLabel('Step 1').fill('robot.boot');
  await page.getByLabel('Step 2').fill('run.done');
  await shot('insight-builder');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  await context.close();
  return { device, errors, overflow };
}
(async () => {
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const report = [];
  for (const [device, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) report.push(await run(browser, device, w, h));
  await browser.close();
  console.log(JSON.stringify(report, null, 1));
})();
