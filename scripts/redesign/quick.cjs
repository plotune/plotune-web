/* Quick re-capture of selected routes against a running server (dev or preview), with the same fixtures.
   Usage: QA_BASE=http://localhost:3000 node scripts/redesign/quick.cjs <outdir> <route> [route...]
   QA_DEVICES=mobile,tablet,desktop (default all); QA_CLICK=<css selector> clicks before capture. */
const fs=require('fs');const path=require('path');const {chromium}=require('playwright');const {fixtures}=require('./browser.cjs');
const base=process.env.QA_BASE||'http://localhost:3000';const [out,...routes]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const all={mobile:[390,844],tablet:[768,1024],desktop:[1440,900]};const devices=(process.env.QA_DEVICES||'mobile,tablet,desktop').split(',');
(async()=>{const browser=await chromium.launch();
for(const route of routes)for(const d of devices){const [width,height]=all[d];
 const ctx=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});await fixtures(ctx,/^\/(dashboard|profile|streams(?:\?|$)|storage|mirror|partner-portal)/.test(route));
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.waitForTimeout(1500);
 await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,15))}scrollTo(0,0)});
 if(process.env.QA_CLICK){await page.click(process.env.QA_CLICK).catch(e=>errors.push('click: '+e.message));await page.waitForTimeout(500);}
 const name=route.replace(/[^a-z0-9]+/gi,'_').replace(/^_|_$/g,'')||'home';const file=path.join(out,`${name}-${d}.png`);
 await page.screenshot({path:file,fullPage:!process.env.QA_VIEWPORT});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
 console.log(file,overflow?'OVERFLOW':'',errors.join(' | '));await ctx.close();}
await browser.close();})();
