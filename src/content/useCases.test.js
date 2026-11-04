import fs from 'fs';
import path from 'path';
import ART from './useCaseArt';
import { GROUPS, USE_CASES, homeUseCases, modelUseCases } from './useCases';

const linearCss = fs.readFileSync(path.join(__dirname, '..', 'linear.css'), 'utf8');

test('groups hold the agreed number of use cases', () => {
  const count = (g) => USE_CASES.filter((u) => u.group === g).length;
  expect(GROUPS).toEqual(['Nexus', 'Bridge', 'Stream']);
  expect(count('Nexus')).toBe(4);
  expect(count('Bridge')).toBe(12);
  expect(count('Stream')).toBe(4);
});

test('every Bridge model has three use cases and exactly one of them is shown on the home page', () => {
  ['can', 'serial', 'daq', 'io'].forEach((model) => {
    expect(modelUseCases(model)).toHaveLength(3);
    expect(modelUseCases(model).filter((u) => u.home)).toHaveLength(1);
  });
  const home = homeUseCases();
  expect(home.filter((u) => u.group === 'Nexus')).toHaveLength(4);
  expect(home.filter((u) => u.group === 'Bridge')).toHaveLength(4);
  expect(home.filter((u) => u.group === 'Stream')).toHaveLength(4);
});

test('titles are unique and each entry is complete', () => {
  const titles = USE_CASES.map((u) => u.title);
  expect(new Set(titles).size).toBe(titles.length);
  USE_CASES.forEach((u) => {
    expect(u.body.length).toBeGreaterThan(20);
    expect(u.cta).toBeTruthy();
    expect(u.href).toMatch(/^\/[a-z0-9/-]+$/);
    expect(ART[u.art]).toBeTruthy();
  });
});

test('cards send each group to the right funnel step', () => {
  USE_CASES.filter((u) => u.group === 'Nexus').forEach((u) => expect(u.href).toMatch(/^\/solutions\//));
  USE_CASES.filter((u) => u.group === 'Stream').forEach((u) => expect(u.href).toBe('/stream/demo'));
  USE_CASES.filter((u) => u.group === 'Bridge').forEach((u) => expect(u.href).toBe(`/bridge/${u.model}`));
});

test('use case copy states no prices', () => {
  USE_CASES.forEach((u) => expect(`${u.title} ${u.body}`).not.toMatch(/\$\s?\d/));
});

test('illustrations are inert SVG: no scripts, handlers, external loads or links', () => {
  Object.entries(ART).forEach(([key, svg]) => {
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).not.toMatch(/<script|javascript:|\son[a-z]+\s*=|<foreignObject|<image|<a\s|href=|xlink:|url\(\s*['"]?https?:/i);
    expect(key).toBeTruthy();
  });
});

test('every animation class used by an illustration is defined in linear.css', () => {
  const used = new Set();
  Object.values(ART).forEach((svg) => {
    (svg.match(/class="[^"]+"/g) || []).forEach((attr) => attr.slice(7, -1).split(/\s+/).filter((c) => c.startsWith('uca-')).forEach((c) => used.add(c)));
  });
  // uca-sc2 is a static class: that illustration does not animate
  used.delete('uca-sc2');
  used.forEach((cls) => expect(linearCss).toContain(`.${cls}`));
});

test('animations stop under prefers-reduced-motion', () => {
  const reduced = linearCss.slice(linearCss.indexOf('@media (prefers-reduced-motion: reduce)'));
  ['.lx-wire::after', '.uca-fr', '.uca-pn', '.uca-tk', '.uca-msg', '.uca-sc', '.uca-lv'].forEach((sel) => expect(reduced).toContain(sel));
});
