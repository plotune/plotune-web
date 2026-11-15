#!/usr/bin/env node
// Vendors the RMS browser client into public/rms-app/.
//
//   (in plotune-cloud)  npm --prefix services/rms run build:embed
//   (here)              node scripts/update-rms-embed.cjs <path to services/rms/dist-embed> [--commit=<plotune-cloud sha>]
//
// It replaces public/rms-app/ with the built files (content-hashed ES module and stylesheet, logo, font and its
// licence), writes the manifest as a plain manifest.json (the build's own .vite/ directory is a dot-directory that
// GitHub Pages and gh-pages leave out), and records the plotune-cloud commit in VERSION. Nothing is fetched or run.
//
// One change is made to the stylesheet: the RMS build styles bare elements and :root/body (button, a, h1, ...),
// which would restyle the site header while RMS is open. Every selector is prefixed with .rms-mount (the element
// the RMS page mounts into), and :root/html/body rules apply to that element instead. Nothing else is edited.
const postcss = require('postcss');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=')]; }));
const source = args.find((a) => !a.startsWith('--'));
const fail = (message) => { console.error(`update-rms-embed: ${message}`); process.exit(1); };
if (!source) fail('usage: node scripts/update-rms-embed.cjs <services/rms/dist-embed> [--commit=<sha>]');

const from = path.resolve(source);
const manifestPath = path.join(from, '.vite', 'manifest.json');
if (!fs.existsSync(manifestPath)) fail(`${manifestPath} not found; run "npm --prefix services/rms run build:embed" first.`);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const entry = manifest['src/embed.tsx']?.file;
const style = manifest['style.css']?.file;
if (!entry || !style) fail('the manifest has no "src/embed.tsx" and "style.css" entries.');

let commit = flags.commit;
if (!commit) {
  try { commit = execFileSync('git', ['-C', from, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); } catch { /* handled below */ }
}
if (!/^[0-9a-f]{40}$/.test(commit || '')) fail('could not read the plotune-cloud commit; pass --commit=<40-character sha>.');

const SCOPE = '.rms-mount';
const scopeSelector = (selector) => {
  const sel = selector.trim();
  if (sel === '*') return [SCOPE, `${SCOPE} *`];
  const root = /^(?::root|html|body)(?![\w-])/.exec(sel);
  return [root ? `${SCOPE}${sel.slice(root[0].length)}` : `${SCOPE} ${sel}`];
};
function scopeStylesheet(css) {
  const tree = postcss.parse(css);
  const visit = (container) => container.each((node) => {
    if (node.type === 'rule' && !(node.parent.type === 'atrule' && /keyframes$/i.test(node.parent.name))) {
      node.selectors = node.selectors.flatMap(scopeSelector);
    } else if (node.type === 'atrule' && /^(media|supports|container|layer)$/i.test(node.name)) {
      visit(node);
    }
  });
  visit(tree);
  return tree.toString();
}

const target = path.join(__dirname, '..', 'public', 'rms-app');
fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(path.join(target, 'assets'), { recursive: true });

const copy = (relative) => {
  const file = path.join(from, relative);
  if (!fs.existsSync(file)) fail(`${relative} is missing from ${from}.`);
  fs.mkdirSync(path.dirname(path.join(target, relative)), { recursive: true });
  if (relative === style) fs.writeFileSync(path.join(target, relative), scopeStylesheet(fs.readFileSync(file, 'utf8')));
  else fs.copyFileSync(file, path.join(target, relative));
};
// The module, its stylesheet, then whatever else sits beside them (logo, font, font licence); dot-files and maps stay out.
const walk = (dir, base = '') => fs.readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
  const relative = path.posix.join(base, item.name);
  if (item.name.startsWith('.') || item.name.endsWith('.map')) return [];
  return item.isDirectory() ? walk(path.join(dir, item.name), relative) : [relative];
});
const files = walk(from);
if (!files.includes(entry) || !files.includes(style)) fail('the manifest names files that are not in the build.');
files.forEach(copy);
fs.writeFileSync(path.join(target, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(target, 'VERSION'), `plotune-cloud ${commit}\n`);

const bytes = [...files, 'manifest.json', 'VERSION'].reduce((sum, f) => sum + fs.statSync(path.join(target, f)).size, 0);
console.log(`update-rms-embed: ${files.length} files from plotune-cloud ${commit.slice(0, 10)} (${(bytes / 1024).toFixed(0)} KiB) -> public/rms-app/`);
