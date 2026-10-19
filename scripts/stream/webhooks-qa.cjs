// Visual QA for /stream/workspace?view=webhooks: signing secrets shown once, rotation,
// the Member read-only view and delivery status. Every non-local request is mocked.
// Usage (dev server with REACT_APP_STREAM_WORKSPACE_ENABLED=true on :3000):
//   node scripts/stream/webhooks-qa.cjs docs/redesign/evidence/stream-webhooks
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const out = process.argv[2] || 'docs/redesign/evidence/stream-webhooks';
fs.mkdirSync(out, { recursive: true });
const origin = 'http://localhost:3000', nowMs = Date.now(), iso = (min) => new Date(nowMs - min * 60000).toISOString();
const project = { id: 'robot-validation', name: 'Robot validation', ownerId: 'o', revision: 1, keyPrefix: 'plt_demo', createdAt: iso(0), updatedAt: iso(0) };
const stored = (data, revision = 0) => ({ id: data.id, kind: 'webhook', data, generation: 'g', revision, createdAt: iso(600), updatedAt: iso(600) });
const deliveries = [
  { id: 'e5:ci', eventId: '0199f3a2-7c1e-7b10-9a51-5e2f3c4d5e6f', webhookId: 'ci', attempts: 2, status: 'pending', nextAt: new Date(nowMs + 4 * 60000).toISOString(), createdAt: iso(3), attemptedAt: iso(1), responseStatus: 503 },
  { id: 'e4:ci', eventId: '0199f3a1-11aa-7c22-8b33-4d5e6f708192', webhookId: 'ci', attempts: 1, status: 'delivered', nextAt: iso(20), createdAt: iso(20), attemptedAt: iso(20), responseStatus: 204 },
  { id: 'e3:legacy', eventId: '0199f39f-2b3c-7d4e-9f50-61728394a5b6', webhookId: 'legacy', attempts: 5, status: 'failed', nextAt: iso(90), createdAt: iso(400), attemptedAt: iso(95), responseStatus: 0 },
];
async function run(browser, device, width, height, role) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  await context.addCookies([{ name: 'auth_token', value: 'Bearer synthetic-account-token', url: origin }]);
  let hooks = [
    stored({ id: 'ci', eventName: 'motor.alarm', url: 'https://ci.example.com/hooks/plotune?team=robotics', enabled: true, auth: { type: 'header', name: 'X-Api-Key', value: '' }, signing: { configured: true, previousUntil: null } }),
    stored({ id: 'legacy', eventName: 'drone.error', url: 'https://ops.example.org/in', enabled: false, auth: { type: 'none' }, signing: { configured: false, previousUntil: null } }),
  ];
  let failNextRead = false, secrets = 0;
  await context.route('**/*', async (route) => {
    const req = route.request(), u = new URL(req.url());
    if (u.origin === origin) return route.continue();
    const respond = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data), headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
    if (req.method() === 'OPTIONS') return respond({}, 204);
    if (u.hostname === 'api.plotune.net') return respond(u.pathname === '/auth/validate' ? { valid: true, username: 'Fixture user' } : { user_id: 'o', username: 'Fixture user', email: 'user@example.test', full_name: 'Fixture User' });
    if (u.hostname !== 'stream.plotune.net') return route.fulfill({ status: 204, body: '' });
    const parts = u.pathname.split('/').filter(Boolean);
    if (u.pathname === `/v1/data/projects/${project.id}/webhook-deliveries`) return respond({ items: deliveries, window: 'last 100 deliveries' });
    if (parts[1] === 'data') return respond({ items: [], eventNames: ['motor.alarm', 'drone.error'], properties: [], deviceIds: [], sessionIds: [], truncated: false, nextCursor: null, now: iso(0), snapshot: 1 });
    if (u.pathname === '/v1/projects') return respond({ items: [project] });
    if (parts.length === 3) {
      // The read that verifies a write can fail; the secret from the write must survive it.
      if (failNextRead) { failNextRead = false; return respond({ error: { code: 'service_unavailable', message: 'Service temporarily unavailable; retry later' } }, 503); }
      return respond({ project, membership: { email: 'user@example.test', role } });
    }
    if (parts[3] === 'webhooks' && req.method() === 'POST' && parts.length === 4) {
      const { data } = JSON.parse(req.postData());
      const hook = stored({ ...data, auth: data.auth.type === 'header' ? { ...data.auth, value: '' } : data.auth, signing: { configured: true, previousUntil: null } });
      hooks = [...hooks, hook];
      failNextRead = true;
      return respond({ ...hook, signingSecret: `whsec_${'4f1c9a'.repeat(10)}${String(++secrets).padStart(4, '0')}` }, 201);
    }
    if (parts[3] === 'webhooks' && parts[5] === 'signing') {
      const at = hooks.findIndex((h) => h.id === parts[4]);
      const configured = hooks[at].data.signing.configured;
      hooks[at] = stored({ ...hooks[at].data, signing: { configured: true, previousUntil: configured ? new Date(nowMs + 24 * 3600000).toISOString() : null } }, hooks[at].revision + 1);
      return respond({ ...hooks[at], signingSecret: `whsec_${'9b27e0'.repeat(10)}${String(++secrets).padStart(4, '0')}` });
    }
    if (parts[3] === 'webhooks') return respond({ items: hooks });
    return respond({ items: [] });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const shot = (name) => page.screenshot({ path: path.join(out, `${device}-${role.toLowerCase()}-${name}.png`), fullPage: true });
  await page.goto(`${origin}/stream/workspace?project=${project.id}&view=webhooks`);
  await page.getByRole('heading', { name: 'Delivery status' }).waitFor({ timeout: 60000 });
  await page.getByText('HTTP 503').waitFor();
  await shot('list');
  const result = { device, role, errors };
  if (role === 'Member') {
    result.readOnly = (await page.getByRole('button', { name: 'Add webhook' }).count()) === 0 && (await page.locator('.st-webhook-row input[type=checkbox]').count()) === 0;
    await page.getByRole('button', { name: /Signing for motor.alarm/ }).click();
    await page.getByText('How your receiver checks the signature').click();
    result.noActions = (await page.getByRole('button', { name: /Rotate|Set up/ }).count()) === 0;
    await shot('signing');
  } else {
    // Create: the secret is shown once even though the refresh after the write fails.
    await page.getByRole('button', { name: 'Add webhook' }).click();
    await page.locator('input[type=url]').fill('https://hooks.example.net/plotune');
    await page.locator('dialog form').evaluate((form) => form.requestSubmit());
    await page.getByRole('textbox', { name: 'Signing secret' }).waitFor().catch(async (error) => { await shot('failure'); throw error; });
    result.secretAfterFailedRefresh = (await page.getByRole('textbox', { name: 'Signing secret' }).inputValue()).startsWith('whsec_');
    await shot('created-secret');
    await page.getByRole('button', { name: 'Done' }).click();
    // Rotate with confirmation; the previous secret's deadline is shown.
    await page.getByRole('button', { name: /Signing for motor.alarm/ }).click();
    await page.getByRole('button', { name: 'Rotate secret…' }).click();
    await shot('rotate-confirm');
    await page.getByRole('button', { name: 'Rotate secret', exact: true }).click();
    await page.getByText('The previous secret also signs until').waitFor();
    await shot('rotated-secret');
    await page.getByRole('button', { name: 'Done' }).click();
    // A webhook created before signing offers set-up directly.
    await page.getByRole('button', { name: /Signing for drone.error: Not signed/ }).click();
    await shot('legacy');
    await page.getByRole('button', { name: 'Set up signing' }).click();
    await page.getByRole('textbox', { name: 'Signing secret' }).waitFor();
    await page.getByRole('button', { name: 'Done' }).click();
  }
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
