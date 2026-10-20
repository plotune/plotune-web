// Private editorial ledger: inventory first, public selection second, media last.
const {assert,repos}=require('./policy.cjs');
const key = ref=>`${ref.repository}#${ref.pr}`;
const references = change=>[change.evidence,...(change.evidence?.related||[])];
function inventory(sources) {
  return sources.repositories.flatMap(r=>r.prs.map(p=>({repository:r.repo,pr:p.number,title:p.title,mergedAt:p.mergedAt,decision:'pending',reason:''})));
}
function validateReview(sources,input) {
  assert(repos.every(repo=>sources.repositories.filter(r=>r.repo===repo).length===1),'Review all three repositories before drafting');
  assert(!sources.repositories.some(r=>!repos.includes(r.repo)),'Unexpected source repository');
  const all=inventory(sources), decisions=input.review;
  assert(Array.isArray(decisions) && decisions.length===all.length,'Decide whether to include or omit every collected change');
  const expected=new Set(all.map(key)),seen=new Set(),selected=new Set();
  for(const c of input.changes) {
    for(const ref of references(c)) {
      assert(ref && expected.has(key(ref)),'Selected change is outside collected history');
      selected.add(key(ref));
    }
    const m=c.mediaDecision;
    assert(m && ['none','ui','diagram'].includes(m.kind) && typeof m.reason==='string' && m.reason.trim().length>=20,'Decide whether media helps each selected change');
    if(m.kind==='none')assert(!c.mediaId,'Text-only changes cannot attach media');
    else if(m.kind==='diagram' && c.diagramId)assert(!c.mediaId && Object.hasOwn(require('../../src/changelog/diagrams.json'),c.diagramId),'Use a reviewed static diagram');
    else assert(input.media?.some(d=>d.id===c.mediaId && d.kind===m.kind),'Media decision must match a reviewed descriptor');
  }
  for(const d of decisions) {
    const id=key(d);
    assert(expected.has(id) && !seen.has(id),'Review contains a duplicate or unknown change');seen.add(id);
    assert(['include','omit'].includes(d.decision) && typeof d.reason==='string' && d.reason.trim().length>=20,'Complete each editorial decision with a reason');
    assert((d.decision==='include')===selected.has(id),'Selected changes must match the completed review');
  }
}
module.exports={inventory,validateReview,references};
