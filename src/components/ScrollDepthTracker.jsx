import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { posthog } from '../posthog';
import { getScrollPercent, getNewlyCrossedThresholds } from '../utils/scrollDepth';

// ScrollToTop (mounted alongside this) runs window.scrollTo({top: 0, behavior: 'smooth'})
// on every route change, animating from the OLD page's scroll offset down to 0 against the
// NEW page's DOM. Navigating from a long page to a shorter one, that animation transiently
// sweeps window.scrollY through values that read as deep into the new, shorter page before
// settling at 0 — a false reading with nothing to do with the visitor actually scrolling.
// Depth checks stay disarmed until that animation has had time to finish.
const ARM_DELAY_MS = 900;

// Fires a posthog 'scroll_depth' event the first time a page view crosses each of
// 25/50/75/90%, so read depth can be filtered and funneled on directly in PostHog.
// seconds_since_page_load rides along on every event so a genuine fast scroll/skim (a
// real, if shallow, engagement) can be told apart from noise once it's in PostHog.
// Mount this once near the router root, next to ScrollToTop.
const ScrollDepthTracker = () => {
  const { pathname } = useLocation();
  const firedRef = useRef(new Set());
  const pageLoadAtRef = useRef(Date.now());
  const armedRef = useRef(false);

  useEffect(() => {
    firedRef.current = new Set();
    pageLoadAtRef.current = Date.now();
    armedRef.current = false;

    const checkDepth = () => {
      if (!armedRef.current) return;
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
    // Arms once ScrollToTop's own animation has had time to settle, then runs one check
    // immediately — covering a page shorter than the viewport (nothing to scroll into)
    // without waiting for a real scroll event.
    const armTimer = window.setTimeout(() => {
      armedRef.current = true;
      checkDepth();
    }, ARM_DELAY_MS);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(armTimer);
    };
  }, [pathname]);

  return null;
};

export default ScrollDepthTracker;
