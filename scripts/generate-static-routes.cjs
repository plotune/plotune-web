// GitHub Pages serves this repo as a pure static-file host: any path with no matching
// file 404s at the raw HTTP level, and public/404.html only recovers it inside a real
// browser (it JS-redirects back into the SPA). A non-JS HTTP client -- an RSS reader like
// Feedly, a link-preview unfurler, curl -- never runs that redirect, so every deep link
// this site hands out (research article URLs in rss.xml, solution page CTAs, etc.) reads
// as a dead link to anything that isn't a browser.
//
// The fix: after the build, duplicate build/index.html into a real index.html at each
// known public route, so GitHub Pages serves that route natively with a 200. The SPA then
// boots and client-side-routes to the right page exactly as it already does today.
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const indexHtmlPath = path.join(buildDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('generate-static-routes: build/index.html not found -- run the build first.');
  process.exit(1);
}
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const routes = [
  '/faq', '/extensions', '/download', '/about', '/careers', '/legal', '/docs', '/privacy', '/contact',
  '/nexus', '/nexus/connectivity', '/nexus/stream', '/nexus/use-cases',
  '/solutions/agentic-test-development', '/agentic-test-development',
  '/research', '/research/results', '/research/reports', '/research/methodology',
];

// One route per published research article, read straight from each .mdx file's own
// frontmatter (same source generate-research-rss.cjs uses) rather than the ESM
// src/research/content/articles.js, since this script runs under CommonJS.
const articlesDir = path.join(root, 'src/research/articles');
fs.readdirSync(articlesDir)
  .filter((file) => file.endsWith('.mdx'))
  .forEach((file) => {
    const { data } = matter(fs.readFileSync(path.join(articlesDir, file), 'utf8'));
    if (data.slug) routes.push(`/research/articles/${data.slug}`);
  });

// One route per solution segment (and its legacy alias), extracted from the data file's
// own `slug: '...'` / alias-key text rather than importing the ESM module.
const solutionsSrc = fs.readFileSync(path.join(root, 'src/content/solutions.js'), 'utf8');
[...solutionsSrc.matchAll(/slug: '([^']+)'/g)].forEach(([, slug]) => routes.push(`/solutions/${slug}`));
[...solutionsSrc.matchAll(/^\s*'([a-z0-9-]+)':\s*'[a-z0-9-]+',?$/gm)].forEach(([, aliasSlug]) => routes.push(`/solutions/${aliasSlug}`));

let created = 0;
[...new Set(routes)].forEach((route) => {
  const dir = path.join(buildDir, route.replace(/^\//, ''));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
  created += 1;
});

console.log(`generate-static-routes: wrote ${created} static route shims into build/.`);
