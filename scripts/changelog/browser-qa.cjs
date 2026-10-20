// Fixture-free production-preview review. Block every nonlocal request.
const {chromium}=require('playwright');const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const origin=process.env.CHANGELOG_ORIGIN||'http://127.0.0.1:4189';const output=process.env.CHANGELOG_QA_OUTPUT||'/tmp/plotune-changelog-qa';
(async()=>{
 await fs.mkdir(output,{recursive:true});const browser=await chromium.launch();
 try {
  for(const [name,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['narrow',320,740]]) {
   const c=await browser.newContext();await c.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.fulfill({status:200,contentType:r.request().resourceType()==='script'?'application/javascript':'application/json',body:r.request().resourceType()==='script'?'':'{}'}));
   const p=await c.newPage();await p.setViewportSize({width,height});const errors=[],requests=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>requests.push(r.url()));
   await p.goto(origin+'/changelog');
   await p.getByRole('heading',{name:'Plotune updates — 12–18 October 2026',exact:true}).waitFor();
   await p.locator('video').first().waitFor();
   assert.equal(await p.locator('video').count(),1,'Only the worthwhile real-workspace recording is included');
   for(const name of ['Nexus','Cloud','Stream'])await p.getByRole('heading',{name,exact:true,level:2}).waitFor();
   assert((await p.locator('article').innerText()).includes('Merged this week'));
   assert(!(await p.locator('article').innerText()).includes('/stream/demo'));
   assert.equal(await p.locator('article h4').count(),10,'Grouped weekly technical changes are present');
   assert.equal(requests.filter(u=>u.endsWith('.mp4')).length,0,'Below-fold media must not load');
   assert(!/Demo walkthrough|Demo data|Illustration/.test(await p.locator('main').innerText()));
   assert.equal(await p.locator('figure').first().evaluate(e=>e.previousElementSibling.tagName),'P');
   const video=p.locator('video').first();
   await video.scrollIntoViewIfNeeded();await p.waitForFunction(()=>{const v=document.querySelector('video');return v && !v.paused && v.currentTime>0;});
   assert(await video.evaluate(v=>v.muted && v.playsInline && v.controls));
   await p.screenshot({path:path.join(output,`${name}-playback.png`)});
   await p.getByRole('navigation',{name:'On this page'}).getByRole('link',{name:'Cloud',exact:true}).click();
   assert.equal(new URL(p.url()).hash,'#cloud');
   await p.evaluate(()=>window.scrollTo(0,0));await p.waitForFunction(()=>Array.from(document.querySelectorAll('video')).every(v=>v.paused));
   await p.screenshot({path:path.join(output,`${name}-edition.png`),fullPage:true});
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No page overflow');
   await p.goto(origin+'/changelog/not-an-edition');await p.getByRole('heading',{name:'We couldn’t find that edition.',exact:true}).waitFor();
   assert.deepEqual(errors,[]);await c.close();
  }
  const c=await browser.newContext({reducedMotion:'reduce'});await c.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());const p=await c.newPage();
  await p.goto(origin+'/changelog/2026-10-12');await p.locator('video').first().waitFor();await p.locator('video').first().scrollIntoViewIfNeeded();await p.waitForTimeout(350);
  assert.equal(await p.locator('video').first().getAttribute('src'),null,'Reduced motion: no automatic MP4 request');
  await p.getByRole('button',{name:/Play: Apply a shared project Filter/}).focus();await p.keyboard.press('Enter');await p.waitForFunction(()=>!document.querySelector('video').paused);
  await p.locator('summary').first().focus();await p.keyboard.press('Enter');assert(await p.locator('details').first().evaluate(e=>e.open));
  await p.screenshot({path:path.join(output,'reduced-motion-transcript.png'),fullPage:true});await c.close();
 } finally {await browser.close();}
 console.log('PASS: changelog archive/detail/unknown routes, four widths, autoplay and offscreen pause, reduced motion, keyboard transcript, multi-product weekly notes and real-workspace recording and no below-fold MP4s or horizontal overflow.');
})().catch(e=>{console.error(e);process.exitCode=1;});
