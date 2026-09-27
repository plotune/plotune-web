import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { posthog } from '../posthog';
import { getScrollPercent, getNewlyCrossedThresholds } from '../utils/scrollDepth';

// A threshold only counts once scroll position has gone still for SETTLE_MS: that's what
// actually tells "paused here" apart from "flew past on the way further down." A genuine
// single fast fling to the bottom still fires every threshold it passed through once it
// settles there — that's a true reading of where the visitor ended up, not a bug.
//
// This also solves, for free, a real false-positive this used to have: ScrollToTop (mounted
// alongside this) runs window.scrollTo({top: 0, behavior: 'smooth'}) on every route change,
// animating from the OLD page's scroll offset against the NEW page's DOM. That animation
// fires a stream of native scroll events while it's moving, which keeps resetting this same
// timer, so it can never evaluate mid-animation — only once the reset has actually finished.
const SETTLE_MS = 700;

// Fires a posthog 'scroll_depth' event the first time a page view settles past each of
// 25/50/75/90%, so read depth can be filtered and funneled on directly in PostHog.
// seconds_since_page_load rides along on every event as supplementary context (a fast
// scroll/skim is still real engagement — this just makes it visible, not filtered out).
// Mount this once near the router root, next to ScrollToTop.
const ScrollDepthTracker = () => {
  const { pathname } = useLocation();
  const firedRef = useRef(new Set());
  const pageLoadAtRef = useRef(Date.now());

  useEffect(() => {
    firedRef.current = new Set();
    pageLoadAtRef.current = Date.now();

    const evaluate = () => {
      const percent = getScrollPercent({
        scrollY: window.scrollY,
        viewportHeight: document.documentElement.clientHeight,
        documentHeight: document.documentElement.scrollHeight,
      });
      getNewlyCrossedThresholds(percent, firedRef.current).forEach((threshold) => {
        firedRef.current.add(threshold);
        posthog.capture('scroll_depth', {
          percent: threshold,
          path: pathname,
          seconds_since_page_load: Math.round((Date.now() - pageLoadAtRef.current) / 100) / 10,
        });
      });
    };

    // The initial timer doubles as the "page shorter than the viewport" / "never scrolled"
    // case: if nothing ever moves, it still evaluates once, SETTLE_MS after mount.
    let settleTimer = window.setTimeout(evaluate, SETTLE_MS);
    const onScroll = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(evaluate, SETTLE_MS);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(settleTimer);
    };
  }, [pathname]);

  return null;
};

export default ScrollDepthTracker;
