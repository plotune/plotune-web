const fs=require('node:fs'), path=require('node:path'), http=require('node:http');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
const {root,assert,scan}=require('./policy.cjs');
const scenarios=require('./scenarios.cjs');
const sha = file=>require('node:crypto').createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function command(name,args){
  const env={...Object.fromEntries(Object.entries(process.env).filter(([key])=>['PATH','HOME','LANG','LC_ALL','TMPDIR'].includes(key))),OMP_THREAD_LIMIT:'1'};
  return execFileSync(name,args,{env,encoding:'utf8',stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
}
function validateMedia(dir,id) {
  assert(/^[a-z0-9-]+$/.test(id),'Invalid asset id');
  const movie=path.join(dir,`${id}.mp4`), poster=path.join(dir,`${id}.webp`);
  const webp=fs.readFileSync(poster);
  assert(webp.subarray(0,4).toString()==='RIFF' && webp.subarray(8,12).toString()==='WEBP','Expected a WebP poster');
  for(let offset=12;offset+8<=webp.length;) {
    assert(!['EXIF','XMP '].includes(webp.subarray(offset,offset+4).toString()),'Poster has identifying metadata');
    const size=webp.readUInt32LE(offset+4);offset+=8+size+(size%2);
    assert(offset<=webp.length,'Malformed poster');
  }
  const info=JSON.parse(command('ffprobe',['-v','quiet','-show_format','-show_streams','-of','json',movie]));
  assert(Number(info.format.duration)>=8 && Number(info.format.duration)<=20.2,'Clip duration outside 8–20 seconds');
  assert(info.streams.length===1 && info.streams[0].codec_name==='h264' && info.streams[0].width===1280 && info.streams[0].height===720,'Expected silent 720p H.264');
  assert(fs.statSync(movie).size<=3*1024*1024 && fs.statSync(poster).size<=100*1024,'Media exceeds performance budget');
  const tags={...info.format.tags,...info.streams[0].tags};
  assert(!Object.keys(tags).some(k=>/comment|location|title|artist|creation_time/i.test(k)), 'Unexpected identifying media metadata');
  const frames=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'plotune-media-'));
  try {
    // Scan every encoded frame, including transitions, rather than just the poster.
    command('ffmpeg',['-v','error','-i',movie,path.join(frames,'%04d.png')]);
    for(const file of fs.readdirSync(frames)) scan(command('tesseract',[path.join(frames,file),'stdout','--psm','11']));
    scan(command('tesseract',[poster,'stdout','--psm','11']));
  } finally {fs.rmSync(frames,{recursive:true,force:true});}
  return {movie:sha(movie),poster:sha(poster),bytes:fs.statSync(movie).size,duration:Number(info.format.duration)};
}
async function render(scenarioId, id, out) {
  const scenario=scenarios[scenarioId];assert(scenario,'Scenario is not approved');assert(/^[a-z0-9-]+$/.test(id),'Invalid asset id');
  fs.mkdirSync(out,{recursive:true,mode:0o700});
  const fingerprint=sha(__filename)+sha(path.join(__dirname,'scenarios.cjs'))+sha(path.join(__dirname,'policy.cjs'))+sha(path.join(root,'build/asset-manifest.json'));
  const receipt=path.join(out,`${id}.review.json`);
  if(fs.existsSync(receipt)) {
    const previous=JSON.parse(fs.readFileSync(receipt,'utf8'));
    if(previous.fingerprint===fingerprint && previous.scenario===scenarioId && previous.movie===sha(path.join(out,`${id}.mp4`)) && previous.poster===sha(path.join(out,`${id}.webp`))) {
      console.log('Reused unchanged, previously scanned media. Publication still revalidates the final bytes.');return previous;
    }
  }
  const scratch=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'plotune-capture-'));
  const build=path.join(root,'build');
  const server=http.createServer((req,res)=>{
    let file=path.resolve(build,'.'+decodeURIComponent(req.url.split('?')[0]));
    if(!file.startsWith(build+path.sep) && file!==build){res.writeHead(403);return res.end();}
    if(!path.extname(file))file=path.join(file,'index.html');
    if(!fs.existsSync(file))file=path.join(build,'index.html');
    res.setHeader('Content-Type',({'.js':'application/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const origin=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({env:Object.fromEntries(Object.entries(process.env).filter(([key])=>['PATH','HOME','LANG','LC_ALL','TMPDIR'].includes(key)))});
  let unexpected=false;
  const context=await browser.newContext({viewport:{width:1280,height:720},recordVideo:{dir:scratch,size:{width:1280,height:720}},serviceWorkers:'block'});
  // No auth cookies/storage, geolocation, microphone, production API or credentials.
  await context.route('**/*',route=>{
    const u=new URL(route.request().url());
    if(u.origin===origin)return route.continue();
    if(['api.plotune.net','stream.plotune.net','t.plotune.net','www.googletagmanager.com','snap.licdn.com','px.ads.linkedin.com'].includes(u.hostname)) {
      const script=route.request().resourceType()==='script';
      return route.fulfill({status:200,contentType:script?'application/javascript':'application/json',body:script?'':'{}'});
    }
    unexpected=true;return route.abort();
  });
  const page=await context.newPage(), errors=[];
  const recordingStarted=Date.now();let clipStart=null;
  page.on('pageerror',()=>errors.push('page error'));
  await page.addInitScript(()=>{
    localStorage.clear();sessionStorage.clear();
    document.addEventListener('pointerdown',event=>{
      const ring=document.createElement('div');ring.style.cssText=`position:fixed;left:${event.clientX-18}px;top:${event.clientY-18}px;width:36px;height:36px;border:3px solid #00796b;border-radius:50%;background:#00796b22;z-index:2147483647;pointer-events:none`;
      document.body.appendChild(ring);setTimeout(()=>ring.remove(),700);
    });
  });
  const checkpoint=async caption=>{
    scan(await page.locator('body').innerText());scan(caption);
    assert(await page.getByRole('alert').count()===0,'Recording contains an alert');
    if(clipStart===null)clipStart=Math.max(0,(Date.now()-recordingStarted)/1000);
    await page.waitForTimeout(2800);
  };
  try {
    await scenario.run(page,origin,checkpoint);
    assert(!unexpected && !errors.length,'Capture failed: unexpected network or browser error');
    const raw=await page.video().path();
    await context.close();
    const movie=path.join(out,`${id}.mp4`),poster=path.join(out,`${id}.webp`);
    command('ffmpeg',['-v','error','-y','-ss',String(clipStart||0),'-i',raw,'-t','20','-an','-vf','fps=12','-c:v','libx264','-crf','26','-pix_fmt','yuv420p','-movflags','+faststart','-map_metadata','-1',movie]);
    command('ffmpeg',['-v','error','-y','-ss','0.3','-i',movie,'-frames:v','1','-q:v','65','-map_metadata','-1',poster]);
    const report=validateMedia(out,id);
    const manifest={scenario:scenarioId,id,kind:scenario.kind,caption:scenario.caption,transcript:scenario.transcript,fingerprint,sourceRevision:command('git',['rev-parse','HEAD']).trim(),...report};
    fs.writeFileSync(path.join(out,`${id}.review.json`),JSON.stringify(manifest,null,2));
    console.log(`Validated ${scenarioId}: ${Math.round(report.bytes/1024)} KB, ${report.duration.toFixed(1)} seconds.`);
    return manifest;
  } finally {await browser.close();server.close();fs.rmSync(scratch,{recursive:true,force:true});}
}
if(require.main===module) render(process.argv[2],process.argv[3]||process.argv[2],path.resolve(process.argv[4]||'.changelog-work/media')).catch(()=>{console.error('Media rejected; inspect the isolated trial locally. No assets published.');process.exitCode=1;});
module.exports={render,validateMedia};
