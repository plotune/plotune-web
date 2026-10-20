// Prepare a public review PR only. Never merge or deploy.
const fs=require('node:fs'),path=require('node:path'),matter=require('gray-matter');
const {execFileSync}=require('node:child_process');
const {root,readEntry,assert}=require('./policy.cjs');
const {check,staged}=require('./check.cjs');
function run(cmd,args){return execFileSync(cmd,args,{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});}
function prepare(draftFile,mediaDir,send=false) {
  const entry=check(draftFile,mediaDir),branch=`changelog/${entry.slug}`;
  const proof=JSON.parse(fs.readFileSync(draftFile+'.verification.json','utf8'));
  const hash=file=>require('node:crypto').createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  assert(proof.weekStart===entry.weekStart && proof.editionHash===hash(draftFile),'Draft changed after source verification; regenerate it');
  for(const media of entry.media) {
    const receipt=JSON.parse(fs.readFileSync(path.join(mediaDir,`${media.id}.review.json`),'utf8'));
    assert(require('./scenarios.cjs')[receipt.scenario] && receipt.kind===media.kind && receipt.movie===hash(path.join(mediaDir,`${media.id}.mp4`)) && receipt.poster===hash(path.join(mediaDir,`${media.id}.webp`)), 'Media does not match an approved recording receipt');
  }
  assert(run('git',['branch','--show-current']).trim()===branch,'Use the dedicated weekly branch from current origin/master');
  assert(run('git',['status','--porcelain']).trim()==='', 'Start with a clean branch; keep inputs in ignored scratch storage');
  run('git',['merge-base','--is-ancestor','origin/master','HEAD']);
  const changed=run('git',['diff','--name-only','origin/master...HEAD']).trim().split('\n').filter(Boolean);
  assert(changed.every(f=>f===`src/changelog/entries/${entry.slug}.mdx` || f==='public/sitemap.xml' || /^public\/changelog\/media\/[a-z0-9-]+\.(mp4|webp)$/.test(f)), 'Weekly branch contains unrelated work');
  assert(!run('git',['ls-tree','--name-only','origin/master',`src/changelog/entries/${entry.slug}.mdx`]).trim(),'This edition is already published; do not silently rewrite it');
  // A dry prepare leaves a reviewable diff. All validation precedes any commit/push.
  const out=path.join(root,'src/changelog/entries',`${entry.slug}.mdx`);
  const {content,...meta}=entry;delete meta.file;delete meta.slug;meta.status='published';
  fs.writeFileSync(out,matter.stringify(content,meta));
  fs.mkdirSync(path.join(root,'public/changelog/media'),{recursive:true});
  for(const m of entry.media)for(const ext of ['mp4','webp']) {
    const source=path.join(mediaDir,`${m.id}.${ext}`),target=path.join(root,'public/changelog/media',`${m.id}.${ext}`);
    assert(!fs.existsSync(target) || fs.readFileSync(target).equals(fs.readFileSync(source)), 'Media IDs are immutable; use a new ID for changed media');
    fs.copyFileSync(source,target);
  }
  run('node',['scripts/changelog/build.cjs']);
  run('git',['add',out,'public/sitemap.xml']);
  if(entry.media.length)run('git',['add',...entry.media.flatMap(m=>['mp4','webp'].map(ext=>`public/changelog/media/${m.id}.${ext}`))]);
  if(!run('git',['diff','--cached','--name-only']).trim()){console.log('Weekly content is unchanged; no duplicate commit or PR.');return;}
  staged();
  if(!send){console.log('Prepared and checked local publication diff. Nothing committed or pushed.');return;}
  run('git',['commit','-m',`Product updates: week of ${entry.slug}`]);
  run('git',['push','origin',`HEAD:${branch}`]);
  const prs=JSON.parse(run('gh',['pr','list','--repo','plotune/plotune-web','--head',branch,'--state','open','--json','number,url']));
  if(prs.length)console.log(`Updated weekly review PR #${prs[0].number}.`);
  else console.log(run('gh',['pr','create','--repo','plotune/plotune-web','--base','master','--head',branch,'--draft','--title',`What’s new: week of ${entry.slug}`,'--body','Automatically prepared product digest. Review every availability claim, preview, link, poster and complete clip. Pre-publication checks passed; they do not guarantee confidentiality or factual accuracy. Merge only after editorial and visual approval. No deployment performed by the generator.']).trim());
}
if(require.main===module){try{prepare(process.argv[2],path.resolve(process.argv[3]||'.changelog-work/media'),process.argv.includes('--send'));}catch{console.error('Publication blocked. No unchecked content should be pushed; inspect the local draft and Git state.');process.exitCode=1;}}
module.exports={prepare};
