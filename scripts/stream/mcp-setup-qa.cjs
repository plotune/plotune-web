// Usage (dev server with REACT_APP_STREAM_WORKSPACE_ENABLED=true on :3000):
//   node scripts/stream/mcp-setup-qa.cjs after docs/redesign/evidence/stream-mcp-setup/after
// Visual QA for /stream/workspace?view=mcp. Every non-local request is mocked.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const phase = process.argv[2], out = process.argv[3];
fs.mkdirSync(out, { recursive: true });
const origin = 'http://localhost:3000', now = new Date().toISOString();
const project = { id: 'robot-validation', name: 'Robot validation', ownerId: 'o', revision: 1, keyPrefix: 'plt_demo', createdAt: now, updatedAt: now };
(async () => {
  const browser = await chromium.launch({ ...(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {}) });
  const report = [];
  for (const [device, width, height] of [['desktop', 1440, 1000], ['tablet', 768, 1024], ['mobile', 390, 844], ['small-mobile', 320, 740]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
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
      if (parts[0] === 'v1' && parts[1] === 'projects' && parts.length === 3) return respond({ project, membership: { email: 'owner@example.test', role: 'Owner' } });
      if (parts[1] === 'projects' && parts[3] === 'members') return respond({ items: [{ email: 'owner@example.test', role: 'Owner' }] });
      if (parts[1] === 'projects') return respond({ items: [] });
      if (parts[1] === 'data') {
        const endpoint = parts.slice(4).join('/');
        if (endpoint === 'usage') return respond({ month: '2026-10', accepted: 110, allowance: 30000, day: '2026-10-19', acceptedToday: 110, dailyAllowance: 2000, scope: 'project-owner-account' });
        if (endpoint === 'discovery') return respond({ eventNames: ['motor.sample'], properties: [], deviceIds: [], sessionIds: [], truncated: false });
        if (endpoint === 'realtime') return respond({ ids: [], cursor: '1', reset: false });
        return respond({ items: [], nextCursor: null, now, snapshot: 1 });
      }
      return respond({});
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`${origin}/stream/workspace?project=robot-validation&view=mcp`);
    await page.getByText(phase === 'after' ? 'Connect your AI client' : 'MCP connection').first().waitFor({ timeout: 30000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(out, `${device}-mcp.png`), fullPage: true });
    const metrics = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth,
      smallTargets: [...document.querySelectorAll('main button, main summary, main [role="tab"]')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height < 40; }).map((e) => e.textContent.trim()).slice(0, 8) }));
    if (phase === 'after') {
      await page.locator('#mcp-tab-vscode').click();
      await page.screenshot({ path: path.join(out, `${device}-mcp-vscode.png`), fullPage: true });
      await page.locator('summary', { hasText: 'Use a project key instead' }).click();
      await page.screenshot({ path: path.join(out, `${device}-mcp-key-open.png`), fullPage: true });
    }
    report.push({ device, errors, ...metrics });
    await context.close();
  }
  await browser.close();
  console.log(JSON.stringify(report, null, 1));
})();
