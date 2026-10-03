const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const build = path.resolve(__dirname, '../build');
const { version, pages } = JSON.parse(fs.readFileSync(path.join(build, 'agent-content.json')));
assert.equal(version, 1);
const paths = new Set(pages.map(page => page.path));
assert.equal(paths.size, pages.length);
for (const page of pages) {
  assert(!/^\/(dashboard|profile|login|register|streams|storage|mirror|embed|dns|partner-portal)(\/|$)/.test(page.path), page.path);
  assert(page.markdown.startsWith('# '), page.path);
  assert(!/\]\(https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/|\))/.test(page.markdown), `${page.path}: preview link leaked into export`);
  assert(page.markdown.length > 200, page.path);
  const file = path.join(build, new URL(page.markdownUrl).pathname);
  assert(fs.readFileSync(file, 'utf8').includes(`Source: ${page.url}`), page.path);
  assert(fs.existsSync(path.join(build, page.path, 'index.html')), page.path);
}
for (const file of fs.readdirSync(path.resolve(__dirname, '../src/research/articles'))) {
  if (!file.endsWith('.mdx')) continue;
  const { data } = matter(fs.readFileSync(path.resolve(__dirname, '../src/research/articles', file), 'utf8'));
  const page = pages.find(page => page.path === `/research/articles/${data.slug}`);
  assert(page, data.slug);
  assert(page.markdown.includes(new Date(data.publishedAt).toISOString().slice(0, 10)), `${data.slug}: publication date`);
}
const docsSource = fs.readFileSync(path.resolve(__dirname, '../src/content/nexusDocs.js'), 'utf8');
for (const [, slug] of docsSource.matchAll(/slug: '([^']+)'/g)) assert(paths.has(`/docs/nexus/${slug}`), slug);
const reference = pages.find(page => page.path === '/docs/nexus/mcp-api').markdown;
assert(reference.includes('```'), 'API code examples');
assert(reference.includes('| ---'), 'API tables');
assert(reference.includes('https://nexus.plotune.net/devices/'), 'API endpoint');
assert(pages.find(page => page.path === '/faq').markdown.includes('Custom message types need a ROS-side bridge'), 'Collapsed FAQ limitations');
const llms = fs.readFileSync(path.join(build, 'llms.txt'), 'utf8');
assert(llms.startsWith('# Plotune\n\n> '));
for (const [, url] of llms.matchAll(/\]\((https:\/\/www\.plotune\.net[^)]+)\)/g)) assert(fs.existsSync(path.join(build, new URL(url).pathname)), url);
for (const page of pages) assert(llms.includes(page.markdownUrl), page.path);
assert(fs.readFileSync(path.join(build, 'llms-full.txt'), 'utf8').includes(reference));
console.log(`Verified ${pages.length} public sources, Markdown exports, llms indexes, API examples, dates, and FAQ qualifications.`);
