const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const repos = ['plotune/plotune-web', 'plotune/plotune-cloud', 'plotune/plotune-nexus'];
const root = path.resolve(__dirname, '../..');
function assert(ok, message) { if (!ok) throw new Error(message); }
// Layered checks, not a proof of confidentiality. Never echo rejected content.
function scan(text) {
  const rules = [
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
    /\b(?:gh[pousr]_[A-Za-z0-9_]{15,}|github_pat_[A-Za-z0-9_]{15,}|sk-(?:proj-)?[A-Za-z0-9_-]{16,}|AKIA[A-Z0-9]{16})\b/,
    /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/,
    /\b(?:api[_ -]?key|password|secret|access[_ -]?token|authorization)\s*[=:]\s*["']?[^\s"']{8,}/i,
    /\b(?:plt_[A-Za-z0-9_-]{12,}|Bearer\s+[A-Za-z0-9._-]{12,})/i,
    /[?&](?:token|secret|password|api_key|signature|X-Amz-Signature)=/i,
    /(?:javascript|vbscript|data):/i,
    /\b[A-Fa-f0-9]{64}\b/,
    /(?:https?:\/\/)?(?:localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)(?=[:/\s]|$)/i,
    /https?:\/\/[^\s/]+\.(?:internal|local|test)(?=[:/\s]|$)/i,
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
    /github\.com\/plotune\/(?:plotune-cloud|plotune-nexus)(?:[\s/#?]|$)/i,
    /(?:guaranteed|100% secure|zero risk|industry.leading|revolutionary|game.changing)/i,
  ];
  assert(!rules.some(rule => rule.test(text)), 'Publication blocked: sensitive or unsupported content detected.');
}
function publicLink(value) {
  assert(typeof value === 'string', 'Link must be text');
  if(/^#[a-z0-9][a-z0-9-]*$/.test(value))return;
  assert(/^\/(?!\/)[a-z0-9/#?=&._%-]*$/i.test(value) || /^https:\/\/(?:www\.plotune\.net|github\.com\/plotune\/plotune-(?:web|sdk))(?:\/[^\s<>]*)?$/.test(value), 'Unapproved public link');
  scan(value);
  const url=new URL(value,'https://www.plotune.net');
  if(url.hostname==='www.plotune.net')assert(/^\/(?:$|nexus(?:\/|$)|stream(?:\/?$|\/demo\/?$)|docs(?:\/|$)|changelog(?:\/|$)|download\/?$|extensions\/?$|contact\/?$|faq\/?$)/.test(url.pathname),'Link points outside public product content');
}
function readEntry(file) {
  const raw = fs.readFileSync(file, 'utf8'); scan(raw);
  const {data, content} = matter(raw);
  assert(Object.keys(data).every(k=>['title','summary','weekStart','publishedAt','status','products','media'].includes(k)),'Unknown edition metadata; source provenance must stay private');
  assert(['draft', 'published'].includes(data.status), 'Explicit draft/published status required');
  for (const key of ['title', 'summary', 'weekStart', 'publishedAt']) assert(typeof data[key] === 'string' && data[key].trim(), `Missing ${key}`);
  assert(data.title.length<=120 && data.summary.length<=350,'Keep edition titles and summaries concise');
  for (const key of ['weekStart', 'publishedAt']) assert(/^\d{4}-\d{2}-\d{2}$/.test(data[key]) && new Date(data[key]).toISOString().slice(0,10) === data[key], 'Invalid date');
  assert(new Date(data.weekStart).getUTCDay() === 1, 'Edition week starts on Monday');
  assert(data.publishedAt >= data.weekStart, 'Publication precedes edition');
  assert(Array.isArray(data.products) && data.products.length && data.products.every(p => ['Nexus','Cloud','Stream'].includes(p)), 'Invalid products');
  const prose = content.replace(/^```(?:json|text|bash)?\n[\s\S]*?^```[ \t]*$/gm, '');
  assert(!/^```/m.test(prose), 'Code fences must be closed and use json, text or bash');
  assert(!/[<>{}]|^\s*(?:import|export)\b/m.test(prose), 'Only plain Markdown is allowed; executable MDX/HTML is blocked');
  assert(!/!\[/.test(content), 'Images must use reviewed media descriptors');
  assert(!/^\s*\[[^\]]+\]:/m.test(content),'Use explicit validated links, not reference definitions');
  assert(content.trim().length >= 80, 'Edition needs substantive content');
  for(const product of data.products)assert(content.includes(`## ${product}\n`),'Each product needs a clearly grouped section');
  assert(/^### (?:Merged this week|Available now|Preview — not yet released)$/m.test(content) || /^\*\*(?:Merged this week\.|Available now|Preview — not yet released)\*\*/m.test(content),'Availability must be explicit');
  for (const match of content.matchAll(/\]\(([^)]+)\)/g)) publicLink(match[1]);
  assert(!/https?:\/\//.test(content.replace(/\]\(([^)]+)\)/g, '')), 'Use validated Markdown links, not bare URLs');
  const media = data.media || [];
  assert(Array.isArray(media) && media.length <= 2, 'At most two clips per edition');
  media.forEach(m => {
    assert(m && Object.keys(m).every(k=>['id','kind','caption','transcript'].includes(k)),'Unknown media metadata');
    assert(m && /^[a-z0-9-]+$/.test(m.id) && ['ui','diagram'].includes(m.kind), 'Invalid media descriptor');
    assert(typeof m.caption === 'string' && typeof m.transcript === 'string' && m.transcript.length >= 20, 'Media requires caption and equivalent text');
  });
  assert(new Set(media.map(m=>m.id)).size === media.length, 'Duplicate media');
  const placements = [...content.matchAll(/^:::media ([a-z0-9-]+)$/gm)].map(m=>m[1]);
  assert(placements.length === media.length && new Set(placements).size === placements.length && placements.every(id=>media.some(m=>m.id===id)), 'Place every reviewed medium exactly once in its relevant section');
  const diagrams=[...prose.matchAll(/^:::diagram ([a-z0-9-]+)$/gm)].map(m=>m[1]);
  assert(diagrams.every(id=>Object.hasOwn(require('../../src/changelog/diagrams.json'),id)) && new Set(diagrams).size===diagrams.length,'Use each reviewed static diagram at most once');
  const sections = [...prose.matchAll(/^## (.+)$/gm)].map(m=>({title:m[1],id:m[1].toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}));
  assert(new Set(sections.map(s=>s.id)).size === sections.length, 'Section headings must be unique');
  return {...data, sections, media, content, slug: data.weekStart, file: path.basename(file)};
}
function entries(dir = path.join(root, 'src/changelog/entries')) {
  const all = fs.readdirSync(dir).filter(f=>f.endsWith('.mdx')).map(f=>readEntry(path.join(dir,f)));
  assert(new Set(all.map(e=>e.slug)).size === all.length, 'Duplicate weekly edition');
  return all.filter(e=>e.status === 'published').sort((a,b)=>b.weekStart.localeCompare(a.weekStart));
}
module.exports = { root, repos, assert, scan, publicLink, readEntry, entries };
