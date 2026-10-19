// Visual QA for /stream/workspace?view=devices. Every non-local request is mocked.
// Usage (dev server with REACT_APP_STREAM_WORKSPACE_ENABLED=true on :3000):
//   node scripts/stream/devices-qa.cjs docs/redesign/evidence/stream-devices
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const out = process.argv[2] || 'docs/redesign/evidence/stream-devices';
fs.mkdirSync(out, { recursive: true });
const origin = 'http://localhost:3000', nowMs = Date.now(), iso = (min) => new Date(nowMs - min * 60000).toISOString();
const project = { id: 'robot-validation', name: 'Robot validation', ownerId: 'o', revision: 1, keyPrefix: 'plt_demo', createdAt: iso(0), updatedAt: iso(0) };
const dev = (id, min) => ({ deviceId: id, lastSeenAt: iso(min), lastSeenDay: iso(min).slice(0, 10), precision: 'minute' });
const scenario = {
  issues: [
    { id: 'quota_daily', kind: 'quota_daily', severity: 'warning', subject: null, summary: 'The account has used 86% of its daily event allowance.', observedAt: iso(0) },
    { id: 'device_silent:bench-02', kind: 'device_silent', severity: 'warning', subject: 'bench-02', summary: 'Device bench-02 has sent no events for 3 hours.', observedAt: iso(180) },
  ],
  devices: [dev('motor-003', 2), dev('drone-11', 14), dev('bench-02', 180), dev('rig-legacy-7', 9 * 1440), { deviceId: 'recovered-4', lastSeenAt: null, lastSeenDay: iso(2 * 1440).slice(0, 10), precision: 'day' }],
};
async function run(browser, device, width, height, empty) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  await context.addCookies([{ name: 'auth_token', value: 'Bearer synthetic-account-token', url: origin }]);
  await context.route('**/*', async (route) => {
    const req = route.request(), u = new URL(req.url());
    if (u.origin === origin) return route.continue();
    const respond = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data), headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
    if (req.method() === 'OPTIONS') return respond({}, 204);
    if (u.hostname === 'api.plotune.net') return respond(u.pathname === '/auth/validate' ? { valid: true, username: 'Fixture owner' } : { user_id: 'o', username: 'Fixture owner', email: 'owner@example.test', full_name: 'Fixture Owner' });
    if (u.hostname !== 'stream.plotune.net') return route.fulfill({ status: 204, body: '' });
    const parts = u.pathname.split('/').filter(Boolean);
    if (u.pathname === '/v1/projects') return respond({ items: [project] });
    if (parts[1] === 'projects' && parts.length === 3) return respond({ project, membership: { email: 'owner@example.test', role: 'Owner' } });
    if (parts[1] === 'projects') return respond({ items: [] });
    const endpoint = parts.slice(4).join('/');
    if (endpoint === 'health') {
      const id = u.searchParams.get('id');
      if (id) return respond({ projectId: project.id, asOf: iso(0), issue: { ...scenario.issues.find((i) => i.id === id), evidence: id === 'quota_daily' ? { accepted: 1720, allowance: 2000, resetsAt: new Date(Date.UTC(2026, 9, 20)).toISOString() } : { lastSeenAt: iso(180), silentAfterMinutes: 60 }, nextSteps: id === 'quota_daily' ? ['Reduce capture volume or sampling on devices.', 'The allowance is shared by every project of the owner account.'] : ["Check the device's power, network and capture client logs.", 'Run a device check for a step-by-step diagnosis.'] } });
      return respond({ projectId: project.id, asOf: iso(0), issues: empty ? [] : scenario.issues });
    }
    if (endpoint === 'devices') return respond({ projectId: project.id, asOf: iso(0), items: empty ? [] : scenario.devices, nextAfter: null, total: empty ? 0 : scenario.devices.length, truncated: false, lastCaptureAt: empty ? null : iso(2) });
    if (endpoint === 'diagnose') return respond({ projectId: project.id, asOf: iso(0), deviceId: u.searchParams.get('deviceId'), verdict: 'degraded', checks: [
      { id: 'project_settings', status: 'pass', summary: 'The runtime has current project settings, so the project key resolves.' },
      { id: 'allowance', status: 'pass', summary: "The account's event allowance has room." },
      { id: 'buffer', status: 'pass', summary: 'The capture buffer has room.' },
      { id: 'recent_capture', status: 'pass', summary: `The project accepted an event at ${iso(2)}.` },
      { id: 'device', status: 'warn', summary: `Device last seen at ${iso(180)}.` },
      { id: 'history', status: 'pass', summary: 'Buffered events are reaching long-term history on schedule.' }],
      nextSteps: ["Check the device's power, network and capture client logs."], limits: [] });
    if (endpoint === 'usage') return respond({ month: '2026-10', accepted: 1720, allowance: 30000, day: iso(0).slice(0, 10), acceptedToday: 1720, dailyAllowance: 2000, scope: 'project-owner-account' });
    if (endpoint === 'discovery') return respond({ eventNames: ['motor.sample'], properties: [], deviceIds: [], sessionIds: [], truncated: false });
    return respond({ items: [], nextCursor: null, now: iso(0), snapshot: 1 });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${origin}/stream/workspace?project=robot-validation&view=devices`);
  await page.getByRole('heading', { name: 'Devices', level: 2 }).waitFor({ timeout: 30000 });
  await page.waitForTimeout(400);
  const name = empty ? `${device}-empty` : device;
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true });
  const metrics = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth,
    smallTargets: [...document.querySelectorAll('main button, main summary')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height < 40; }).map((e) => e.textContent.trim()) }));
  if (!empty) {
    await page.getByRole('button', { name: 'Details' }).nth(1).click();
    await page.locator('dialog[open]').getByText('What to do').waitFor();
    await page.screenshot({ path: path.join(out, `${device}-issue.png`) });
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Check device bench-02' }).click();
    await page.locator('dialog[open]').getByText('Needs attention').waitFor();
    await page.screenshot({ path: path.join(out, `${device}-check.png`) });
  }
  await context.close();
  return { device: name, errors, ...metrics };
}
(async () => {
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const report = [];
  for (const [device, w, h] of [['desktop', 1440, 1000], ['tablet', 768, 1024], ['mobile', 390, 844], ['small-mobile', 320, 740]]) report.push(await run(browser, device, w, h, false));
  report.push(await run(browser, 'desktop', 1440, 1000, true));
  await browser.close();
  console.log(JSON.stringify(report, null, 1));
})();
