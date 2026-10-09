/* Local-only visual QA. External requests are intercepted: no production data or analytics writes. */
const fs=require('fs');const path=require('path');const http=require('http');const {chromium}=require('playwright');
const phase=process.argv[2]||'after';const root=path.resolve(process.env.QA_BUILD||'build');const out=path.resolve('docs/redesign/evidence/'+phase);fs.mkdirSync(out,{recursive:true});
const routes=JSON.parse(fs.readFileSync('docs/redesign/routes.json'));const port=Number(process.env.QA_PORT)||4182;
const server=http.createServer((req,res)=>{let f=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(!path.extname(f))f=path.join(f,'index.html');if(!fs.existsSync(f))f=path.join(root,'index.html');const ext=path.extname(f);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.json':'application/json'})[ext]||'application/octet-stream');fs.createReadStream(f).pipe(res)});
async function fixtures(context,authenticated){
 if(authenticated)await context.addCookies([{name:'auth_token',value:'qa-local-fixture',url:`http://localhost:${port}`}]);
 await context.route('**/*',async route=>{
 const u=new URL(route.request().url());if(u.hostname==='localhost')return route.continue();
 if(['script','stylesheet','font'].includes(route.request().resourceType()))return route.fulfill({status:200,contentType:route.request().resourceType()==='script'?'application/javascript':'text/css',body:''});
 if(route.request().resourceType()==='image')return route.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#e8ece4"/><text x="40" y="45" text-anchor="middle" fill="#00796b">QA</text></svg>'});
 let data={};
 if(u.hostname==='api.plotune.net') {
 const p=u.pathname;
 if(p==='/auth/validate')data={valid:true,username:'qa-engineer'};
 else if(p==='/profile')data={user_id:1,username:'qa-engineer',email:'engineer@example.test',full_name:'Alex Engineer',company:'Local QA fixture',sector:'Engineering',country:'Türkiye'};
 else if(p==='/user/premium')data={is_premium:false};
 else if(p==='/user/stats')data={extensions:0,projects:0,apiCalls:0,storage:'0MB'};
 else if(p==='/s3/user/files')data={files:[]};
 else if(p==='/s3/user/total_usage')data={storage:0};
 else if(p==='/auth/stream')data={token:'local-stream-fixture'};
 else if(/extension|package|network/.test(p))data=[];
 }else if(u.hostname==='stream.plotune.net')data=/network/.test(u.pathname)?[]:{streams:[],shared_streams:[]};
 else if(u.hostname==='api.github.com')data={tag_name:'QA fixture',html_url:'https://github.com/plotune/plotune-dl/releases/latest',assets:[]};
 else if(u.hostname==='script.google.com'||u.hostname==='script.googleusercontent.com')data={ok:true};
 else if(u.hostname==='t.plotune.net')data=/flags|decide/.test(u.pathname)?{featureFlags:{}}:{status:1};
 else return route.fulfill({status:200,contentType:'text/plain',body:''});
 return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
 });
}
module.exports={fixtures};
if(require.main===module)(async()=>{
 await new Promise(r=>server.listen(port,'127.0.0.1',r));const browser=await chromium.launch();let results=(process.env.QA_FILTER || process.env.QA_RESUME) && fs.existsSync(path.join(out,process.env.QA_DEVICE?`results-${process.env.QA_DEVICE}.json`:'results.json')) ? JSON.parse(fs.readFileSync(path.join(out,process.env.QA_DEVICE?`results-${process.env.QA_DEVICE}.json`:'results.json'))) : [];
 const widths=[['mobile',390,844],['tablet',768,1024],['desktop',1440,900]].filter(([d])=>!process.env.QA_DEVICE||d===process.env.QA_DEVICE);
 for(const [device,width,height]of widths){for(let i=0;i<routes.length;i++){
 const route=routes[i];if(process.env.QA_RESUME && results.some(r=>r.route===route && r.device===device && !r.error))continue;if(process.env.QA_FILTER && !route.match(new RegExp(process.env.QA_FILTER)))continue;const authenticated=/^\/(dashboard|profile|streams(?:\?|$)|storage|mirror|partner-portal)/.test(route);
 const context=await browser.newContext({viewport:{width,height},reducedMotion:process.env.QA_MOTION||'reduce'});await fixtures(context,authenticated);
 const page=await context.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));
 const file=String(i).padStart(3,'0')+'-'+device+'.png';
 try{
 await page.goto(`http://localhost:${port}${route}`,{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForTimeout(/^\/(blog|community|tutorials)$/.test(route)?250:1200);
 await page.evaluate(async()=>{const maxHeight=document.documentElement.scrollHeight;for(let y=0;y<maxHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,12))}window.scrollTo(0,0)});await page.waitForTimeout(350);
 await page.screenshot({path:path.join(out,file),fullPage:true});
 const info=await page.evaluate(()=>({title:document.title,url:location.pathname+location.search,overflow:document.documentElement.scrollWidth>innerWidth+1,h1:[...document.querySelectorAll('h1')].map(e=>e.innerText),links:[...document.querySelectorAll('a')].map(a=>({text:a.innerText,href:a.getAttribute('href')})),brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}));
 results=results.filter(r=>r.route!==route||r.device!==device);results.push({route,device,file,authenticated,...info,errors});
 }catch(e){results=results.filter(r=>r.route!==route||r.device!==device);results.push({route,device,file,error:e.message,errors})}finally{await context.close()}
 fs.writeFileSync(path.join(out,process.env.QA_DEVICE?`results-${process.env.QA_DEVICE}.json`:'results.json'),JSON.stringify(results,null,2));if(i%20===0)console.log(phase,device,i,route);
 }}await browser.close();server.close();console.log(results.length+' captures; '+results.filter(r=>r.error||r.overflow||r.errors.length).length+' flagged');
})().catch(e=>{console.error(e);server.close();process.exit(1)});
