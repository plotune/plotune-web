// Visual QA for C02: the consent opt-ins (Owner and Member), the create-project dialog below
// and at the plan's limit, and the role guide in Settings. Every non-local request is mocked.
// Usage (dev server with REACT_APP_STREAM_WORKSPACE_ENABLED=true on :3000):
//   node scripts/stream/admin-qa.cjs docs/redesign/evidence/stream-admin
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const out = process.argv[2] || 'docs/redesign/evidence/stream-admin';
fs.mkdirSync(out, { recursive: true });
const origin = 'http://localhost:3000', now = new Date().toISOString();
const project = { id: 'robot-validation', name: 'Robot validation', ownerId: 'o', revision: 2, keyPrefix: 'plt_demo', createdAt: now, updatedAt: now };
const members = [{ email: 'user@example.test', role: 'Owner' }, { email: 'carol@example.test', role: 'Admin' }, { email: 'bob@example.test', role: 'Member' }];

async function run(browser, device, width, height, role, owned) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  await context.addCookies([{ name: 'auth_token', value: 'Bearer synthetic-account-token', url: origin }]);
  let consent = null;
  await context.route('**/*', async (route) => {
    const req = route.request(), u = new URL(req.url());
    if (u.origin === origin) return route.continue();
    const respond = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data), headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
    if (req.method() === 'OPTIONS') return respond({}, 204);
    if (u.hostname === 'api.plotune.net') return respond(u.pathname === '/auth/validate' ? { valid: true, username: 'Fixture user' } : { user_id: 'o', username: 'Fixture user', email: 'user@example.test', full_name: 'Fixture User' });
    if (u.hostname !== 'stream.plotune.net') return route.fulfill({ status: 204, body: '' });
    const p = u.pathname, parts = p.split('/').filter(Boolean);
    if (p === '/oauth/authorize/context') return respond({ request: { clientId: 'client-1', name: 'Claude', redirect: 'https://claude.ai/api/mcp/auth_callback', scope: ['events:read', 'context:read', 'catalog:write', 'projects:write'] },
      projects: [{ id: project.id, name: project.name, role }], expiresAt: now });
    if (p === '/oauth/authorize/consent') { consent = JSON.parse(req.postData()); return respond({ redirectTo: `${origin}/stream/workspace` }); }
    if (parts[1] === 'data') return respond({ items: [], nextCursor: null, now, snapshot: 1, ids: [], cursor: '0', reset: false, eventNames: [], properties: [], deviceIds: [], sessionIds: [], truncated: false });
    if (p === '/v1/projects') return respond({ items: [project], plan: { plan: 'free', projectLimit: 2, ownedProjects: owned } });
    if (parts.length === 3) return respond({ project, membership: { email: 'user@example.test', role } });
    if (parts[3] === 'members') return respond({ items: members });
    return respond({ items: [] });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const shot = (name) => page.screenshot({ path: path.join(out, `${device}-${role.toLowerCase()}-${name}.png`), fullPage: true });
  const result = { device, role, owned, errors };

  await page.goto(`${origin}/stream/authorize?request=synthetic.request`);
  await page.getByText('Requested access').waitFor({ timeout: 60000 });
  result.writeBoxes = await page.locator('.stream-authorize__write input').count();
  await shot('consent');
  await page.getByRole('button', { name: 'Approve and continue' }).click();
  await page.waitForTimeout(500);
  result.consentWrites = consent?.allowWrites;

  await page.goto(`${origin}/stream/workspace?project=${project.id}&view=settings`);
  await page.getByText('What can each role do?').first().waitFor({ timeout: 60000 });
  await page.getByText('What can each role do?').first().click();
  await shot('roles');
  if (role === 'Owner') {
    if (device === 'mobile') await page.getByRole('button', { name: /menu|navigation/i }).first().click().catch(() => {});
    await page.getByRole('button', { name: 'Create project' }).first().click();
    await page.getByText('Create a project').waitFor();
    result.atLimit = await page.getByText(/Your Free plan includes 2 projects/).count() === 1;
    await shot(owned >= 2 ? 'create-at-limit' : 'create');
  }
  result.overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  await context.close();
  return result;
}
(async () => {
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const report = [];
  for (const [device, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    report.push(await run(browser, device, w, h, 'Owner', 1));
    report.push(await run(browser, device, w, h, 'Owner', 2));
    report.push(await run(browser, device, w, h, 'Member', 0));
  }
  await browser.close();
  console.log(JSON.stringify(report, null, 1));
})();
