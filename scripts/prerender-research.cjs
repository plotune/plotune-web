// GitHub Pages serves a byte-identical empty shell (<div id="root"></div> plus a
// script tag) at every route -- generate-static-routes.cjs fixes the HTTP status
// (200 instead of 404) for deep links, but the actual content still only exists
// after React runs. Any tool that fetches a URL without executing JavaScript --
// GPTBot, ClaudeBot, CCBot, most "fetch this page" tools inside AI assistants,
// curl -- gets nothing page-specific from any route on this site, including the
// research articles this section exists to get read and cited.
//
// This script closes that gap for the highest-priority section (Research, per
// explicit product direction) by actually rendering each route in a real browser
// at build time and saving that rendered HTML as the static file, so a plain GET
// returns the real article/page content with no JavaScript required. React still
// boots normally on top of it for real visitors (src/index.js uses
// ReactDOM.createRoot().render(), a full client render, not hydrateRoot(), so
// there is no hydration-mismatch risk from prerendered markup differing slightly
// from the first client render).
//
// Scope: research articles + the research nav pages (overview/reports/
// methodology) + FAQ (its FAQPage JSON-LD already exists in code but was
// equally invisible pre-render). Solutions/Nexus/etc. are unprerendered shims
// for now -- extend the `routes` list below if that scope grows later.
const fs = require('fs');
const path = require('path');
const http = require('http');
const matter = require('gray-matter');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const PORT = 4174;

// Every scroll-reveal animation on the site (framer-motion's useInView) starts
// elements at opacity:0 until an IntersectionObserver reports them on-screen.
// A build-time render has no real scroll, so without this every such section
// would freeze into the prerendered HTML invisible -- a real regression for
// first paint, not just a discoverability non-issue. Forcing every observed
// element to instantly report "in view" makes the snapshot show the fully
// settled page, matching what a visitor sees once scrolled to it anyway.
const forceInView = () => {
  class AlwaysInView {
    constructor(cb) { this.cb = cb; }
    observe(target) { this.cb([{ isIntersecting: true, target, intersectionRatio: 1 }], this); }
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
  window.IntersectionObserver = AlwaysInView;
};

const articlesDir = path.join(root, 'src/research/articles');
const routes = ['/research', '/research/reports', '/research/methodology', '/faq'];
fs.readdirSync(articlesDir)
  .filter((file) => file.endsWith('.mdx'))
  .forEach((file) => {
    const { data } = matter(fs.readFileSync(path.join(articlesDir, file), 'utf8'));
    if (data.slug) routes.push(`/research/articles/${data.slug}`);
  });

const serveStatic = () =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = req.url.split('?')[0];
      let filePath = path.join(buildDir, decodeURIComponent(urlPath));
      if (urlPath.endsWith('/') || !path.extname(filePath)) {
        filePath = path.join(filePath, 'index.html');
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          fs.readFile(path.join(buildDir, 'index.html'), (fallbackErr, fallbackData) => {
            if (fallbackErr) { res.writeHead(404); res.end('Not found'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fallbackData);
          });
          return;
        }
        const ext = path.extname(filePath);
        const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
        res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(PORT, () => resolve(server));
  });

(async () => {
  if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
    console.error('prerender-research: build/index.html not found -- run the build first.');
    process.exit(1);
  }

  const server = await serveStatic();
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(forceInView);

  let done = 0;
  for (const route of routes) {
    const page = await context.newPage();
    try {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      // MDX articles and chart data load as a separate async chunk after the
      // route itself resolves; wait for that real content instead of a fixed
      // delay, since article length varies a lot.
      await page.waitForFunction(() => document.body.innerText.trim().length > 300, { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(500);

      const html = await page.content();
      const outPath = path.join(buildDir, route.replace(/^\//, ''), 'index.html');
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, `<!DOCTYPE html>\n${html}`);
      done += 1;
    } catch (err) {
      console.error(`prerender-research: FAILED ${route}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log(`prerender-research: rendered ${done}/${routes.length} routes into build/.`);
})();
