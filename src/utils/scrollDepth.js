// PostHog only attaches max-scroll-percentage as a property on the *next* pageview/pageleave
// event, not as a discrete event of its own, so it can't be filtered on or funneled into
// directly. These are the explicit read-depth checkpoints instead.
export const SCROLL_DEPTH_THRESHOLDS = [25, 50, 75, 90];

// A page shorter than the viewport has no distance to scroll, so its entire content is
// visible on load: treat that as 100%, the same way GA4's enhanced measurement does, rather
// than reporting 0% forever for a page nobody could scroll further into.
export const getScrollPercent = ({ scrollY, viewportHeight, documentHeight }) => {
  const scrollable = documentHeight - viewportHeight;
  if (scrollable <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round(((scrollY + viewportHeight) / documentHeight) * 100)));
};

// Returns the thresholds newly crossed by `percent` that aren't already in `fired`, without
// mutating `fired` itself, so the caller decides when/whether to persist them.
export const getNewlyCrossedThresholds = (percent, fired) =>
  SCROLL_DEPTH_THRESHOLDS.filter((threshold) => percent >= threshold && !fired.has(threshold));
