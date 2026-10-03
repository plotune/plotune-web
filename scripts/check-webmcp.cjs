const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const build = path.resolve(__dirname, '../build');
(async () => {
  const server = http.createServer((request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    let file = path.join(build, pathname);
    if (!path.extname(file)) file = path.join(file, 'index.html');
    fs.readFile(file, (error, content) => {
      if (error) { response.writeHead(404); response.end(); return; }
      const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.md': 'text/markdown', '.txt': 'text/plain' };
      response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      response.end(content);
    });
  });
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch();
    for (const surface of ['none', 'document', 'navigator']) {
      const context = await browser.newContext();
      await context.route(/https:\/\//, route => route.abort());
      await context.addInitScript(surface => {
        Object.defineProperty(document, 'modelContext', { configurable: true, value: undefined });
        Object.defineProperty(navigator, 'modelContext', { configurable: true, value: undefined });
        window.testTools = {};
        if (surface !== 'none') Object.defineProperty(surface === 'document' ? document : navigator, 'modelContext', {
          value: { registerTool(tool) { window.testTools[tool.name] = tool; return Promise.resolve(); } },
        });
      }, surface);
      const page = await context.newPage();
      const requests = [];
      page.on('request', request => requests.push(request.url()));
      const origin = `http://127.0.0.1:${server.address().port}`;
      await page.goto(origin + '/docs/nexus/security-model/', { waitUntil: 'networkidle' });
      assert(!requests.some(url => url.endsWith('/agent-content.json')), 'Catalog must load only on tool use');
      if (surface === 'none') {
        assert.equal(await page.evaluate(() => Object.keys(window.testTools).length), 0);
      } else {
        await page.waitForFunction(() => Object.keys(window.testTools).length === 3);
        const result = await page.evaluate(async () => {
          const tools = window.testTools;
          const search = JSON.parse(await tools.plotune_search_public_content.execute({ query: 'key custody', limit: 5 }));
          const read = JSON.parse(await tools.plotune_get_public_page.execute({ path: '/docs/nexus/security-model' }));
          const list = JSON.parse(await tools.plotune_list_public_pages.execute({}));
          return { search, read, list };
        });
        assert(result.search.results.some(page => page.path === '/docs/nexus/security-model'));
        assert(result.read.markdown.includes('2026-09-26'));
        assert.equal(result.read.url, 'https://www.plotune.net/docs/nexus/security-model');
        assert(result.list.pages.length >= 40);
        assert.equal(requests.filter(url => url.endsWith('/agent-content.json')).length, 1);
        const markdown = await context.request.get(origin + '/docs/nexus/security-model/index.md');
        assert.equal(markdown.status(), 200);
        assert((await markdown.text()).includes(result.read.markdown));
        const discovery = await context.request.get(origin + '/llms.txt');
        assert.equal(discovery.status(), 200);
        assert((await discovery.text()).includes(result.read.markdownUrl));
      }
      await context.close();
    }
    console.log('Production browser checks passed: unsupported, document and navigator APIs; lazy public search, retrieval, citations and static exports.');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
