import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import BridgeCarousel from '../components/bridge/BridgeCarousel';
import BridgeCartLink from '../components/bridge/BridgeCartLink';
import BridgeIcon from '../components/bridge/BridgeIcon';
import BridgeVideo from '../components/bridge/BridgeVideo';
import ProductImage from '../components/bridge/ProductImage';
import SystemDiagram from '../components/bridge/SystemDiagram';
import UseCaseCarousel from '../components/UseCaseCarousel';
import { homeUseCases } from '../content/useCases';
import { COMMON_FEATURES, PRODUCTS, priceLabel } from '../content/bridgeCatalog';
import { trackBridge } from '../utils/bridgeFunnel';
import { useCtaTracking } from '../utils/ctaTracking';
import { contactHref, withFunnelParams } from '../utils/funnel';

// /bridge: the family landing page, the second step of the funnel
//   Plotune Home -> Bridge -> Bridge product (/bridge/<slug>) -> request (/request) -> sent.
// Built to be scanned, not read: pictures, one system diagram, icon tiles and a three-step strip,
// with a sentence or less of text per block. Detail lives on the product pages. Product facts,
// images and prices all come from src/content/bridgeCatalog.js. A test caps the visible word count.

const productHref = (product) => withFunnelParams(`/bridge/${product.slug}`);
const clickProduct = (product, placement) => () => trackBridge('bridge_product_clicked', { product: product.id, placement });

const STEPS = [
  ['Choose your Bridge', 'choose'],
  ['Send a request', 'send'],
  ['We confirm and agree payment', 'confirm'],
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
            <h3>{product.name}</h3>
            <p className="technical-label">{product.tag}</p>
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
      <div className="section-index"><span>Plotune Bridge</span><BridgeCartLink fallback={<span>CAN · Serial · DAQ · I/O</span>} /></div>
      <div className="product-spread">
        <div className="product-copy">
          <h1>Connect your hardware.<br />Access it anywhere.<br /><span>Automate with AI.</span></h1>
          <div className="design-actions">
            <div>
              <a className="design-button" href="#bridge-products" ref={chooseCta.ref} onClick={() => trackBridge('bridge_choose_clicked', { placement: 'hero' })}>Choose Your Bridge ↓</a>
            </div>
          </div>
        </div>
        <BridgeCarousel label="Plotune Bridge products" slides={slides} onSlide={(i) => trackBridge('bridge_carousel_slide', { slide: PRODUCTS[i].id, placement: 'hero' })} />
      </div>
    </section>

    <section className="design-container bridge-film-section" aria-label="Plotune Bridge film">
      <BridgeVideo />
    </section>

    <section className="design-container bridge-products" id="bridge-products">
      <div className="section-index"><span>Choose your Bridge</span><span>Four interfaces</span></div>
      <div className="bridge-product-grid">{PRODUCTS.map((product) => (
        <Link className="bridge-card" key={product.id} to={productHref(product)} onClick={clickProduct(product, 'grid')}>
          <ProductImage product={product} index={0} />
          <div className="bridge-card-body">
            <h3>{product.name}</h3>
            <p className="technical-label">{product.tag}</p>
            <p className="bridge-card-price">{priceLabel(product)}</p>
            <span className="text-link">View {product.name} →</span>
          </div>
        </Link>
      ))}</div>
    </section>

    <section className="design-container lx-section" id="bridge-use-cases">
      <div className="lx-head"><h2>What you can do with Bridge.</h2><p className="lx-sub">Four ways teams use a Bridge on the bench.</p></div>
      <UseCaseCarousel items={homeUseCases().filter((u) => u.group === 'Bridge')} label="Bridge use cases" layout="grid" />
    </section>

    <section className="nexus-workflow">
      <div className="design-container">
        <div className="section-index"><span>On every Bridge</span><span>One workflow</span></div>
        <h2>Every Bridge.<br />One connected workflow.</h2>
        <SystemDiagram />
        <ul className="bridge-icon-row">{COMMON_FEATURES.map(([title, , icon]) => <li key={title}>
          <BridgeIcon name={icon} />
          <span>{title}</span>
        </li>)}</ul>
      </div>
    </section>

    <section className="design-container bridge-how">
      <div className="section-index"><span>How ordering works</span><span>No payment on this site</span></div>
      <ol className="bridge-steps">{STEPS.map(([title, icon], i) => <li key={title}>
        <span className="bridge-step-icon"><BridgeIcon name={icon} size={32} /></span>
        <span className="technical-label">0{i + 1}</span>
        <strong>{title}</strong>
      </li>)}</ol>
    </section>

    <section className="closing-section design-container">
      <h2>Plotune Bridge connects your devices.<br /><span>Plotune Nexus makes them intelligent.</span></h2>
      <div className="design-actions">
        <a className="design-button" href="#bridge-products" ref={closingCta.ref} onClick={() => trackBridge('bridge_choose_clicked', { placement: 'closing' })}>Choose Your Bridge ↑</a>
        <Link className="text-link" to={contactHref('bridge')}>Not sure which one? Talk to us →</Link>
        <Link className="text-link" to="/nexus">See Plotune Nexus →</Link>
      </div>
    </section>
  </main>;
}
