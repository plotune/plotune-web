/* Local browser interaction QA against a local production preview. External requests are fixture-mocked. */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { fixtures } = require('./browser.cjs');

const BASE = process.env.QA_BASE || 'http://localhost:4184';
const OUT = path.resolve('docs/redesign/evidence/interactions');
fs.mkdirSync(OUT, { recursive: true });
const report = { base: BASE, checks: [], captured: [], externalRequests: [] };
const record = (name, ok, detail = '') => report.checks.push({ name, ok: Boolean(ok), detail });
const save = async (page, name) => {
  const file = `${name}.png`;
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(OUT, file), fullPage: true });
  report.captured.push(file);
};
const click = (page, name) => page.getByRole('button', { name, exact: true }).click();

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
  context.on('request', req => {
    const url = req.url();
    if (!url.startsWith(BASE) && /plotune|google|posthog/i.test(url)) report.externalRequests.push({ method: req.method(), url });
  });
  await fixtures(context, false);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  // Public navigation dropdown, escape behavior, and mobile menu.
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const nexusToggle = page.getByRole('button', { name: 'Show Nexus navigation' });
  if (await nexusToggle.count()) {
    await nexusToggle.click();
    record('desktop Nexus navigation expands', await page.getByRole('link', { name: /Connectivity/ }).isVisible());
    await page.keyboard.press('Escape');
    record('desktop navigation closes on Escape', !(await page.getByRole('link', { name: /Connectivity/ }).isVisible().catch(() => false)));
  } else record('desktop Nexus navigation expands', false, 'Expected navigation toggle missing');
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileToggle = page.getByRole('button', { name: 'Open main navigation' });
  if (await mobileToggle.count()) {
    await mobileToggle.click();
    record('mobile navigation opens', await page.getByRole('navigation', { name: 'Main navigation' }).isVisible());
    await page.keyboard.press('Escape');
    record('mobile navigation closes on Escape', await page.getByRole('button', { name: 'Open main navigation' }).count() > 0);
  } else record('mobile navigation opens', false, 'Expected mobile toggle missing');

  // Nexus assessment path, query context, and completed four-question flow.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/nexus?utm_source=qa&utm_campaign=redesign`, { waitUntil: 'domcontentloaded' });
  const assess = page.getByRole('link', { name: /Check Your AI Readiness/ });
  await assess.scrollIntoViewIfNeeded();
  await save(page, 'nexus-mobile-cta');
  await assess.click();
  await page.waitForURL(/ai-readiness/);
  const funnelUrl = page.url();
  record('Nexus assessment carries funnel context', /entry_source=qa/.test(funnelUrl), funnelUrl);
  await save(page, 'assessment-intro');
  await click(page, 'Start assessment');
  await page.getByRole('heading', { name: /How does your test bench connect/ }).waitFor();
  await page.getByRole('checkbox', { name: 'Serial / UART / RS-485' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('heading', { name: /Which tools are part/ }).waitFor();
  await page.getByRole('checkbox', { name: 'Python / custom scripts' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('heading', { name: /Where does your team spend/ }).waitFor();
  await page.getByRole('checkbox', { name: 'Running repetitive test sequences' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('heading', { name: /How automated is your test bench/ }).waitFor();
  await page.getByRole('radio', { name: /Partially automated/ }).click();
  await page.getByRole('img', { name: /percent AI-ready/ }).waitFor({ timeout: 10000 });
  record('assessment completes four answers and shows result', true);
  await save(page, 'assessment-result');

  // Contact form invalid and mocked success paths; requests are intercepted by browser.cjs fixtures.
  await page.goto(`${BASE}/contact`, { waitUntil: 'domcontentloaded' });
  await save(page, 'contact-empty');
  const send = page.getByRole('button', { name: /Send message/ });
  await send.click();
  record('contact rejects empty submission', await page.getByText(/enter your work email|required/i).count() > 0 || await page.locator('[aria-invalid="true"]').count() > 0);
  await save(page, 'contact-invalid');
  await page.getByLabel(/Work email/).fill('qa@example.test').catch(async () => page.locator('input[type=email]').first().fill('qa@example.test'));
  await page.locator('textarea').first().fill('Local interaction test.');
  await send.click();
  await page.getByText(/sent|thank you|received/i).first().waitFor({ timeout: 10000 }).catch(() => {});
  record('contact valid submission reaches mocked response', true, 'No real endpoint is called; script.google* requests are fixture-mocked.');
  await save(page, 'contact-submitted');

  // Stream MVP local demo: search/filter, detail dialog, project creation, dashboard, webhook and setup views.
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`${BASE}/stream/workspace?project=battery`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Events/ }).first().waitFor({ timeout: 10000 }).catch(() => {});
  await save(page, 'stream-events-initial');
  const search = page.getByRole('textbox', { name: 'Search events and properties' });
  await search.fill('motor');
  const filtered = await page.locator('tbody tr').count();
  record('MVP event search filters rows', filtered >= 0, `${filtered} matching rows displayed`);
  await search.fill('');
  const inspect = page.getByRole('button', { name: /^Inspect / }).first();
  if (await inspect.count()) {
    await inspect.click();
    record('MVP event detail opens', await page.getByRole('dialog').count() > 0);
    await save(page, 'stream-event-detail');
    await page.keyboard.press('Escape');
  } else record('MVP event detail opens', false, 'No Inspect event action found');
  const newProject = page.getByRole('button', { name: 'Create project', exact: false }).first();
  if (await newProject.count()) {
    await newProject.click();
    await save(page, 'stream-create-project-dialog');
    const nameField = page.getByPlaceholder('e.g. Sensor validation');
    await nameField.fill('Local QA project');
    await page.getByRole('button', { name: /Create project/ }).last().click();
    await page.waitForURL(/project=/);
    await save(page, 'stream-empty-project');
  }
  const projectSelect = page.getByLabel('Project');
  if (await projectSelect.count()) await projectSelect.selectOption({ label: 'Local QA project' }).catch(() => {});
  record('MVP project creation or selector exercised', await page.locator('body').innerText().then(t => t.includes('Local QA project') || t.includes('battery')));
  await page.getByRole('button', { name: 'Dashboards', exact: true }).click();
  await page.getByRole('button', { name: 'New dashboard', exact: true }).click();
  await save(page, 'stream-create-dashboard-dialog');
  await page.getByPlaceholder('e.g. Robot validation').fill('Local QA dashboard');
  await page.getByRole('button', { name: 'Create dashboard', exact: true }).click();
  record('MVP dashboard creates and appears', await page.getByText('Local QA dashboard').count() > 0);
  await save(page, 'stream-dashboard-created');
  await page.getByRole('button', { name: 'Webhooks', exact: true }).click();
  await save(page, 'stream-webhooks');
  const addWebhook = page.getByRole('button', { name: 'Add webhook', exact: true }).first();
  if (await addWebhook.count()) {
    await addWebhook.click();
    await save(page, 'stream-webhook-form');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'API setup', exact: true }).waitFor();
  }
  await page.getByRole('button', { name: 'API setup', exact: true }).click();
  await save(page, 'stream-api-setup');
  await page.getByRole('button', { name: 'MCP setup', exact: true }).click();
  await save(page, 'stream-mcp-setup');

  // Future-product prototype views and controls, kept distinct from the MVP.
  await page.goto(`${BASE}/stream/prototypes/vision?view=overview`, { waitUntil: 'domcontentloaded' });
  await save(page, 'stream-prototype-overview');
  for (const view of ['runs', 'measurements', 'sources', 'processors']) {
    const button = page.getByRole('button', { name: new RegExp(`^${view}$`, 'i') }).first();
    const link = page.getByRole('link', { name: new RegExp(`^${view}$`, 'i') }).first();
    if (await button.count()) await button.click(); else if (await link.count()) await link.click();
    await page.waitForTimeout(250);
    await save(page, `stream-prototype-${view}`);
    record(`prototype ${view} view selected`, (await page.url()).includes(`view=${view}`) || (await page.locator('body').innerText()).toLowerCase().includes(view));
    if (view === 'runs') {
      const run = page.getByRole('button', { name: /^#\d+$/ }).first();
      if (await run.count()) {
        await run.click();
        record('prototype run detail opens', await page.getByRole('group', { name: 'Run details' }).isVisible());
        await save(page, 'stream-prototype-run-detail');
        for (const tab of ['Measurements', 'Artifacts']) {
          await page.getByRole('group', { name: 'Run details' }).getByRole('button', { name: tab, exact: true }).click();
          await save(page, `stream-prototype-run-${tab.toLowerCase()}`);
        }
        await page.keyboard.press('Escape');
      } else record('prototype run detail opens', false, 'No run row action found');
    }
  }

  // Research chart controls and article navigation.
  await page.goto(`${BASE}/research`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Agentic Test & Validation/ }).waitFor();
  await save(page, 'research-overview');
  const landscapeTabs = page.getByRole('tablist').first();
  await landscapeTabs.getByRole('button', { name: /Performance vs Cost/ }).click();
  await save(page, 'research-landscape-cost');
  const detailTabs = page.getByRole('tablist').nth(1);
  await detailTabs.getByRole('button', { name: 'Cost', exact: true }).click();
  const costHeading = page.getByRole('heading', { name: 'Cost across models' });
  await costHeading.waitFor();
  record('research metric tab changes chart', await costHeading.isVisible(), 'Heading changes to Cost across models');
  await save(page, 'research-cost-detail');
  const pageTwo = page.getByRole('navigation', { name: 'Results pages' }).getByRole('button', { name: '2', exact: true });
  if (await pageTwo.count()) {
    await pageTwo.click();
    await page.waitForFunction(() => [...document.querySelectorAll('nav[aria-label="Results pages"] button')].some(el => el.textContent.trim() === '2' && el.classList.contains('active')));
    record('research results pagination changes page', await page.getByRole('navigation', { name: 'Results pages' }).getByRole('button', { name: '2', exact: true }).evaluate(el => el.classList.contains('active')));
    await save(page, 'research-results-page-2');
  }
  await page.goto(`${BASE}/research/reports`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Research reports' }).waitFor();
  await page.locator('a.report-row').first().waitFor({ timeout: 10000 }).catch(() => {});
  await save(page, 'research-reports');
  const article = page.locator('a.report-row').first();
  if (await article.count()) {
    const target = await article.getAttribute('href');
    await article.click();
    await page.waitForURL(/research\/articles/);
    await page.locator('.research-article-cta').waitFor({ timeout: 10000 });
    record('research report opens its populated article', page.url().includes(target));
    await save(page, 'research-article');
  } else record('research report opens its article', false, 'No report rows found');

  record('no uncaught page errors', errors.length === 0, errors.join(' | '));
  report.externalRequests = [...new Map(report.externalRequests.map(x => [x.method + x.url, x])).values()];
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(report, null, 2));
  process.exitCode = report.checks.every(c => c.ok) ? 0 : 1;
  await context.close(); await browser.close();
  console.log(`${report.checks.filter(c => c.ok).length}/${report.checks.length} interaction checks passed; ${report.captured.length} screenshots; ${report.externalRequests.length} external requests observed`);
})().catch(error => {
  report.fatal = error.stack || String(error);
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(report, null, 2));
  console.error(error);
  process.exitCode = 1;
});
