import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import BridgeCarousel from '../components/bridge/BridgeCarousel';
import BridgeCartLink from '../components/bridge/BridgeCartLink';
import BridgeIcon from '../components/bridge/BridgeIcon';
import ProductDiagram from '../components/bridge/ProductDiagram';
import ProductImage from '../components/bridge/ProductImage';
import { PRICE_NOTE, PRODUCTS, getProduct, isPriced, priceLabel } from '../content/bridgeCatalog';
import { ensureItem } from '../utils/bridgeCart';
import { trackBridge } from '../utils/bridgeFunnel';
import { useCtaTracking } from '../utils/ctaTracking';
import { contactHref, withFunnelParams } from '../utils/funnel';
import UseCaseCarousel from '../components/UseCaseCarousel';
import { modelUseCases } from '../content/useCases';

// /bridge/<slug>: one product, the third step of the funnel
//   Plotune Home -> Bridge -> Bridge product -> request (/request) -> sent.
// The page sells one thing: a picture-led first screen with the price and a single primary action,
// then what you get, who it is for and the other Bridges. "Request" puts the product in the cart
// (once, however often it is pressed) and goes to /request. Everything comes from
// src/content/bridgeCatalog.js, so a new model is a new catalog entry, not a new page.

const BridgeProduct = () => {
  const { slug } = useParams();
  const product = getProduct(slug);
  const navigate = useNavigate();
  const heroCta = useCtaTracking('bridge_product_request_hero', { product: slug });
  const bottomCta = useCtaTracking('bridge_product_request_bottom', { product: slug });
  // The pinned Request bar (phones) shows only once the hero's own button has scrolled away, so the
  // same action is never on screen twice. Without IntersectionObserver it simply stays available.
  const heroActionsRef = useRef(null);
  const [heroSeen, setHeroSeen] = useState(true);
  useEffect(() => {
    const node = heroActionsRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => setHeroSeen(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, [slug]);

  if (!product) return <Navigate to="/bridge" replace />;

  const request = (placement) => () => {
    ensureItem(product.id);
    trackBridge('bridge_request_clicked', { product: product.id, placement, priced: isPriced(product) });
    navigate(withFunnelParams('/request'));
  };
  const others = PRODUCTS.filter((p) => p.id !== product.id);
  const slides = product.images.map((image, i) => ({
    key: `${product.id}-${i}`,
    label: image.alt,
    content: <ProductImage product={product} index={i} eager={i === 0} />,
  }));

  return <main className="nexus-design bridge-design bridge-has-sticky">
    <Seo
      title={`Plotune ${product.name}: ${product.tagline.replace(/\.$/, '')}`}
      description={`${product.definition} ${product.blurb}`}
      path={`/bridge/${product.slug}`}
      tag="bridge"
    />

    <section className="design-container nexus-intro">
      <div className="section-index">
        <span><Link to="/bridge">Plotune Bridge</Link> / {product.name}</span>
        <BridgeCartLink fallback={<span>USB-C · Wi-Fi · Nexus-ready</span>} />
      </div>
      <div className="product-spread">
        <div className="product-copy">
          <p className="technical-label">Plotune {product.name}</p>
          <h1>{product.tagline}</h1>
          <p>{product.short}</p>
          <div className="bridge-price" aria-label="Price">
            <strong>{priceLabel(product)}</strong>
            <span>{isPriced(product) ? PRICE_NOTE : 'We quote it when you send your request'}</span>
          </div>
          <div className="design-actions" ref={heroActionsRef}>
            <div>
              <button type="button" className="design-button" ref={heroCta.ref} onClick={request('hero')}>Request {product.name} ↗</button>
              <p className="action-note">No payment now · we reply within 1 business day</p>
            </div>
            <Link className="text-link" to="/bridge#bridge-products">Compare all Bridge products →</Link>
          </div>
        </div>
        <BridgeCarousel label={`${product.name} pictures`} slides={slides} onSlide={(i) => trackBridge('bridge_carousel_slide', { product: product.id, slide: i + 1, placement: 'product' })} />
      </div>
    </section>

    <section className="design-container bridge-stats-section" aria-label={`${product.name} at a glance`}>
      <dl className="bridge-stats">{product.highlights.map(({ value, label }) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl>
    </section>

    <section className="design-container lx-section" id="bridge-model-use-cases">
      <div className="lx-head"><h2>What you can do with {product.name}.</h2></div>
      <UseCaseCarousel items={modelUseCases(product.id)} label={`${product.name} use cases`} layout="grid" />
    </section>

    <section className="design-container bridge-detail bridge-diagram-section">
      <div className="section-index"><span>How it connects</span><span>{product.name}</span></div>
      <ProductDiagram product={product} />
    </section>

    <section className="design-container bridge-detail">
      <div className="section-index"><span>Why it&apos;s different</span><span>{product.name}</span></div>
      <ul className="bridge-icon-tiles">{product.advantages.map(([title, , icon]) => <li key={title}>
        <BridgeIcon name={icon} size={32} />
        <strong>{title}</strong>
      </li>)}</ul>
    </section>

    <section className="design-container bridge-detail">
      <div className="section-index"><span>Built for</span><span>Applications</span></div>
      <ul className="bridge-chips">{product.applications.map((application) => <li key={application}>{application}</li>)}</ul>
      <details className="bridge-specs" onToggle={(e) => { if (e.currentTarget.open) trackBridge('bridge_specs_opened', { product: product.id }); }}>
        <summary>Full specifications</summary>
        <ul className="bridge-features">{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        {product.boundary && <p className="bridge-boundary"><strong>Still to be determined.</strong> {product.boundary}</p>}
      </details>
    </section>

    <section className="design-container bridge-products bridge-others">
      <div className="section-index"><span>The rest of the family</span><Link to="/bridge">All Bridge products ↗</Link></div>
      <div className="bridge-product-grid bridge-product-grid-3">{others.map((other) => (
        <Link className="bridge-card" key={other.id} to={withFunnelParams(`/bridge/${other.slug}`)} onClick={() => trackBridge('bridge_product_clicked', { product: other.id, placement: 'related' })}>
          <ProductImage product={other} index={0} />
          <div className="bridge-card-body">
            <h3>{other.name}</h3>
            <p className="technical-label">{other.tag}</p>
            <p className="bridge-card-price">{priceLabel(other)}</p>
          </div>
        </Link>
      ))}</div>
    </section>

    <section className="closing-section design-container">
      <h2>Get {product.name}<br />on your bench.</h2>
      <div className="design-actions">
        <button type="button" className="design-button" ref={bottomCta.ref} onClick={request('bottom')}>Request {product.name} ↗</button>
        <Link className="text-link" to={contactHref('bridge')}>Questions? Talk to us →</Link>
        <Link className="text-link" to="/nexus">See Plotune Nexus →</Link>
      </div>
    </section>

    <div className={`bridge-sticky${heroSeen ? '' : ' is-visible'}`} role="region" aria-label={`Request ${product.name}`}>
      <div><strong>{product.name}</strong><span>{priceLabel(product)}</span></div>
      <button type="button" className="design-button" onClick={request('sticky')}>Request ↗</button>
    </div>
  </main>;
};

export default BridgeProduct;
