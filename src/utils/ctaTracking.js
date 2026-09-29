import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { posthog } from '../posthog';
import { getFunnelContext } from './funnel';

// Attach `ref` to a CTA element to fire a `cta_impression` event the first time it's
// actually been scrolled into view (not just present in the DOM -- a CTA sitting below a
// 12-17k px research article or at the bottom of a long page may never be seen at all,
// which looks identical to "seen and ignored" in a raw click count). This is deliberately
// impression-only: PostHog's autocapture already records clicks (including which element
// and its text) without any custom event, so a duplicate cta_clicked event here would just
// be redundant. Impression carries the same funnel context as the rest of the site
// (segment/article/entry_source), so it can be sliced the same way as everything else.
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

  return { ref };
};
