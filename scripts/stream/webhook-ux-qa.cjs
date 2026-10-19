// Fixture-only webhook task audit. Use a local production preview; no live API calls.
const { chromium } = require('playwright');
const fs = require('node:fs/promises'), path = require('node:path'), assert = require('node:assert/strict');
const origin = process.env.STREAM_QA_ORIGIN || 'http://localhost:3001';
const output = process.env.STREAM_QA_OUTPUT || '/tmp/webhook-ux';
const before = process.argv.includes('--before');
const now = new Date().toISOString(), secret = '01'.repeat(32);
const project = { id: 'robot-validation', name: 'Robot validation', ownerId: 'o', revision: 1, keyPrefix: 'plt_fixture', createdAt: now, updatedAt: now };
const wrap = (id, configured = true) => ({ id, kind: 'webhook', revision: 1, generation: 'g1', createdAt: now, updatedAt: now, data: { id, eventName: id === 'drone' ? 'drone.error' : 'motor.sample', url: `https://${id}.example.com/receiver`, enabled: true, signingConfigured: configured, auth: { type: 'none' } } });
async function run(browser, name, width, height) {
 const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
 await context.addCookies([{ name: 'auth_token', value: 'Bearer synthetic-account-token', url: origin }]);
 const hooks = [wrap('motor'), wrap('drone'), wrap('legacy', false)];
 let mutations = 0, verificationOutage = false, conflict = false;
 await context.route('**/*', async route => {
  const req = route.request(), u = new URL(req.url());
  if (u.origin === origin) return route.continue();
  const reply = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body), headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
  if (req.method() === 'OPTIONS') return route.fulfill({ status: 204 });
  if (u.hostname === 'api.plotune.net') return reply(u.pathname === '/auth/validate' ? { valid: true, username: 'Fixture owner' } : { user_id: 'o', username: 'Fixture owner', email: 'owner@example.test', full_name: 'Fixture Owner' });
  if (u.hostname !== 'stream.plotune.net') return route.fulfill({ status: 204 });
  const parts = u.pathname.split('/').filter(Boolean);
  if (u.pathname === '/v1/projects') return reply({ items: [project] });
  if (parts[1] === 'projects' && parts.length === 3) {
   if (verificationOutage) { verificationOutage = false; return reply({ error: { code: 'service_unavailable', message: 'Synthetic shared-settings outage' } }, 503); }
   return reply({ project, membership: { email: 'owner@example.test', role: 'Owner' } });
  }
  if (parts[3] === 'webhooks') {
   if (req.method() === 'GET') return reply({ items: hooks });
   const input = JSON.parse(req.postData() || '{}');
   if (parts[5] === 'signing-key') {
    mutations++;
    if (conflict) { conflict = false; return reply({ error: { code: 'revision_conflict', message: 'Webhook changed. Refresh shared settings before retrying.' } }, 409); }
    const hook = hooks.find(h => h.id === parts[4]); assert.equal(input.revision, hook.revision); const configured = hook.data.signingConfigured; hook.revision++; hook.data.signingConfigured = true;
    await new Promise(resolve => setTimeout(resolve, 400));
    return reply({ ...hook, signingSecret: secret, previousExpiresAt: configured ? new Date(Date.now() + 86400000).toISOString() : null });
   }
   const hook = wrap(input.data.id); hook.data = { ...input.data, signingConfigured: true }; hooks.push(hook); mutations++;
   return reply({ ...hook, signingSecret: secret }, 201);
  }
  if (u.pathname.endsWith('/webhook-deliveries')) return reply({ items: [
   { id: 'a', eventId: 'event-1', webhookId: 'motor', status: 'delivered', attempts: 1, statusCode: 204, nextAt: '2026-10-20T00:00:00Z', egress: 'relay' },
   { id: 'b', eventId: 'event-2', webhookId: 'drone', status: 'pending', attempts: 0, statusCode: null, nextAt: '2026-10-20T00:00:00Z', reason: 'relay_daily_budget', egress: 'relay' },
  ] });
  return reply({ items: [] });
 });
 const page = await context.newPage(), errors = [];
 page.on('pageerror', error => errors.push(error.message));
 const shot = (state, fullPage = true) => page.screenshot({ path: path.join(output, `${name}-${state}.png`), fullPage });
 await page.goto(`${origin}/stream/workspace?project=robot-validation&view=webhooks`);
 await page.locator('.st-webhook-row').first().waitFor();
 await shot('list');
 const first = page.locator('.st-webhook-row').first();
 if (before) {
  page.once('dialog', dialog => dialog.accept());
  await first.getByRole('button', { name: 'Rotate signing secret', exact: true }).click();
  await page.getByLabel('Webhook signing secret', { exact: true }).waitFor();
  await shot('secret');
  const evidence = await page.evaluate(() => ({ activeElement: document.activeElement?.outerHTML.slice(0, 240), authColor: getComputedStyle(document.querySelector('.st-webhook-auth')).color, authFont: getComputedStyle(document.querySelector('.st-webhook-auth')).fontSize }));
  await fs.writeFile(path.join(output, `${name}-evidence.json`), JSON.stringify(evidence, null, 2));
 } else {
  await verifyAfter({ page, first, shot, hooks, context, mutations: () => mutations, setConflict: () => { conflict = true; }, setOutage: () => { verificationOutage = true; } });
 }
 assert.deepEqual(errors, []);
 await context.close();
}
async function verifyAfter({ page, first, shot, context, mutations, setConflict, setOutage }) {
 await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
 const summary = first.locator('.live-hook-signing summary');
 assert.equal(await summary.locator('..').getAttribute('open'), null, 'Rotation starts disclosed');
 await summary.focus(); await page.keyboard.press('Enter');
 await first.getByRole('button', { name: 'Cancel', exact: true }).waitFor();
 await shot('rotation');
 await page.keyboard.press('Escape');
 assert(await summary.evaluate(element => element === document.activeElement));
 assert.equal(mutations(), 0, 'Opening/cancelling rotation has no side effect');
 await summary.click(); setConflict();
 await first.getByRole('button', { name: 'Create new secret', exact: true }).click();
 await first.getByRole('alert').waitFor();
 await shot('conflict');
 await first.getByRole('button', { name: 'Cancel', exact: true }).click();
 await summary.click(); setOutage();
 await first.getByRole('button', { name: 'Create new secret', exact: true }).click();
 await first.getByRole('button', { name: 'Creating secret…', exact: true }).waitFor();
 await shot('saving');
 await page.getByLabel('Webhook signing secret', { exact: true }).waitFor();
 await page.waitForFunction(() => document.activeElement === document.querySelector('.live-webhook-secret h2 span'));
 assert((await page.locator('.live-webhook-secret').innerText()).includes('motor.sample'));
 assert((await page.locator('.live-webhook-secret').innerText()).includes('https://motor.example.com/receiver'));
 assert(await page.getByRole('button', { name: 'Add webhook', exact: true }).isDisabled());
 assert((await page.locator('.live-webhook-secret').boundingBox()).y < 300, 'Next step brought into view');
 assert.equal(await page.getByLabel('Webhook signing secret', { exact: true }).inputValue(), secret);
 assert(!(await page.evaluate(() => JSON.stringify({ local: localStorage, session: sessionStorage }))).includes(secret));
 const copy = page.getByRole('button', { name: 'Copy signing secret', exact: true });
 assert((await copy.getAttribute('class')).includes('sw-primary'));
 await copy.click(); await page.getByRole('button', { name: 'Copied', exact: true }).waitFor();
 assert.equal(await page.evaluate(() => navigator.clipboard.readText()), secret);
 await page.getByRole('button', { name: 'Show signing secret', exact: true }).click();
 assert.equal(await page.getByLabel('Webhook signing secret', { exact: true }).getAttribute('type'), 'text');
 await page.getByRole('button', { name: 'Hide signing secret', exact: true }).click();
 await shot('secret');
 await shot('secret-viewport', false);
 await qualityChecks(page);
 await page.locator('.live-hook-verification summary').click(); await shot('verification');
 await page.getByRole('button', { name: 'Refresh shared settings', exact: true }).click();
 await page.waitForFunction(() => ![...document.querySelectorAll('button')].find(button => button.textContent === 'Refresh shared settings')?.disabled);
 assert.equal(await page.getByLabel('Webhook signing secret', { exact: true }).inputValue(), secret);
 await page.getByRole('button', { name: 'I saved the secret', exact: true }).click();
 await page.waitForFunction(() => document.activeElement === document.querySelector('.st-webhook-row .live-hook-signing summary'));
 const done = page.locator('.live-hook-deliveries tbody tr').first();
 assert((await done.innerText()).includes('Delivered')); assert.equal(await done.locator('time').count(), 0, 'Terminal reports show no future retry');
 assert((await page.locator('.live-hook-deliveries tbody tr').nth(1).innerText()).includes('Waiting for daily limit reset'));
 const setup = page.getByRole('button', { name: 'Set up signing', exact: true });
 await setup.click(); await page.getByLabel('Webhook signing secret', { exact: true }).waitFor();
 await page.waitForFunction(() => document.activeElement === document.querySelector('.live-webhook-secret h2 span'));
 assert((await page.locator('.live-webhook-secret').innerText()).includes('legacy.example.com'));
 await shot('setup');
 await page.getByRole('button', { name: 'I saved the secret', exact: true }).click();
 await page.waitForFunction(() => document.activeElement === document.querySelectorAll('.st-webhook-row .live-hook-signing summary')[2]);
 await page.getByRole('button', { name: 'Add webhook', exact: true }).click();
 await page.getByLabel('Custom event name', { exact: true }).fill('test.failed');
 await page.getByLabel('Webhook URL', { exact: true }).fill('https://automation.example.com/' + 'long-destination-'.repeat(18));
 setOutage();
 await page.getByRole('dialog').getByRole('button', { name: 'Add webhook', exact: true }).click();
 await page.waitForFunction(() => document.activeElement === document.querySelector('.live-webhook-secret h2 span'));
 assert((await page.locator('.live-webhook-secret').innerText()).includes('test.failed'));
 const destination = page.locator('.live-hook-destination');
 assert.equal(await destination.getAttribute('open'), null);
 const saveAction = await page.getByRole('button', { name: 'Copy signing secret', exact: true }).boundingBox();
 assert(saveAction.y + saveAction.height <= page.viewportSize().height, 'Long URLs keep the primary save action in view');
 await shot('created-long-url'); await qualityChecks(page);
 await destination.locator('summary').focus(); await page.keyboard.press('Enter');
 assert((await destination.innerText()).includes('long-destination-'.repeat(18)));
 await shot('destination-expanded'); await qualityChecks(page);
 for (const view of ['API setup', 'Webhooks']) {
  const menu = page.getByRole('button', { name: 'Open workspace navigation', exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('navigation', { name: 'Workspace navigation', exact: true }).getByRole('button', { name: view, exact: true }).click();
  await page.getByRole('heading', { name: view, exact: true, level: 1 }).waitFor();
 }
 assert.equal(await page.getByLabel('Webhook signing secret', { exact: true }).inputValue(), secret, 'Same-project navigation retains the one-time response');
 await page.getByRole('button', { name: 'I saved the secret', exact: true }).click();
 await page.waitForFunction(() => document.activeElement?.textContent?.includes('Add webhook'));
 await page.getByRole('button', { name: 'Refresh shared settings', exact: true }).click();
 await page.waitForFunction(() => document.querySelectorAll('.st-webhook-row').length === 4);
 assert.equal(await page.locator('.st-webhook-row').count(), 4);
}
async function qualityChecks(page) {
 const result = await page.evaluate(() => {
  const region = document.querySelector('.live-webhook-secret');
  const targets = [...region.querySelectorAll('button, input, summary')].map(element => ({ name: element.getAttribute('aria-label') || element.textContent.trim(), rect: element.getBoundingClientRect().toJSON() }));
  return { overflow: document.documentElement.scrollWidth > innerWidth, width: innerWidth, targets, colors: [...region.querySelectorAll('p, label, summary')].map(element => ({ text: element.textContent.slice(0, 60), color: getComputedStyle(element).color, size: parseFloat(getComputedStyle(element).fontSize) })) };
 });
 assert(!result.overflow, 'No horizontal page overflow');
 for (const target of result.targets) {
  assert(target.rect.height >= 44, `44px target: ${target.name}`);
  assert(target.rect.x >= 0 && target.rect.right <= result.width, `Unclipped target: ${target.name}`);
 }
 const luminance = rgb => rgb.map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
 for (const item of result.colors) {
  const rgb = item.color.match(/[\d.]+/g).slice(0, 3).map(Number), contrast = 1.05 / (luminance(rgb) + .05);
  assert(contrast >= 4.5, `Text contrast ${contrast.toFixed(2)}: ${item.text}`);
  assert(item.size >= 12, `Readable helper text: ${item.text}`);
 }
}
(async () => {
 await fs.mkdir(output, { recursive: true });
 const browser = await chromium.launch({ headless: true });
 try { for (const args of [['desktop', 1440, 1000], ['tablet', 768, 1024], ['mobile', 390, 844], ['narrow', 320, 740]]) await run(browser, ...args); }
 finally { await browser.close(); }
 console.log(`PASS: ${before ? 'before evidence' : 'webhook UX checks'} at 1440, 768, 390 and 320px; ${output}`);
})().catch(error => { console.error(error); process.exitCode = 1; });
