const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {repos, assert} = require('./policy.cjs');
function week(now=new Date()) {
  const end = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()));
  end.setUTCDate(end.getUTCDate()-((end.getUTCDay()+6)%7));
  const start = new Date(end);start.setUTCDate(start.getUTCDate()-7);
  return {start:start.toISOString().slice(0,10),end:end.toISOString().slice(0,10)};
}
function eligible(pr, start, end) {
  if (pr.draft || !pr.merged_at && pr.state !== 'open') return false;
  if (pr.merged_at) return pr.merged_at >= start && pr.merged_at < end;
  return !!pr.labels?.some(l=>l.name==='changelog:preview') && pr.updated_at >= start && pr.updated_at < end;
}
function collect(out, period=week()) {
  const result = {weekStart:period.start,untilExclusive:period.end,repositories:[]};
  for (const repo of repos) {
    const fetch = endpoint=>JSON.parse(execFileSync('gh',['api',`repos/${repo}/${endpoint}`],{encoding:'utf8',stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024}));
    const prs=[]; let complete=false;
    for(let page=1;page<=10;page++) {
      const batch=fetch(`pulls?state=all&sort=updated&direction=desc&per_page=100&page=${page}`);
      prs.push(...batch.filter(p=>eligible(p,period.start,period.end)).map(p=>({number:p.number,title:p.title,body:p.body || '',mergedAt:p.merged_at,mergeCommit:p.merge_commit_sha,preview:!p.merged_at,labels:p.labels.map(l=>l.name)})));
      if(batch.length<100 || batch.at(-1).updated_at<period.start){complete=true;break;}
    }
    assert(complete, 'Collection exceeded bounded history; narrow the interval.');
    const releaseBatch=fetch('releases?per_page=100');
    assert(releaseBatch.length<100 || releaseBatch.at(-1).published_at<period.start,'Release history exceeds collection bound');
    const releases=releaseBatch.filter(r=>!r.draft && r.published_at>=period.start && r.published_at<period.end).map(r=>({tag:r.tag_name,title:r.name,body:r.body || '',publishedAt:r.published_at,preview:r.prerelease}));
    // Optional read-only availability evidence. Never persist deployment payloads or URLs.
    const deployments=[];
    try {
      const batch=fetch('deployments?environment=production&per_page=20');
      for(const deployment of batch.filter(d=>d.created_at>=period.start && d.created_at<period.end)) {
        const latest=fetch(`deployments/${deployment.id}/statuses?per_page=1`)[0];
        if(latest?.state==='success')deployments.push({sha:deployment.sha,environment:'production',verifiedAt:latest.created_at});
      }
    } catch { /* Without readable deployment evidence, require a release or public page. */ }
    result.repositories.push({repo,prs,releases,deployments});
  }
  fs.mkdirSync(out,{recursive:true,mode:0o700});fs.chmodSync(out,0o700);
  fs.writeFileSync(path.join(out,'sources.json'),JSON.stringify(result,null,2),{mode:0o600});
  // Never print source text or private repository URLs to shared logs.
  console.log(`Collected ${result.repositories.reduce((n,r)=>n+r.prs.length+r.releases.length,0)} candidates into private scratch storage. Merges do not establish availability.`);
  return result;
}
if(require.main===module) {
  try { collect(path.resolve(process.argv[2] || '.changelog-work')); }
  catch { console.error('Collection failed; no report published. Check repository access and interval locally.');process.exitCode=1; }
}
module.exports={week,eligible,collect};
