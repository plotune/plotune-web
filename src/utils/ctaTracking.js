import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { posthog } from '../posthog';
import { getFunnelContext } from './funnel';

// Attach `ref` to a CTA element to fire a `cta_impression` event the first time it's
// actually been scrolled into view (not just present in the DOM -- a CTA sitting below a
// 12-17k px research article or at the bottom of a long page may never be seen at all,
// which looks identical to "seen and ignored" in a raw click count). Spread `onClick` onto
// the same element to fire `cta_clicked` on an actual click. Both carry the same funnel
// context as the rest of the site (segment/article/entry_source), so impression-to-click
// rate can be sliced the same way as everything else, and compared across copy changes.
export const useCtaTracking = (ctaId, properties = {}) => {
  const { pathname } = useLocation();
  const ref = useRef(null);
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !firedRef.current) {
        firedRef.current = true;
        posthog.capture('cta_impression', { cta_id: ctaId, path: pathname, ...getFunnelContext(), ...properties });
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    observer.observe(node);
    return () => observer.disconnect();
  }, [ctaId, pathname]);

  const onClick = () => {
    posthog.capture('cta_clicked', { cta_id: ctaId, path: pathname, ...getFunnelContext(), ...properties });
  };

  return { ref, onClick };
};
