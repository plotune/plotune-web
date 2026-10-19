// Visual QA for credits in /stream/workspace: the account menu glance and the Add
// credits dialog opened from a shared promo link. Every non-local request is mocked.
// Usage (dev server with REACT_APP_STREAM_WORKSPACE_ENABLED=true on :3000):
//   node scripts/stream/credits-qa.cjs docs/redesign/evidence/stream-credits
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const out = process.argv[2] || 'docs/redesign/evidence/stream-credits';
fs.mkdirSync(out, { recursive: true });
const origin = 'http://localhost:3000', now = new Date().toISOString();
const project = { id: 'robot-validation', name: 'Robot validation', ownerId: 'o', revision: 1, keyPrefix: 'plt_demo', createdAt: now, updatedAt: now };
async function run(browser, device, width, height) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  await context.addCookies([{ name: 'auth_token', value: 'Bearer synthetic-account-token', url: origin }]);
  let granted = 0;
  const grants = [];
  await context.route('**/*', async (route) => {
    const req = route.request(), u = new URL(req.url());
    if (u.origin === origin) return route.continue();
    const respond = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data), headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
    if (req.method() === 'OPTIONS') return respond({}, 204);
    if (u.hostname === 'api.plotune.net') return respond(u.pathname === '/auth/validate' ? { valid: true, username: 'Fixture owner' } : { user_id: 'o', username: 'Fixture owner', email: 'owner@example.test', full_name: 'Fixture Owner' });
    if (u.hostname !== 'stream.plotune.net') return route.fulfill({ status: 204, body: '' });
    const parts = u.pathname.split('/').filter(Boolean);
    if (u.pathname === '/v1/projects/credits') return respond({ unit: 'credits', granted: granted / 1, grants });
    if (u.pathname === '/v1/projects/credits/redeem') {
      const { code } = JSON.parse(req.postData() || '{}');
      if (code.toUpperCase() !== 'LAUNCH50') return respond({ error: { code: 'promo_not_found', message: 'This code does not exist' } }, 404);
      granted += 50000;
      const grant = { id: 'g1', credits: 50000, source: 'promo', createdAt: new Date().toISOString() };
      grants.unshift(grant);
      return respond({ grant }, 201);
    }
    if (u.pathname === '/v1/projects') return respond({ items: [project] });
    if (parts[1] === 'projects' && parts.length === 3) return respond({ project, membership: { email: 'owner@example.test', role: 'Owner' } });
    if (parts[1] === 'projects') return respond({ items: [] });
    const endpoint = parts.slice(4).join('/');
    if (endpoint === 'usage') return respond({ unit: 'credits', month: '2026-10', monthly: { used: 24310.4, allowance: 30000, resetsAt: '2026-11-01T00:00:00.000Z' },
      day: now.slice(0, 10), daily: { used: 412.6, limit: 3000, resetsAt: '2026-10-20T00:00:00.000Z' },
      added: { balance: granted, granted, spent: 0 }, available: 2587.4, prices: { event: 0.2, webhookDelivery: 15, analysisJobPerDay: 20, toolCall: 1 }, scope: 'project-owner-account' });
    if (endpoint === 'discovery') return respond({ eventNames: ['motor.sample'], properties: [], deviceIds: [], sessionIds: [], truncated: false });
    return respond({ items: [], nextCursor: null, now, snapshot: 1 });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const shot = (name) => page.screenshot({ path: path.join(out, `${device}-${name}.png`) });
  // 1. Account menu: monthly credits left, today, one action.
  await page.goto(`${origin}/stream/workspace?project=robot-validation&view=api`);
  await page.getByRole('button', { name: 'Account' }).click();
  await page.getByText('Monthly credits').waitFor({ timeout: 30000 });
  await shot('menu');
  // 2. A shared promo link opens Add credits prefilled; the link parameter is removed.
  await page.goto(`${origin}/stream/workspace?project=robot-validation&view=api&redeem=LAUNCH50`);
  await page.locator('dialog[open] #cr-code').waitFor({ timeout: 30000 });
  const cleaned = !new URL(page.url()).searchParams.has('redeem');
  await shot('dialog');
  // 3. Redeemed: confirmation and the grant listed; the menu then shows added credits.
  await page.getByRole('button', { name: 'Redeem' }).click();
  await page.getByText('Added 50,000 credits to your account.').waitFor();
  await page.locator('.cr-ledger').waitFor();
  await shot('redeemed');
  // 4. A wrong code explains itself.
  await page.locator('#cr-code').fill('LAUNCH05');
  await page.getByRole('button', { name: 'Redeem' }).click();
  await page.getByRole('alert').waitFor();
  await shot('wrong-code');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Account' }).click();
  await page.getByText('Added credits').waitFor();
  await shot('menu-added');
  const metrics = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth }));
  await context.close();
  return { device, errors, linkCleaned: cleaned, ...metrics };
}
(async () => {
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const report = [];
  for (const [device, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) report.push(await run(browser, device, w, h));
  await browser.close();
  console.log(JSON.stringify(report, null, 1));
})();
