const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const walk = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=> e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk('src');
const app=fs.readFileSync('src/App.js','utf8');
let routes=[...app.matchAll(/<Route path="([^"]+)"/g)].map(m=>m[1]).filter(p=>!p.includes(':')&&p!=='*');
for (const file of files.filter(f=>f.endsWith('.mdx')&&f.includes('/articles/'))) {
 const data=matter(fs.readFileSync(file,'utf8')).data; if(data.slug) routes.push('/research/articles/'+data.slug);
}
for(const [file,prefix] of [['src/content/solutions.js','/solutions/'],['src/content/nexusDocs.js','/docs/nexus/']]) {
 const src=fs.readFileSync(file,'utf8');routes.push(...[...src.matchAll(/slug: '([^']+)'/g)].map(m=>prefix+m[1]));
 if(prefix==='/solutions/')routes.push(...[...src.matchAll(/^\s*'([a-z0-9-]+)':\s*'[a-z0-9-]+',?$/gm)].map(m=>prefix+m[1]));
}
const docs=fs.readFileSync('src/pages/Docs.jsx','utf8');
routes.push(...[...docs.matchAll(/(?:^|\n)\s*(?:"([a-z-]+)"|([a-z-]+)): lazy/g)].map(m=>'/docs?page='+(m[1]||m[2])));
routes.push(...['events','dashboards','api','mcp','webhooks','settings'].map(v=>'/stream/workspace?view='+v+'&project=battery'));
routes.push('/stream/workspace?project=robot');
routes.push(...['overview','events','runs','measurements','records','alarms','dashboards','sources','live','processors','agents','project-settings'].map(v=>'/stream/prototypes/vision?view='+v));
routes.push('/not-a-page','/docs/nexus/not-a-doc','/research/articles/not-a-study','/use-cases/claude/','/use-cases/codex/');
routes=[...new Set(routes)];
fs.writeFileSync('docs/redesign/routes.json',JSON.stringify(routes,null,2)+'\n');
const lines=['# Conversion and dependency preservation matrix','','Source snapshot before implementation. Static source inventory supplements the browser CTA crawl. All existing handlers, payloads, service endpoints, event names, attribution and redirect semantics must survive.','','| Source | Line | Behavior / destination / instrumentation |','|---|---:|---|'];
for(const file of files.filter(f=>/\.(js|jsx)$/.test(f)&&!f.includes('.test.'))) {
 const text=fs.readFileSync(file,'utf8');text.split('\n').forEach((line,i)=>{
 if(/to=|href=|capture\(|useCtaTracking\(|withFunnelParams\(|api\.(get|post|put|delete)\(|fetch\(|window.location|navigate\(/.test(line))lines.push(`| ${file} | ${i+1} | ${line.trim().replaceAll('|','&#124;').replaceAll('`','')} |`);
 });
}
fs.writeFileSync('docs/redesign/conversions.md',lines.join('\n')+'\n');
fs.writeFileSync('docs/redesign/assets.json',JSON.stringify(walk('public').concat(walk('src/assets')).filter(f=>/\.(svg|png|webp|jpg|ico)$/.test(f)).map(f=>({path:f,bytes:fs.statSync(f).size})),null,2)+'\n');
console.log(routes.length+' route/state URLs inventoried');
