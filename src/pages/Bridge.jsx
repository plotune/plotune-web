import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import BridgeCarousel from '../components/bridge/BridgeCarousel';
import BridgeCartLink from '../components/bridge/BridgeCartLink';
import ProductImage from '../components/bridge/ProductImage';
import { COMMON_FEATURES, PRODUCTS, priceLabel } from '../content/bridgeCatalog';
import { trackBridge } from '../utils/bridgeFunnel';
import { useCtaTracking } from '../utils/ctaTracking';
import { withFunnelParams } from '../utils/funnel';

// /bridge: the family landing page, the second step of the funnel
//   Plotune Home -> Bridge -> Bridge product (/bridge/<slug>) -> request (/request) -> sent.
// It stays about the products and what every Bridge shares. Technical detail lives on each product
// page; this page's one job is to send the visitor to the right one. Product facts, images and
// prices all come from src/content/bridgeCatalog.js.

const productHref = (product) => withFunnelParams(`/bridge/${product.slug}`);
const clickProduct = (product, placement) => () => trackBridge('bridge_product_clicked', { product: product.id, placement });

const STEPS = [
  ['Choose your Bridge', 'Pick the interface your bench needs, or combine several.'],
  ['Send a request', 'Tell us where to send the offer. Nothing is charged and nothing is paid on this site.'],
  ['We confirm and agree payment', 'Within 1 business day we confirm availability, tax and shipping, and agree the payment method with you by email.'],
];

export default function Bridge() {
  const chooseCta = useCtaTracking('bridge_hero_choose');
  const closingCta = useCtaTracking('bridge_closing_choose');

  const slides = PRODUCTS.map((product, i) => ({
    key: product.id,
    label: product.name,
    content: (
      <div className="bridge-hero-slide">
        <Link to={productHref(product)} onClick={clickProduct(product, 'hero_carousel')} tabIndex={-1} aria-hidden="true">
          <ProductImage product={product} index={0} eager={i === 0} />
        </Link>
        <div className="bridge-hero-caption">
          <div>
            <p className="technical-label">0{i + 1} / Plotune</p>
            <h3>{product.name}</h3>
            <p>{product.short}</p>
          </div>
          <Link className="text-link" to={productHref(product)} onClick={clickProduct(product, 'hero_carousel')}>View {product.name} →</Link>
        </div>
      </div>
    ),
  }));

  return <main className="nexus-design bridge-design">
    <Seo
      title="Plotune Bridge: Connected Hardware Interfaces for CAN, Serial, DAQ and I/O"
      description="Plotune Bridge is a family of compact hardware interfaces for CAN, serial, data acquisition and I/O. USB-C and Wi-Fi connectivity, browser-based operation and native Plotune Nexus integration for AI-powered test automation."
      path="/bridge"
      tag="bridge"
    />

    <section className="design-container nexus-intro">
      <div className="section-index"><span>Plotune Bridge / Connected hardware interfaces</span><BridgeCartLink fallback={<span>CAN · Serial · DAQ · I/O</span>} /></div>
      <div className="product-spread">
        <div className="product-copy">
          <p className="technical-label">Plotune Bridge</p>
          <h1>Connect your hardware.<br />Access it anywhere.<br /><span>Automate with AI.</span></h1>
          <p>A family of compact hardware interfaces that connect physical engineering systems to browser-based workflows, remote access and automated testing.</p>
          <div className="design-actions">
            <div>
              <a className="design-button" href="#bridge-products" ref={chooseCta.ref} onClick={() => trackBridge('bridge_choose_clicked', { placement: 'hero' })}>Choose Your Bridge ↓</a>
              <p className="action-note">USB-C and Wi-Fi · browser-based · Nexus-ready</p>
            </div>
          </div>
        </div>
        <BridgeCarousel label="Plotune Bridge products" slides={slides} onSlide={(i) => trackBridge('bridge_carousel_slide', { slide: PRODUCTS[i].id, placement: 'hero' })} />
      </div>
    </section>

    <section className="design-container bridge-products" id="bridge-products">
      <div className="section-index"><span>01 / Choose your Bridge</span><span>Four interfaces</span></div>
      <h2>Four interfaces.<br />Pick the one your bench needs.</h2>
      <div className="bridge-product-grid">{PRODUCTS.map((product, i) => (
        <Link className="bridge-card" key={product.id} to={productHref(product)} onClick={clickProduct(product, 'grid')}>
          <ProductImage product={product} index={0} />
          <div className="bridge-card-body">
            <p className="technical-label">0{i + 1}</p>
            <h3>{product.name}</h3>
            <p>{product.short}</p>
            <p className="bridge-card-price">{priceLabel(product)}</p>
            <span className="text-link">View {product.name} →</span>
          </div>
        </Link>
      ))}</div>
    </section>

    <section className="nexus-workflow">
      <div className="design-container">
        <div className="section-index"><span>02 / On every Bridge</span><span>One connected ecosystem</span></div>
        <h2>More than an adapter.<br />A connected test workflow.</h2>
        <p>A Bridge is not just a cheaper way to plug a bus into a laptop. It joins your hardware to remote access, measurement, control and automated engineering workflows, and that is what sets the family apart.</p>
        <div className="bridge-eco-grid bridge-eco-grid-3">{COMMON_FEATURES.map(([title, copy]) => <article key={title}>
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>)}</div>
      </div>
    </section>

    <section className="design-container bridge-how">
      <div className="section-index"><span>03 / How ordering works</span><span>No payment on this site</span></div>
      <h2>Request it.<br />We take it from there.</h2>
      <ol className="workflow-sequence">{STEPS.map(([title, copy], i) => <li key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
    </section>

    <section className="closing-section design-container">
      <p className="technical-label">From hardware connectivity to intelligent automation</p>
      <h2>Plotune Bridge connects your devices.<br /><span>Plotune Nexus makes them intelligent.</span></h2>
      <p>Explore the Plotune Bridge family and find the right interface for your next project.</p>
      <div className="design-actions">
        <a className="design-button" href="#bridge-products" ref={closingCta.ref} onClick={() => trackBridge('bridge_choose_clicked', { placement: 'closing' })}>Choose Your Bridge ↑</a>
        <Link className="text-link" to={withFunnelParams('/contact')}>Not sure which one? Talk to us →</Link>
        <Link className="text-link" to="/nexus">See Plotune Nexus →</Link>
      </div>
    </section>
  </main>;
}
