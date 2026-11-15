#!/usr/bin/env node
// Vendors the RMS browser client into public/rms-app/.
//
//   (in plotune-cloud)  npm --prefix services/rms run build:embed
//   (here)              node scripts/update-rms-embed.cjs <path to services/rms/dist-embed> [--commit=<plotune-cloud sha>]
//
// It replaces public/rms-app/ with the built files (rms-loader.js, manifest.json, the content-hashed module and
// scoped stylesheet, logo, font and its licence) and records the plotune-cloud commit in VERSION. Nothing is
// fetched or run, and no file is edited.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.join('=')]; }));
const source = args.find((a) => !a.startsWith('--'));
const fail = (message) => { console.error(`update-rms-embed: ${message}`); process.exit(1); };
if (!source) fail('usage: node scripts/update-rms-embed.cjs <services/rms/dist-embed> [--commit=<sha>]');

const from = path.resolve(source);
const manifestPath = path.join(from, 'manifest.json');
if (!fs.existsSync(manifestPath)) fail(`${manifestPath} not found; run "npm --prefix services/rms run build:embed" first.`);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const entry = manifest['src/embed.tsx']?.file;
const style = manifest['style.css']?.file;
if (!entry || !style) fail('the manifest has no "src/embed.tsx" and "style.css" entries.');
if (!fs.existsSync(path.join(from, 'rms-loader.js'))) fail('rms-loader.js is missing from the build.');

let commit = flags.commit;
if (!commit) {
  try { commit = execFileSync('git', ['-C', from, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); } catch { /* handled below */ }
}
if (!/^[0-9a-f]{40}$/.test(commit || '')) fail('could not read the plotune-cloud commit; pass --commit=<40-character sha>.');

const target = path.join(__dirname, '..', 'public', 'rms-app');
fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });

// Everything the build wrote; dot-files and maps stay out.
const walk = (dir, base = '') => fs.readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
  const relative = path.posix.join(base, item.name);
  if (item.name.startsWith('.') || item.name.endsWith('.map')) return [];
  return item.isDirectory() ? walk(path.join(dir, item.name), relative) : [relative];
});
const files = walk(from);
if (!files.includes(entry) || !files.includes(style)) fail('the manifest names files that are not in the build.');
files.forEach((relative) => {
  fs.mkdirSync(path.dirname(path.join(target, relative)), { recursive: true });
  fs.copyFileSync(path.join(from, relative), path.join(target, relative));
});
fs.writeFileSync(path.join(target, 'VERSION'), `plotune-cloud ${commit}\n`);

const bytes = [...files, 'VERSION'].reduce((sum, f) => sum + fs.statSync(path.join(target, f)).size, 0);
console.log(`update-rms-embed: ${files.length} files from plotune-cloud ${commit.slice(0, 10)} (${(bytes / 1024).toFixed(0)} KiB) -> public/rms-app/`);
