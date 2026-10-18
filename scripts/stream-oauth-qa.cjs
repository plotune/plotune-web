const fs = require('fs');
const path = require('path');
// Local visual QA: mock external requests and never approve a real OAuth request.
const { chromium } = require('playwright');
const phase = process.argv[2] || 'after';
const out = path.resolve('docs/redesign/evidence/stream-oauth', phase);
fs.mkdirSync(out, { recursive: true });
const fixture = {
  request: { name: 'Claude Desktop', clientId: 'mcp_local_visual_fixture', redirect: 'https://client.example.test/oauth/callback', scope: ['events:read', 'dashboards:read', 'context:read'] },
  projects: [{ id: 'project-1', name: 'Vehicle telemetry', role: 'owner' }, { id: 'project-2', name: 'Bench validation', role: 'viewer' }],
};
(async () => {
 const browser = await chromium.launch();
 const results = [];
 for (const [device, width, height] of [['desktop',1440,1000],['mobile',390,844],['small-mobile',320,740],['tablet',768,1024]]) {
  const context = await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  await context.addCookies([{name:'auth_token',value:'local-visual-fixture',url:'http://127.0.0.1:3000'}]);
  let state = 'consent';
  const decisions = [];
  await context.route('**/*', async route => {
   const url = new URL(route.request().url());
   if (url.hostname === '127.0.0.1') return route.continue();
   if (url.pathname === '/oauth/authorize/context') {
    if (state === 'loading') return;
    if (state === 'error') return route.abort('failed');
    if (state === 'expired') return route.fulfill({status:400,json:{error:{message:'This authorization request has expired. Restart sign-in from your MCP client.'}}});
    return route.fulfill({json:{...fixture,projects:state === 'empty' ? [] : fixture.projects}});
   }
   if (url.pathname === '/oauth/authorize/consent') { decisions.push(route.request().postDataJSON()); return route.fulfill({json:{redirectTo:'http://127.0.0.1:3000/stream/authorize?returned=1'}}); }
   if (url.pathname === '/auth/validate') return route.fulfill({json:{valid:true,username:'visual-review'}});
   if (url.pathname === '/profile') return route.fulfill({json:{username:'visual-review',email:'review@example.test'}});
   return route.fulfill({json:{}});
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror',e=>errors.push(e.message));
  const save = async name => {
   await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo({top:0,behavior:'instant'}); return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
   await page.waitForFunction(() => window.scrollY === 0);
   await page.screenshot({path:path.join(out,`${device}-${name}.png`),fullPage:true});
   results.push({device,state:name,errors:[...errors],...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,heading:document.querySelector('h1')?.innerText,headingColor:getComputedStyle(document.querySelector('h1')).color,mainTop:document.querySelector('h1')?.getBoundingClientRect().top,buttons:[...document.querySelectorAll('main button,main select,main summary')].map(e=>({text:e.textContent,height:e.getBoundingClientRect().height}))}))});
  };
  await page.goto('http://127.0.0.1:3000/stream/authorize?request=local.fixture');
  await page.getByRole('combobox', {name:'Project to share'}).waitFor();
  await save('consent');
  if (phase === 'after') {
   const summary = page.locator('main summary');
   await summary.focus();
   await page.keyboard.press('Enter');
   if (!(await page.locator('main details').getAttribute('open') === '')) throw new Error('Keyboard disclosure failed');
   await save('details');
   await page.keyboard.press('Tab');
   if (!(await page.locator('#project').evaluate(el => el === document.activeElement))) throw new Error('Project keyboard order failed');
   await save('keyboard-focus');
   await page.keyboard.press('Tab');
   if (!(await page.getByRole('button',{name:'Approve and continue',exact:true}).evaluate(el => el === document.activeElement))) throw new Error('Approve keyboard order failed');
   await page.keyboard.press('Tab');
   if (!(await page.getByRole('button',{name:'Deny request',exact:true}).evaluate(el => el === document.activeElement))) throw new Error('Deny keyboard order failed');
   const contrast = await page.evaluate(() => {
    const rgb = color => color.match(/[\d.]+/g).map(Number);
    const luminance = color => rgb(color).slice(0,3).map(c => c/255).map(c => c <= .04045 ? c/12.92 : ((c+.055)/1.055)**2.4).reduce((sum,c,i) => sum+c*[.2126,.7152,.0722][i],0);
    return [...document.querySelectorAll('main h1,main h2,main p,main summary,main select,main button,.stream-authorize__badge,.stream-authorize__eyebrow')].map(el => {
     let bg = el;
     while(bg.parentElement && rgb(getComputedStyle(bg).backgroundColor)[3] === 0) bg = bg.parentElement;
     const fgL = luminance(getComputedStyle(el).color), bgL = luminance(getComputedStyle(bg).backgroundColor);
     return {text:el.textContent,ratio:Number(((Math.max(fgL,bgL)+.05)/(Math.min(fgL,bgL)+.05)).toFixed(2))};
    });
   });
   if(contrast.some(c => c.ratio < 4.5)) throw new Error('Text contrast failed: '+JSON.stringify(contrast));
   results[results.length-1].contrast = contrast;
   await page.getByRole('combobox', {name:'Project to share'}).selectOption('project-2');
   await page.getByRole('button',{name:'Approve and continue',exact:true}).click();
   await page.waitForURL('**/*returned=1');
   if(decisions[0]?.projectId!=='project-2'||decisions[0]?.decision!=='approve') throw new Error('Selected project not sent');
   await page.goto('http://127.0.0.1:3000/stream/authorize?request=local.fixture');
   await page.getByRole('button',{name:'Deny request',exact:true}).click(); await page.waitForURL('**/*returned=1');
   if(decisions[1]?.decision!=='deny'||'projectId' in decisions[1]) throw new Error('Denial payload incorrect');
   const normalName = fixture.request.name;
   const normalRedirect = fixture.request.redirect;
   fixture.request.name = 'EngineeringAssistant'.repeat(8);
   fixture.request.redirect = 'https://' + 'callback'.repeat(14) + '.example.test/oauth/callback';
   await page.goto('http://127.0.0.1:3000/stream/authorize?request=local.fixture');
   await page.getByRole('combobox', {name:'Project to share'}).waitFor();
   await page.getByText('Where exactly is this sent?').click();
   await save('long-identifiers');
   fixture.request.name = normalName;
   fixture.request.redirect = normalRedirect;
   for (const next of ['empty','error','expired','loading']) {
    state=next;
    await page.goto('http://127.0.0.1:3000/stream/authorize?request=local.fixture');
    await page.getByText(next==='empty'?'Your account has no Stream projects yet. Create one in the Stream workspace, then restart sign-in from your MCP client.':next==='error'?'Stream could not be reached. Try again in a moment.':next==='expired'?'This authorization request has expired. Restart sign-in from your MCP client.':'Checking the authorization request…',{exact:true}).waitFor();
    await save(next);
   }
  }
  await context.close();
 }
 await browser.close();
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));
 if(results.some(r=>r.overflow||r.errors.length||r.buttons.some(b=>b.height<44))) throw new Error('Overflow or browser errors: '+JSON.stringify(results));
 console.log(`${results.length} screenshots saved to ${out}; no horizontal overflow or browser errors.`);
})().catch(e=>{console.error(e);process.exit(1)});
