import { useCallback, useRef } from 'react';
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
//
// `ref` is a callback ref, not an object ref: a CTA that mounts after the first render
// (e.g. an article CTA that only renders once its MDX body has loaded) is observed as soon
// as it attaches. It re-arms when `ctaId` or the pathname changes.
//
// Track the CTAs you actually want to measure, not every button: two CTAs in the same
// viewport fire together on load and add no information over one.
export const useCtaTracking = (ctaId, properties = {}) => {
  const { pathname } = useLocation();
  const observerRef = useRef(null);
  const propertiesRef = useRef(properties);
  propertiesRef.current = properties;

  const ref = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      observerRef.current = null;
      posthog.capture('cta_impression', { cta_id: ctaId, path: pathname, ...getFunnelContext(), ...propertiesRef.current });
    }, { threshold: 0.5 });

    observer.observe(node);
    observerRef.current = observer;
  }, [ctaId, pathname]);

  return { ref };
};
