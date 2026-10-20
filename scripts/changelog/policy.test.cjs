const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs'),os=require('node:os'),path=require('node:path');const matter=require('gray-matter');
const {scan,publicLink,readEntry,entries}=require('./policy.cjs');
const {week,eligible}=require('./collect.cjs');
const {draft}=require('./draft.cjs');
const {repos}=require('./policy.cjs');
const {inventory,validateReview}=require('./review.cjs');
function completeReview(input,sources){
 for(const repo of repos)if(!sources.repositories.some(r=>r.repo===repo))sources.repositories.push({repo,prs:[],releases:[]});
 for(const change of input.changes)change.mediaDecision={kind:'none',reason:'Text explains the protocol change without an unnecessary UI recording.'};
 input.review=inventory(sources).map(r=>({...r,decision:'include',reason:'This implemented technical change is useful to product users.'}));
}

const metadata={title:'Useful updates',summary:'A practical product update.',status:'published',weekStart:'2026-10-12',publishedAt:'2026-10-19',products:['Nexus']};
const body='\n## Nexus\n\n### Available now\n\nChoose the configuration that fits your project and read the published documentation. [Read more](/nexus)\n';
const temp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'changelog-test-'));
test('scanner blocks credentials, personal data, private addresses and private repository links without echoing them',()=>{
 for(const text of ['ghp_'+'x'.repeat(24),'sk-proj-'+'x'.repeat(24),'api_key = '+ 'x'.repeat(20),'Bearer '+'x'.repeat(20),'a'.repeat(64),'engineer@example.com','https://lab.internal/config','http://10.2.3.4/config','https://github.com/plotune/plotune-nexus/pull/8','100% secure'])assert.throws(()=>scan(text),e=>!e.message.includes(text));
 scan('Clearer filtering with synthetic demo data.');
});
test('public links restrict protocols, destinations and private source links',()=>{
 publicLink('/docs/nexus');publicLink('https://www.plotune.net/nexus');
 for(const link of ['javascript:alert(1)','//example.com','https://example.com','https://github.com/plotune/plotune-cloud'])assert.throws(()=>publicLink(link));
});
test('published index sorts editions and excludes drafts; invalid dates, executable content and missing transcripts fail',()=>{
 const dir=temp();try{
  fs.writeFileSync(path.join(dir,'one.mdx'),matter.stringify(body,metadata));
  fs.writeFileSync(path.join(dir,'draft.mdx'),matter.stringify(body,{...metadata,status:'draft',weekStart:'2026-10-05'}));
  assert.deepEqual(entries(dir).map(e=>e.weekStart),['2026-10-12']);
  for(const [meta,text] of [[{...metadata,weekStart:'2026-10-13'},body],[metadata,body+'\n<script>bad</script>'],[metadata,body+'\n{run()}'],[{...metadata,media:[{id:'demo',kind:'ui',caption:'Demo'}]},body]]){
   const file=path.join(dir,'bad.mdx');fs.writeFileSync(file,matter.stringify(text,meta));assert.throws(()=>readEntry(file));
  }
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('weekly interval is UTC and year-safe; rejected, draft and unlabelled preview PRs never become candidates',()=>{
 assert.deepEqual(week(new Date('2026-01-02T00:00:00Z')),{start:'2025-12-22',end:'2025-12-29'});
 const start='2026-10-12',end='2026-10-19',base={updated_at:'2026-10-15',state:'closed',merged_at:null};
 assert.equal(eligible(base,start,end),false);assert.equal(eligible({...base,state:'open'},start,end),false);
 assert.equal(eligible({...base,state:'open',labels:[{name:'changelog:preview'}]},start,end),true);
 assert.equal(eligible({...base,merged_at:'2026-10-15'},start,end),true);
 assert.equal(eligible({...base,merged_at:'2026-10-19'},start,end),false);
 assert.equal(eligible({...base,draft:true,merged_at:'2026-10-15'},start,end),false);
});
test('draft generator needs release evidence and does not propagate private provenance',async()=>{
 const dir=temp();try{
  const sources={weekStart:'2026-10-12',repositories:[{repo:'plotune/plotune-nexus',prs:[{number:1,mergedAt:'2026-10-15'}],releases:[{tag:'v1',body:'Includes #1'}]}]};
  const change={product:'Nexus',type:'feature',usage:'Open Event Explorer and choose the new property condition to inspect matching events.',availability:'available',title:'A clearer flow',description:'Choose the configuration for your project before continuing.',links:[{label:'Explore Nexus',url:'/nexus'}],evidence:{repository:'plotune/plotune-nexus',pr:1,releaseTag:'v1'}};
  const input={...metadata,changes:[change]};const a=path.join(dir,'input.json'),b=path.join(dir,'sources.json'),out=path.join(dir,'edition.mdx');completeReview(input,sources);fs.writeFileSync(a,JSON.stringify(input));fs.writeFileSync(b,JSON.stringify(sources));
  await draft(a,b,out);assert(!fs.readFileSync(out,'utf8').includes('plotune-nexus'));
  for(const override of [{type:'sales'},{title:'Discount pricing update'},{usage:'Too vague'}]){fs.writeFileSync(a,JSON.stringify({...input,changes:[{...change,...override}]}));await assert.rejects(()=>draft(a,b,out));}
  fs.writeFileSync(a,JSON.stringify(input));assert.equal(readEntry(out).status,'draft');
  delete input.changes[0].evidence.releaseTag;fs.writeFileSync(a,JSON.stringify(input));await assert.rejects(()=>draft(a,b,out));
  sources.repositories[0].prs[0].mergeCommit='b'.repeat(40);
  sources.repositories[0].deployments=[{sha:'b'.repeat(40),environment:'production',verifiedAt:'2026-10-16'}];
  input.changes[0].evidence.deploymentSha='b'.repeat(40);completeReview(input,sources);fs.writeFileSync(a,JSON.stringify(input));fs.writeFileSync(b,JSON.stringify(sources));await draft(a,b,out);
  input.changes[0].evidence.deploymentSha='c'.repeat(40);fs.writeFileSync(a,JSON.stringify(input));await assert.rejects(()=>draft(a,b,out));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('eligible previews are explicitly unreleased and cannot be promoted without availability evidence',async()=>{
 const dir=temp();try{
  const input={...metadata,products:['Stream'],changes:[{product:'Stream',type:'fix',usage:'Open the workspace and compare the event result with the selected property condition.',availability:'preview',title:'A preview to explore',description:'An upcoming interaction can be explored as a preview and is not generally available.',evidence:{repository:'plotune/plotune-cloud',pr:2}}]};
  const sources={weekStart:metadata.weekStart,repositories:[{repo:'plotune/plotune-cloud',prs:[{number:2,preview:true}],releases:[]}]};
  const a=path.join(dir,'input.json'),b=path.join(dir,'sources.json'),out=path.join(dir,'edition.mdx');completeReview(input,sources);fs.writeFileSync(a,JSON.stringify(input));fs.writeFileSync(b,JSON.stringify(sources));await draft(a,b,out);
  const content=readEntry(out).content;assert(content.includes('Preview — not yet released'));assert(!content.includes('Available now'));assert(!content.includes('plotune-cloud'));
  input.changes[0].availability='available';fs.writeFileSync(a,JSON.stringify(input));await assert.rejects(()=>draft(a,b,out));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('JSON examples are inert, media must be inline and executable prose remains blocked',()=>{
 const dir=temp(),file=path.join(dir,'entry.mdx');try{
  const medium={id:'filter',kind:'diagram',caption:'Selection flow',transcript:'A saved selection is reused across Explorer, widgets and export.'};
  fs.writeFileSync(file,matter.stringify(body+'\n```json\n{"event":"sample","properties":{"value":81}}\n```\n\n:::media filter\n',{...metadata,media:[medium]}));
  assert.equal(readEntry(file).sections[0].id,'nexus');
  fs.writeFileSync(file,matter.stringify(body,{...metadata,media:[medium]}));assert.throws(()=>readEntry(file),/exactly once/);
  fs.writeFileSync(file,matter.stringify(body+'\n```json\n{}\n```\n{execute()}\n',metadata));assert.throws(()=>readEntry(file),/executable/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('history review requires all repositories, every decision and a media rationale',()=>{
 const sources={repositories:repos.map(repo=>({repo,prs:[{number:1,mergedAt:'2026-10-15'}]}))};
 const input={changes:[{evidence:{repository:repos[0],pr:1},mediaDecision:{kind:'none',reason:'A text compatibility note communicates this change clearly.'}}],review:inventory(sources).map((r,i)=>({...r,decision:i?'omit':'include',reason:'Reviewed technical relevance and user impact for this edition.'}))};
 validateReview(sources,input);
 assert.throws(()=>validateReview({...sources,repositories:sources.repositories.slice(0,2)},input),/three repositories/);
 assert.throws(()=>validateReview(sources,{...input,review:input.review.slice(0,2)}),/every collected/);
 assert.throws(()=>validateReview(sources,{...input,changes:[{...input.changes[0],mediaDecision:undefined}]}),/media helps/);
 assert.throws(()=>validateReview(sources,{...input,review:input.review.map(r=>({...r,decision:'omit'}))}),/match/);
});
test('merged multi-product updates do not imply deployment and reject out-of-week history',async()=>{
 const dir=temp();try{
  const sources={weekStart:'2026-10-12',untilExclusive:'2026-10-19',repositories:repos.map(repo=>({repo,prs:[{number:1,mergedAt:'2026-10-15'}],releases:[]}))};
  const input={...metadata,title:'Plotune updates — 12–18 October 2026',changes:repos.map((repository,i)=>({product:['Stream','Cloud','Nexus'][i],type:'feature',availability:'merged',title:'A verified technical change',description:'Implemented behavior from a merged change in the correct weekly interval.',usage:'Read the compatibility notes before using the updated integration in your installation.',evidence:{repository,pr:1}}))};
  completeReview(input,sources);const a=path.join(dir,'input.json'),b=path.join(dir,'sources.json'),out=path.join(dir,'out.mdx');fs.writeFileSync(a,JSON.stringify(input));fs.writeFileSync(b,JSON.stringify(sources));await draft(a,b,out);
  const e=readEntry(out);assert.deepEqual(e.products,['Stream','Cloud','Nexus']);assert(e.content.includes('## Cloud'));assert(e.content.includes('Merged this week'));assert(!e.content.includes('Available now'));assert(e.content.includes('Availability depends on the installed or deployed release'));
  sources.repositories[0].prs[0].mergedAt='2026-10-19';fs.writeFileSync(b,JSON.stringify(sources));await assert.rejects(()=>draft(a,b,out),/outside/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('publication strips generated outline metadata and rejects demo or unrelated capture provenance',()=>{
 const {publicationText,verifyUiCapture}=require('./publish.cjs');
 const dir=temp(),file=path.join(dir,'edition.mdx');try{
  fs.writeFileSync(file,matter.stringify(body,{...metadata,status:'draft'}));
  fs.writeFileSync(file,publicationText(readEntry(file)));
  assert.equal(readEntry(file).status,'published');
  assert(!Object.hasOwn(matter(fs.readFileSync(file,'utf8')).data,'sections'));
  const m={id:'capture',kind:'ui'},r={capturePath:'/stream/workspace',localCommand:'npm start',syntheticAuth:true,sourceRevision:'merged-revision'},p={mediaSources:[{id:'capture',kind:'ui',revisions:['merged-revision']}]};
  verifyUiCapture(m,r,p);
  for(const override of [{capturePath:'/stream/demo'},{sourceRevision:'unrelated'},{syntheticAuth:false},{localCommand:'production'}])assert.throws(()=>verifyUiCapture(m,{...r,...override},p),/real local app/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
