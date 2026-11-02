import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProduct } from '../content/bridgeCatalog';
import { productForPath, recordProductVisit } from '../utils/funnel';

// Remembers, for this browser session, which product area the visitor is in, so the contact page can
// speak about it ("Bridge", "Stream", "Nexus") instead of assuming Nexus. Renders nothing.
const ProductTracker = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const product = productForPath(pathname);
    if (!product) return;
    const slug = product === 'bridge' ? (pathname.match(/^\/bridge\/([a-z0-9-]+)\/?$/i) || [])[1] : null;
    const item = slug && getProduct(slug) ? getProduct(slug).name : '';
    recordProductVisit(product, item);
  }, [pathname]);
  return null;
};

export default ProductTracker;
