/* Local browser fixtures only. No production accounts or APIs are contacted. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const origin = process.env.STREAM_QA_ORIGIN || 'http://localhost:3000';
const output = process.env.STREAM_QA_OUTPUT || '/tmp/plotune-entry-routes';
const retired = ['/dashboard', '/streams', '/streams/connect', '/mirror', '/storage'];

async function main() {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [device, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      for (const authenticated of [false, true]) {
        const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
        try {
          if (authenticated) await context.addCookies([{ name: 'auth_token', value: 'Bearer synthetic-account-token', url: origin }]);
          const unexpected = [];
          await context.route('**/*', async (route) => {
            const request = route.request();
            const url = new URL(request.url());
            if (url.origin === origin) return route.continue();
            const respond = (data, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data), headers: { 'Access-Control-Allow-Origin': origin } });
            if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': origin } });
            if (url.hostname === 'api.plotune.net') {
              if (url.pathname === '/auth/validate') return respond({ valid: true, username: 'Fixture owner' });
              if (url.pathname === '/profile') return respond({ user_id: 'owner-fixture', username: 'Fixture owner', email: 'owner@example.test', full_name: 'Fixture Owner' });
              if (url.pathname === '/login') return respond({ access_token: 'synthetic-account-token', token_type: 'Bearer' });
              unexpected.push(url.pathname);
              return respond({ error: { code: 'unsupported', message: 'Unexpected account request' } }, 503);
            }
            if (url.hostname === 'stream.plotune.net') {
              if (url.pathname === '/v1/projects') return respond({ items: [] });
              unexpected.push(url.pathname);
              return respond({ error: { code: 'unsupported', message: 'Unexpected Stream request' } }, 503);
            }
            return route.abort();
          });
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', (error) => errors.push(error.message));
          for (const retiredPath of retired) {
            for (const suffix of ['', '/']) {
              await page.goto(`${origin}${retiredPath}${suffix}?stream=retired&token=not-forwarded`);
              await page.waitForURL(`${origin}/stream/workspace`);
              await page.getByRole('heading', { name: authenticated ? 'Create your first project' : 'Open your Stream workspace', exact: true }).waitFor();
              assert.equal(new URL(page.url()).search, '', 'Old identifiers and credentials must not be forwarded');
              assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
            }
          }
          await page.screenshot({ path: path.join(output, `redirect-${authenticated ? 'signed-in' : 'signed-out'}-${device}.png`), fullPage: true });
          if (authenticated) {
            await page.goto(`${origin}/`);
            if (device === 'mobile') await page.getByRole('button', { name: 'Open main navigation', exact: true }).click();
            await page.getByRole('link', { name: 'Workspace', exact: true }).waitFor({ state: 'attached' });
            for (const retiredPath of retired) assert.equal(await page.locator(`header a[href="${retiredPath}"]`).count(), 0);
            await page.screenshot({ path: path.join(output, `navigation-${device}.png`), fullPage: false });
            await page.goto(`${origin}/research`);
            if (device === 'mobile') await page.getByRole('button', { name: 'Menu', exact: true }).click();
            await page.getByRole('link', { name: 'Workspace', exact: true }).waitFor({ state: 'attached' });
          } else {
            await page.goto(`${origin}/login`);
            await page.locator('#login-username').fill('fixture-owner');
            await page.locator('#login-password').fill('SyntheticOnly123!');
            await page.getByRole('button', { name: 'Login', exact: true }).click();
            await page.waitForURL(`${origin}/stream/workspace`);
            await page.getByRole('heading', { name: 'Create your first project', exact: true }).waitFor();
          }
          assert.deepEqual(unexpected, [], 'Retired pages must not request their unsupported APIs');
          assert.deepEqual(errors, []);
          console.log(`PASS: ${device}, ${authenticated ? 'signed in' : 'signed out'} redirects and workspace navigation`);
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
  console.log('PASS: 40 retired-route entries, clean query strings, login destination, active navigation, and no retired API calls.');
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
