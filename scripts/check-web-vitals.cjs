// Lab-measured Core Web Vitals (FCP/LCP/CLS/TTFB) for a set of routes, run
// against the already-built build/ directory. This exists because real field
// data (PostHog Web Analytics) takes days to accumulate, and PageSpeed
// Insights/Lighthouse CLI are unavailable in some sandboxed environments --
// this script gets equivalent numbers immediately, using the same
// PerformanceObserver APIs Lighthouse itself reads, with Chrome DevTools
// Protocol throttling approximating Lighthouse's default mobile "simulated
// throttling" profile (150ms RTT, 1.6Mbps down / 750Kbps up, 4x CPU
// slowdown).
//
// Usage:
//   npm run build              # must run first -- this script does not build
//   node scripts/check-web-vitals.cjs                  # checks the default page set below
//   node scripts/check-web-vitals.cjs /nexus /about     # checks only the given routes
//
// Exits 1 (and lists the offending pages) if any page has a POOR metric, so
// it can be used as a pre-deploy gate; exits 0 otherwise. Thresholds are
// Google's official Core Web Vitals Good/Needs Improvement/Poor bands.
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const PORT = 4196;

// A cross-section of direct landing destinations: nav/ad/search traffic lands
// here without a prior in-app navigation, so these are the routes where a
// cold first paint (and any Suspense-fallback flash) actually shows up.
// Extend this list as new landing pages are added.
const DEFAULT_PAGES = [
  '/',
  '/nexus',
  '/nexus/connectivity',
  '/nexus/stream',
  '/nexus/use-cases',
  '/solutions/agentic-test-development',
  '/research',
  '/contact',
  '/faq',
  '/about',
  '/download',
];

const THRESHOLDS = {
  fcp: { good: 1800, poor: 3000 },
  lcp: { good: 2500, poor: 4000 },
  cls: { good: 0.1, poor: 0.25 },
};

const rate = (value, { good, poor }) =>
  value == null ? 'N/A' : value <= good ? 'GOOD' : value <= poor ? 'NEEDS IMPROVEMENT' : 'POOR';

const findFirstResearchArticle = () => {
  const articlesDir = path.join(root, 'src/research/articles');
  const matter = require('gray-matter');
  const file = fs.readdirSync(articlesDir).find((f) => f.endsWith('.mdx'));
  if (!file) return null;
  const { data } = matter(fs.readFileSync(path.join(articlesDir, file), 'utf8'));
  return data.slug ? `/research/articles/${data.slug}` : null;
};

const serveStatic = () =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = req.url.split('?')[0];
      let filePath = path.join(buildDir, decodeURIComponent(urlPath));
      if (urlPath.endsWith('/') || !path.extname(filePath)) filePath = path.join(filePath, 'index.html');
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        const ext = path.extname(filePath);
        const types = {
          '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
          '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
        };
        res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(PORT, () => resolve(server));
  });

const measure = async (browser, routePath) => {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
  });
  const client = await page.context().newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8,
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.addInitScript(() => {
    window.__vitals = { cls: 0, lcp: null, fcp: null };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__vitals.cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) window.__vitals.lcp = last.renderTime || last.loadTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (e.name === 'first-contentful-paint') window.__vitals.fcp = e.startTime;
    }).observe({ type: 'paint', buffered: true });
  });

  let result;
  try {
    await page.goto(`http://localhost:${PORT}${routePath}`, { waitUntil: 'networkidle', timeout: 60000 });
    const nav = await page.evaluate(() => {
      const n = performance.getEntriesByType('navigation')[0];
      return n ? { ttfb: n.responseStart } : null;
    });
    await page.waitForTimeout(2000);
    const v = await page.evaluate(() => window.__vitals);
    result = { route: routePath, ttfb: nav?.ttfb ?? null, fcp: v.fcp, lcp: v.lcp, cls: v.cls, error: null };
  } catch (err) {
    result = { route: routePath, ttfb: null, fcp: null, lcp: null, cls: null, error: err.message };
  } finally {
    await page.close();
  }
  return result;
};

(async () => {
  if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
    console.error('check-web-vitals: build/index.html not found -- run `npm run build` first.');
    process.exit(1);
  }

  const cliRoutes = process.argv.slice(2);
  let pages = cliRoutes.length > 0 ? cliRoutes : DEFAULT_PAGES;
  if (cliRoutes.length === 0) {
    const article = findFirstResearchArticle();
    if (article) pages = [...pages, article];
  }

  const server = await serveStatic();
  const browser = await chromium.launch();
  const results = [];
  for (const routePath of pages) {
    results.push(await measure(browser, routePath));
  }
  await browser.close();
  server.close();

  console.log('\nRoute'.padEnd(48) + 'TTFB'.padEnd(9) + 'FCP'.padEnd(22) + 'LCP'.padEnd(22) + 'CLS'.padEnd(20));
  console.log('-'.repeat(120));

  let anyPoor = false;
  for (const r of results) {
    if (r.error) {
      console.log(`${r.route.padEnd(48)}ERROR: ${r.error}`);
      anyPoor = true;
      continue;
    }
    const fcpRate = rate(r.fcp, THRESHOLDS.fcp);
    const lcpRate = rate(r.lcp, THRESHOLDS.lcp);
    const clsRate = rate(r.cls, THRESHOLDS.cls);
    if ([fcpRate, lcpRate, clsRate].includes('POOR')) anyPoor = true;

    const fmt = (ms) => (ms == null ? 'n/a' : `${Math.round(ms)}ms`);
    console.log(
      r.route.padEnd(48) +
      `${fmt(r.ttfb)}`.padEnd(9) +
      `${fmt(r.fcp)} (${fcpRate})`.padEnd(22) +
      `${fmt(r.lcp)} (${lcpRate})`.padEnd(22) +
      `${r.cls.toFixed(4)} (${clsRate})`.padEnd(20)
    );
  }

  console.log('');
  if (anyPoor) {
    console.error('check-web-vitals: one or more pages have a POOR metric or failed to load.');
    process.exit(1);
  }
  console.log('check-web-vitals: all pages within GOOD/NEEDS IMPROVEMENT thresholds.');
})();
