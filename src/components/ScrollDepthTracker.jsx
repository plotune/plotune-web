import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { posthog } from '../posthog';
import { getScrollPercent, getNewlyCrossedThresholds } from '../utils/scrollDepth';

// Fires a posthog 'scroll_depth' event the first time a page view crosses each of
// 25/50/75/90%, so read depth can be filtered and funneled on directly in PostHog.
// Mount this once near the router root, next to ScrollToTop.
const ScrollDepthTracker = () => {
  const { pathname } = useLocation();
  const firedRef = useRef(new Set());

  useEffect(() => {
    firedRef.current = new Set();

    const checkDepth = () => {
      const percent = getScrollPercent({
        scrollY: window.scrollY,
        viewportHeight: document.documentElement.clientHeight,
        documentHeight: document.documentElement.scrollHeight,
      });
      getNewlyCrossedThresholds(percent, firedRef.current).forEach((threshold) => {
        firedRef.current.add(threshold);
        posthog.capture('scroll_depth', { percent: threshold, path: pathname });
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        checkDepth();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Covers a page shorter than the viewport, and layout that settles after mount (hero
    // animations, images loading) without waiting for an actual scroll event to happen.
    const settleTimer = window.setTimeout(checkDepth, 800);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(settleTimer);
    };
  }, [pathname]);

  return null;
};

export default ScrollDepthTracker;
