const fs=require('node:fs'),path=require('node:path'),matter=require('gray-matter');
const {assert,repos,root,scan,publicLink,readEntry}=require('./policy.cjs');
async function draft(inputFile, sourceFile, destination) {
  const input=JSON.parse(fs.readFileSync(inputFile,'utf8'));
  const sources=JSON.parse(fs.readFileSync(sourceFile,'utf8'));
  assert(input.weekStart===sources.weekStart,'Wrong source interval');
  assert(Array.isArray(input.changes) && input.changes.length>0 && input.changes.length<=12,'Use 1–12 meaningful changes');
  require('./review.cjs').validateReview(sources,input);
  const changes=[];
  for(const change of input.changes) {
    assert(['Nexus','Cloud','Stream'].includes(change.product),'Unknown product');
    assert(['feature','fix','performance','compatibility','security','deprecation'].includes(change.type),'Technical change type required');
    assert(typeof change.usage==='string' && change.usage.trim().length>=30 && !/[\n\r<>\[\]{}]/.test(change.usage),'Explain how to use or verify the change');
    assert(!/\b(?:pricing|rental|discount|checkout|purchase|sales|promotion)\b/i.test([change.title,change.description,change.usage,...(change.links||[]).map(l=>l.url)].join(' ')), 'Sales updates do not belong in technical release notes');
    const evidence=change.evidence;
    assert(evidence && repos.includes(evidence.repository),'Evidence must use an allowlisted repository');
    const source=sources.repositories.find(r=>r.repo===evidence.repository);
    assert(source,'Source repository was not collected');
    const pr=source.prs.find(p=>p.number===evidence.pr);
    assert(pr,'Change must reference an eligible collected PR');
    for(const ref of require('./review.cjs').references(change)) {
      const candidate=sources.repositories.find(r=>r.repo===ref.repository)?.prs.find(p=>p.number===ref.pr);
      assert(candidate && (change.availability==='preview' ? candidate.preview : candidate.mergedAt), 'Every source must have the stated merge status');
      if(candidate.mergedAt)assert(candidate.mergedAt>=sources.weekStart && candidate.mergedAt<(sources.untilExclusive || new Date(Date.parse(sources.weekStart)+7*86400000).toISOString().slice(0,10)), 'Source merge is outside this edition');
    }
    if(change.availability==='merged') assert(pr.mergedAt,'Merged update requires a merged PR');
    else if(change.availability==='preview') assert(pr.preview,'Preview requires an open PR explicitly labelled changelog:preview');
    else {
      assert(change.availability==='available' && pr.mergedAt,'Available change must have merged');
      if(evidence.deploymentSha) assert(evidence.deploymentSha===pr.mergeCommit && source.deployments?.some(d=>d.sha===pr.mergeCommit && d.environment==='production' && d.verifiedAt>=pr.mergedAt),'Successful production deployment must match the merged commit');
      else if(evidence.releaseTag) assert(source.releases.some(r=>!r.preview && r.tag===evidence.releaseTag && new RegExp(`#${pr.number}\\b`).test(r.body)),'Release must explicitly reference the PR');
      else {
        assert(typeof evidence.publicUrl==='string' && evidence.publicUrl.startsWith('https://www.plotune.net/'),'Public verification required');
        publicLink(evidence.publicUrl);
        assert(typeof evidence.visibleText==='string' && evidence.visibleText.length>=16,'Specific public evidence required');
        const html=require('node:child_process').execFileSync('curl',['--fail','--silent','--show-error','--max-time','15','--proto','=https',evidence.publicUrl],{encoding:'utf8',maxBuffer:4*1024*1024});
        assert(html.includes(evidence.visibleText),'Public availability evidence not found');
      }
    }
    for(const value of [change.title,change.description])assert(typeof value==='string' && !/[\n\r<>\[\]{}]/.test(value),'Change prose must be plain text');
    (change.links||[]).forEach(l=>{publicLink(l.url);assert(/^[\w ’'—–-]{1,80}$/u.test(l.label),'Invalid link label');});
    assert((change.description+' '+change.usage).trim().split(/\s+/).length<=65,'Keep each update to one compact paragraph (65 words maximum)');
    changes.push(change);
  }
  let content='\n**Merged this week.** Availability depends on the installed or deployed release.\n';
  if(input.highlights?.length) {
    assert(input.highlights.length<=4,'Use at most four highlights');
    content+='\n## Highlights\n\n';
    for(const h of input.highlights) {
      assert(typeof h.title==='string' && typeof h.description==='string' && !/[\n\r<>\[\]{}]/.test(h.title+h.description),'Highlights must be plain prose');
      assert(changes.some(c=>c.title===h.title),'Highlight must link to a selected change');
      const anchor=h.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      content+=`- [${h.title}](#${anchor}) — ${h.description}\n`;
    }
  }
  for(const product of ['Nexus','Cloud','Stream']) {
    const group=changes.filter(c=>c.product===product);if(!group.length)continue;
    content+=`\n## ${product}\n`;
    for(const [availability,label] of [['merged','Merged this week'],['available','Available now'],['preview','Preview — not yet released']]) {
      const selected=group.filter(c=>c.availability===availability);if(!selected.length)continue;
      if(availability!=='merged')content+=`\n**${label}**\n`;
      for(const c of selected)content+=`\n### ${c.title}\n\n${c.description} ${c.usage}\n\n${(c.links||[]).map(l=>`[${l.label}](${l.url})`).join(' · ')}\n${c.diagramId ? `\n:::diagram ${c.diagramId}\n` : ''}${c.mediaId ? `\nLocal recording of the real workspace with synthetic authentication and API responses.\n\n:::media ${c.mediaId}\n` : ''}`;
    }
  }
  const data={title:input.title,summary:input.summary,weekStart:input.weekStart,publishedAt:input.publishedAt,status:'draft',products:[...new Set(changes.map(c=>c.product))],media:input.media||[]};
  const text=matter.stringify(content.replace(/\n{3,}/g,'\n\n'),data).trimEnd()+'\n';scan(text);
  fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,text);readEntry(destination);
  fs.writeFileSync(destination+'.verification.json',JSON.stringify({weekStart:input.weekStart,editionHash:require('node:crypto').createHash('sha256').update(text).digest('hex'),verifiedAt:new Date().toISOString(),changes:changes.length,mediaSources:changes.filter(c=>c.mediaId).map(c=>({id:c.mediaId,kind:c.mediaDecision.kind,revisions:require('./review.cjs').references(c).map(ref=>sources.repositories.find(r=>r.repo===ref.repository).prs.find(p=>p.number===ref.pr).mergeCommit)}))}),{mode:0o600});
  console.log('Draft prepared. No source material or private provenance copied into the edition.');
}
if(require.main===module)draft(process.argv[2],process.argv[3]||path.join(root,'.changelog-work/sources.json'),process.argv[4]||path.join(root,'.changelog-work/edition.mdx')).catch(()=>{console.error('Draft generation blocked; verify eligibility and prose locally.');process.exitCode=1;});
module.exports={draft};
