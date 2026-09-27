import { getScrollPercent, getNewlyCrossedThresholds, SCROLL_DEPTH_THRESHOLDS } from './scrollDepth';

describe('getScrollPercent', () => {
  test('reports 100% when the page is shorter than the viewport', () => {
    expect(getScrollPercent({ scrollY: 0, viewportHeight: 900, documentHeight: 800 })).toBe(100);
    expect(getScrollPercent({ scrollY: 0, viewportHeight: 900, documentHeight: 900 })).toBe(100);
  });

  test('computes percent scrolled for a page taller than the viewport', () => {
    // 900px viewport, 2900px document: scrolled to the very top is 900/2900 ≈ 31%
    expect(getScrollPercent({ scrollY: 0, viewportHeight: 900, documentHeight: 2900 })).toBe(31);
    // scrolled all the way down: (2000 + 900) / 2900 = 100%
    expect(getScrollPercent({ scrollY: 2000, viewportHeight: 900, documentHeight: 2900 })).toBe(100);
  });

  test('never returns above 100 or below 0', () => {
    expect(getScrollPercent({ scrollY: 999999, viewportHeight: 900, documentHeight: 2900 })).toBe(100);
    expect(getScrollPercent({ scrollY: -50, viewportHeight: 900, documentHeight: 2900 })).toBeGreaterThanOrEqual(0);
  });
});

describe('getNewlyCrossedThresholds', () => {
  test('returns every threshold at or below the current percent on first check', () => {
    expect(getNewlyCrossedThresholds(60, new Set())).toEqual([25, 50]);
    expect(getNewlyCrossedThresholds(100, new Set())).toEqual(SCROLL_DEPTH_THRESHOLDS);
  });

  test('excludes thresholds already fired', () => {
    expect(getNewlyCrossedThresholds(60, new Set([25]))).toEqual([50]);
    expect(getNewlyCrossedThresholds(100, new Set(SCROLL_DEPTH_THRESHOLDS))).toEqual([]);
  });

  test('does not mutate the fired set passed in', () => {
    const fired = new Set([25]);
    getNewlyCrossedThresholds(100, fired);
    expect(fired).toEqual(new Set([25]));
  });
});
