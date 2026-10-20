const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs'),os=require('node:os'),path=require('node:path');const {execFileSync}=require('node:child_process');const matter=require('gray-matter');const {staged}=require('./check.cjs');
test('publication validates staged bytes, rejects private artifacts and unrelated work',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'changelog-stage-'));const git=(...args)=>execFileSync('git',args,{cwd:root,stdio:'pipe'});
 const write=(file,text)=>{fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),text);};
 try {
  git('init');const file='src/changelog/entries/2026-10-12.mdx';const data={title:'Product update',summary:'A useful change to the public interface.',weekStart:'2026-10-12',publishedAt:'2026-10-19',status:'published',products:['Nexus'],media:[]};
  const text=matter.stringify('\n## Nexus\n\n### Available now\n\nA useful improvement makes the published product workflow easier to understand. [Explore Nexus](/nexus)\n',data);
  write(file,text);git('add',file);staged(root);
  write(file,text+'\nLocal edits after validation.');assert.throws(()=>staged(root),/differs/);
  write(file,text);write('sources.json','private source text');git('add','sources.json');assert.throws(()=>staged(root),/Private/);
  git('rm','--cached','sources.json');write('README.md','unrelated');git('add','README.md');assert.throws(()=>staged(root),/unrelated/);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
