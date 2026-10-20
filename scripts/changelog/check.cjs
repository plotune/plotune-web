const fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const {root,assert,scan,readEntry}=require('./policy.cjs');
const {validateMedia}=require('./media.cjs');
const crypto=require('node:crypto');
function check(entryFile,mediaDir=path.join(root,'public/changelog/media')) {
  const entry=readEntry(entryFile);
  let bytes=0;
  for(const m of entry.media) {const report=validateMedia(mediaDir,m.id);bytes+=report.bytes;}
  assert(bytes<=6*1024*1024,'Edition exceeds video budget');
  return entry;
}
function staged(projectRoot=root) {
  const files=execFileSync('git',['diff','--cached','--name-only','-z'],{cwd:projectRoot,encoding:'utf8'}).split('\0').filter(Boolean);
  assert(files.length>0,'Nothing staged');
  for(const file of files) {
    assert(!/(?:\.changelog-work|sources\.json|storageState|\.env|\.har|\.trace|\.webm|review\.json|verification\.json)/i.test(file),'Private or raw artifact staged');
    assert(/^(?:src\/changelog\/entries\/[^/]+\.mdx|public\/changelog\/(?:media\/[a-z0-9-]+\.(?:mp4|webp)|rss\.xml)|src\/changelog\/catalog\.js|public\/sitemap\.xml)$/.test(file),'Weekly PR contains unrelated files');
    const data=execFileSync('git',['show',`:${file}`],{cwd:projectRoot,maxBuffer:10*1024*1024});
    if(!/\.(mp4|webp)$/.test(file))scan(data.toString('utf8'));
    // Ensure we inspected precisely the bytes that will be pushed, not just the worktree.
    const work=fs.readFileSync(path.join(projectRoot,file));
    assert(crypto.createHash('sha256').update(data).digest('hex')===crypto.createHash('sha256').update(work).digest('hex'),'Staged file differs from validated file');
    if(file.endsWith('.mdx'))check(path.join(projectRoot,file));
  }
  const referenced=new Set(files.filter(f=>f.endsWith('.mdx')).flatMap(f=>readEntry(path.join(projectRoot,f)).media.flatMap(m=>[`${m.id}.mp4`,`${m.id}.webp`])));
  for(const f of files.filter(f=>f.startsWith('public/changelog/media/')))assert(referenced.has(path.basename(f)),'Unreferenced media staged');
}
if(require.main===module){try{if(process.argv[2]==='--staged')staged();else check(path.resolve(process.argv[2]),process.argv[3]?path.resolve(process.argv[3]):undefined);console.log('Publication checks passed. Human factual and visual review still required.');}catch{console.error('Publication blocked. Inspect the draft locally; rejected content was not logged.');process.exitCode=1;}}
module.exports={check,staged};
