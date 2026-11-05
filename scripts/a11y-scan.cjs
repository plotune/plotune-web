#!/usr/bin/env node
// Accessibility scan of every public route with axe-core, in a real browser.
//
//   npm run build   (or: npx craco build)
//   npm run a11y
//
// It serves ./build locally, opens each route from public/sitemap.xml plus the extra routes below,
// at a desktop and a 390 px phone viewport, and runs axe (WCAG 2 A/AA, 2.1 AA and best practices).
// Any violation fails the run unless it is listed in scripts/a11y-allowlist.json with a reason.
// Routes behind a sign-in are scanned in their signed-out state; external redirects are skipped.
//
// Options:  --routes=/a,/b   scan only these routes     --port=4173   fixed port
//           --json=out.json  write every finding        --desktop-only
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v === undefined ? true : v]; }));

// Routes that are not in the sitemap but are real pages. External redirects (blog, community,
// tutorials) are left out on purpose.
const EXTRA = ['/login', '/register', '/reset-password', '/verify-email', '/legal', '/privacy', '/careers', '/partners',
  '/partners/apply', '/dns', '/dashboard', '/profile', '/partner-portal', '/embed', '/ai-readiness', '/stream/demo',
  '/stream/workspace', '/stream/authorize', '/stream/prototypes/vision', '/bridge/authorize', '/research/methodology',
  '/research/reports', '/research/results', '/docs/nexus', '/nexus/use-cases', '/nexus/connectivity', '/contact'];
const SKIP = new Set(['/blog', '/community', '/tutorials']);

const sitemapRoutes = () => {
  try {
    return [...fs.readFileSync(path.join(ROOT, 'public', 'sitemap.xml'), 'utf8').matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
  } catch (e) { return []; }
};
const routes = (args.routes ? args.routes.split(',') : [...new Set([...sitemapRoutes(), ...EXTRA, '/'])])
  .map((r) => (r.length > 1 ? r.replace(/\/$/, '') : r)).filter((r) => !SKIP.has(r)).sort();

const allowlist = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'a11y-allowlist.json'), 'utf8')); } catch (e) { return []; } })();
const allowed = (rule, target, route) => allowlist.some((a) => a.rule === rule && (!a.target || target.includes(a.target)) && (!a.route || a.route === route));

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain', '.xml': 'application/xml', '.mp4': 'video/mp4', '.md': 'text/markdown' };
const serve = () => new Promise((resolve) => {
  const server = http.createServer((req, res) => {
    const clean = decodeURIComponent(req.url.split('?')[0]);
    let file = path.join(BUILD, clean);
    if (!file.startsWith(BUILD)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) file = path.join(BUILD, 'index.html'); // single-page app fallback
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  server.listen(Number(args.port) || 0, '127.0.0.1', () => resolve(server));
});

(async () => {
  if (!fs.existsSync(path.join(BUILD, 'index.html'))) { console.error('No build found. Run `npm run build` (or `npx craco build`) first.'); process.exit(2); }
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const viewports = [{ name: 'desktop', width: 1440, height: 900, mobile: false }, ...(args['desktop-only'] ? [] : [{ name: 'phone', width: 390, height: 800, mobile: true }])];
  const findings = new Map();
  let scanned = 0;
  for (const vp of viewports) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, bypassCSP: true });
    const page = await ctx.newPage();
    for (const route of routes) {
      let ok = false;
      for (let attempt = 0; attempt < 2 && !ok; attempt += 1) {
        try {
          await page.goto(base + route, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(400);
          await page.addScriptTag({ content: AXE });
          const result = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] }, resultTypes: ['violations'] }));
          const finalPath = await page.evaluate(() => location.pathname.replace(/\/$/, '') || '/');
          result.violations.forEach((v) => v.nodes.forEach((n) => {
            const target = (n.target || []).join(' ');
            const key = `${v.id}|${route}|${target}`;
            if (!findings.has(key)) findings.set(key, { rule: v.id, impact: v.impact, route, finalPath, target, message: ((n.any[0] || n.all[0] || n.none[0] || {}).message || v.help).slice(0, 160), viewports: [] });
            findings.get(key).viewports.push(vp.name);
          }));
          scanned += 1; ok = true;
        } catch (e) { if (attempt === 1) console.error(`! could not scan ${route} (${vp.name}): ${e.message.split('\n')[0]}`); }
      }
    }
    await ctx.close();
  }
  await browser.close(); server.close();

  const all = [...findings.values()];
  const failing = all.filter((f) => !allowed(f.rule, f.target, f.route));
  if (args.json) fs.writeFileSync(args.json, JSON.stringify(all, null, 2));
  console.log(`Scanned ${routes.length} routes x ${viewports.length} viewport(s) (${scanned} page loads).`);
  if (!failing.length) { console.log(`No accessibility violations${all.length ? ` (${all.length} allow-listed)` : ''}.`); process.exit(0); }
  const byRule = {};
  failing.forEach((f) => { (byRule[f.rule] = byRule[f.rule] || []).push(f); });
  Object.entries(byRule).forEach(([rule, list]) => {
    console.log(`\n${rule} (${list[0].impact}): ${list.length} element(s)`);
    list.slice(0, 15).forEach((f) => console.log(`  ${f.route}${f.finalPath !== f.route ? ` -> ${f.finalPath}` : ''} [${[...new Set(f.viewports)].join(',')}] ${f.target.slice(0, 90)}\n    ${f.message}`));
    if (list.length > 15) console.log(`  ... ${list.length - 15} more`);
  });
  console.log(`\n${failing.length} violation(s). Fix them, or add a justified entry to scripts/a11y-allowlist.json.`);
  process.exit(1);
})().catch((e) => { console.error(e); process.exit(2); });
