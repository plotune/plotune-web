/* Safe account and Stream UI checks. All remote API calls and WebSockets use local fixtures. */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { fixtures } = require('./browser.cjs');

const BASE = process.env.QA_BASE || 'http://localhost:4184';
const OUT = path.resolve('docs/redesign/evidence/account-interactions');
fs.mkdirSync(OUT, { recursive: true });
const report = { base: BASE, checks: [], captured: [], mockedWrites: [], webSockets: [] };
const record = (name, ok, detail = '') => report.checks.push({ name, ok: !!ok, detail });
const save = async (page, name) => {
  const file = `${name}.png`;
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(OUT, file), fullPage: true });
  report.captured.push(file);
};

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
  await fixtures(context, false);
  context.routeWebSocket('wss://stream.plotune.net/**', ws => {
    report.webSockets.push('intercepted');
    ws.close({ code: 1000, reason: 'Local QA fixture; no production connection' });
  });
  context.route('**/*', async route => {
    const u = new URL(route.request().url());
    if (!['api.plotune.net', 'stream.plotune.net'].includes(u.hostname)) return route.fallback();
    const method = route.request().method();
    report.mockedWrites.push({ method, path: u.pathname });
    if (u.hostname === 'api.plotune.net' && method === 'PUT' && u.pathname === '/profile') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
    if (u.hostname === 'api.plotune.net' && ['/user/stats', '/s3/user/files', '/s3/user/total_usage'].includes(u.pathname)) {
      return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ detail: 'Local QA backend unavailable' }) });
    }
    return route.fallback();
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
  await save(page, 'login-empty');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  record('login required-field validation', await page.locator('[aria-invalid="true"]').count() > 0 || await page.getByText(/required|enter/i).count() > 0);
  await save(page, 'login-validation');
  await page.goto(`${BASE}/register`, { waitUntil: 'domcontentloaded' });
  await save(page, 'registration-empty');
  await page.getByRole('button', { name: /create account|register/i }).first().click();
  record('registration required-field validation', await page.locator('[aria-invalid="true"]').count() > 0 || await page.getByText(/required|must|agree/i).count() > 0);
  await save(page, 'registration-validation');

  await page.goto(`${BASE}/reset-password`, { waitUntil: 'domcontentloaded' });
  await save(page, 'password-reset-email');
  await page.getByRole('button', { name: /send|continue|reset/i }).first().click();
  record('password reset rejects invalid email', await page.getByText(/required|invalid email/i).count() > 0 || await page.locator('[aria-invalid="true"]').count() > 0);
  await page.locator('input[type="email"]').first().fill('qa@example.test');
  await page.getByRole('button', { name: /send|continue|reset/i }).first().click();
  await page.getByRole('heading', { name: 'Enter Verification Code' }).waitFor({ timeout: 8000 });
  record('password reset mocked email step advances to code', true, 'API request was intercepted; no email was sent.');
  await save(page, 'password-reset-code');
  await page.getByRole('button', { name: /verify|continue/i }).first().click();
  record('password reset rejects malformed code', await page.getByText(/9 digits|required/i).count() > 0);
  await save(page, 'password-reset-code-validation');

  await context.addCookies([{ name: 'auth_token', value: 'qa-local-fixture', url: BASE }]);
  await page.goto(`${BASE}/profile`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Profile Information' }).waitFor({ timeout: 8000 });
  await save(page, 'profile-view');
  await page.getByRole('button', { name: 'Edit Profile' }).click();
  const editField = page.locator('input').nth(2);
  await editField.fill('Alex QA Engineer');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await page.getByText('Profile updated successfully').waitFor({ timeout: 5000 }).catch(() => {});
  record('profile edit saves through mocked PUT', report.mockedWrites.some(x => x.method === 'PUT' && x.path === '/profile'));
  await save(page, 'profile-saved');

  for (const route of ['/dashboard', '/streams', '/streams/connect', '/mirror', '/storage']) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/stream/workspace');
    await page.getByRole('heading', { name: 'Create your first project', exact: true }).waitFor();
    record(`${route} opens the workspace`, new URL(page.url()).pathname === '/stream/workspace');
  }
  await save(page, 'retired-routes-workspace');

  record('no uncaught page errors', errors.length === 0, errors.join(' | '));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(report, null, 2));
  process.exitCode = report.checks.every(c => c.ok) ? 0 : 1;
  await context.close(); await browser.close();
  console.log(`${report.checks.filter(x => x.ok).length}/${report.checks.length} checks passed; ${report.captured.length} screenshots captured; ${report.webSockets.length} WebSockets intercepted`);
})().catch(async error => {
  report.fatal = error.stack || String(error);
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(report, null, 2));
  console.error(error);
  process.exitCode = 1;
});
