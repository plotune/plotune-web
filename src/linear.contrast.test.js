import fs from 'fs';
import path from 'path';

// The Linear-style layer keeps its text colours on tokens. This guards the pairs people read:
// body, muted and faint text on the page and card grounds, links on white, white text on the accent.
const css = fs.readFileSync(path.join(__dirname, 'index.css'), 'utf8') + fs.readFileSync(path.join(__dirname, 'linear.css'), 'utf8');
const token = (name) => {
  const m = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token ${name} not found`);
  return m[1];
};
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

const grounds = { page: token('--paper'), card: '#ffffff', sunken: '#f3f4f6' };

test.each(Object.entries(grounds))('ink, muted and faint text reach AA on the %s ground', (_, ground) => {
  expect(ratio(token('--ink'), ground)).toBeGreaterThanOrEqual(4.5);
  expect(ratio('#5d626c', ground)).toBeGreaterThanOrEqual(4.5); // muted
  expect(ratio(token('--faint'), ground)).toBeGreaterThanOrEqual(4.5);
});

test('large decorative headline words reach the 3:1 large-text threshold', () => {
  expect(ratio(token('--faint-large'), grounds.page)).toBeGreaterThanOrEqual(3);
});

test('accent links and buttons are readable', () => {
  expect(ratio(token('--accent'), '#ffffff')).toBeGreaterThanOrEqual(4.5); // links on white
  expect(ratio('#ffffff', token('--accent'))).toBeGreaterThanOrEqual(4.5); // button label
  expect(ratio(token('--accent'), '#e8eef6')).toBeGreaterThanOrEqual(4.5); // chip on the soft accent ground
});
