import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import CartRequestForm from '../components/bridge/CartRequestForm';
import { REPLY_TIME } from '../components/OrderRequestForm';
import { PRODUCTS, isPriced, priceLabel } from '../content/bridgeCatalog';
import { MAX_QTY, cartCount, cartTotal, clampQty, clearCart, removeItem, setQty, useCart, withProducts } from '../utils/bridgeCart';
import { trackBridge } from '../utils/bridgeFunnel';
import { withFunnelParams } from '../utils/funnel';
import { usd } from '../utils/nexusOffer';

// /request: the shared request step, the last page of the funnel
//   Plotune Home -> Bridge -> Bridge product -> request -> we check the sheet and email -> payment -> sale.
// It shows the cart (Bridge products today; any catalog line can join later), what happens next,
// and the form. No payment is taken. A saved request is emailed to us and recorded in the Google
// sheet by the same endpoint as the Nexus request. It is deliberately not indexed: it is a working
// page, not something to land on from search.

const BridgeRequest = () => {
  const items = useCart();
  const lines = withProducts(items);
  const { complete, total } = cartTotal(items);
  const [sent, setSent] = useState(null);
  const viewedRef = useRef(false);
  const doneRef = useRef(null);

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackBridge('bridge_request_viewed', { lines: items.length, units: cartCount(items), products: items.map((item) => item.id).join(',') });
  }, [items]);

  useEffect(() => { if (sent && doneRef.current) doneRef.current.focus(); }, [sent]);

  const summary = lines.map((line) => `${line.qty} × ${line.product.name}`).join(', ');
  const quote = { currency: 'USD', total };

  const handleSent = (info) => {
    setSent({ ...info, summary });
    if (info.status === 'sent') clearCart(); // keep the cart on a preview, nothing was sent
  };

  return <main className="nexus-design bridge-design">
    <Seo title="Your Plotune request" description="Send your Plotune Bridge request." path="/request" />
    <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>

    <section className="design-container nexus-intro">
      <div className="section-index"><span>Plotune / Your request</span><span>No payment on this site</span></div>

      {sent ? (
        <div className="offer-done bridge-done" role="status">
          {sent.status === 'sent' ? (
            <>
              <h1 ref={doneRef} tabIndex={-1}>Request received</h1>
              <p>{sent.summary}.</p>
              <p>
                We&apos;ll email <span className="ph-no-capture">{sent.email}</span> {REPLY_TIME} with availability, the exact tax and
                shipping for {sent.country}, and the payment options. Nothing is charged until you approve.
              </p>
              <div className="design-actions">
                <Link className="design-button" to="/bridge">Back to Plotune Bridge ↗</Link>
                <Link className="text-link" to="/nexus">See Plotune Nexus →</Link>
              </div>
            </>
          ) : (
            <>
              <h1 ref={doneRef} tabIndex={-1}>Preview only: nothing was sent</h1>
              <p>The request form isn&apos;t connected in this build.</p>
            </>
          )}
        </div>
      ) : !lines.length ? (
        <div className="bridge-empty">
          <h1>Your request is empty.</h1>
          <p>Pick a Bridge and it appears here, ready to send.</p>
          <ul className="bridge-chips">{PRODUCTS.map((product) => <li key={product.id}><Link to={withFunnelParams(`/bridge/${product.slug}`)}>{product.name}</Link></li>)}</ul>
          <div className="design-actions">
            <Link className="design-button" to="/bridge">See all Bridge products ↗</Link>
            <Link className="text-link" to="/nexus/pricing">Plotune Nexus pricing →</Link>
          </div>
        </div>
      ) : (
        <div className="bridge-request-layout">
          <div>
            <h1>Your request</h1>
            <ul className="bridge-lines">{lines.map(({ product, qty }) => (
              <li key={product.id}>
                <div className="bridge-line-main">
                  <Link to={withFunnelParams(`/bridge/${product.slug}`)}><strong>{product.name}</strong></Link>
                  <span>{product.short}</span>
                </div>
                <div className="bridge-qty" role="group" aria-label={`Quantity of ${product.name}`}>
                  <button type="button" onClick={() => { setQty(product.id, qty - 1); trackBridge('bridge_request_qty_changed', { product: product.id, qty: clampQty(qty - 1) }); }} disabled={qty <= 1} aria-label={`Decrease quantity of ${product.name}`}>−</button>
                  <input type="number" inputMode="numeric" min="1" max={MAX_QTY} value={qty} onChange={(e) => setQty(product.id, e.target.value)} aria-label={`${product.name} quantity`} />
                  <button type="button" onClick={() => { setQty(product.id, qty + 1); trackBridge('bridge_request_qty_changed', { product: product.id, qty: clampQty(qty + 1) }); }} disabled={qty >= MAX_QTY} aria-label={`Increase quantity of ${product.name}`}>+</button>
                </div>
                <div className="bridge-line-price">{isPriced(product) ? usd(product.price * qty) : priceLabel(product)}{isPriced(product) && qty > 1 && <small>{usd(product.price)} each</small>}</div>
                <button type="button" className="bridge-remove" onClick={() => { removeItem(product.id); trackBridge('bridge_request_removed', { product: product.id }); }} aria-label={`Remove ${product.name}`}>Remove</button>
              </li>
            ))}</ul>
            <p><Link className="text-link" to="/bridge#bridge-products">+ Add another Bridge</Link></p>

            <div className="bridge-total">
              <span>Estimated total</span>
              <strong>{complete ? usd(total) : 'To be quoted'}</strong>
            </div>
            <p className="offer-terms">
              {complete ? 'Prices are in USD, excluding VAT / sales tax, shipping and any import duties. We confirm the exact amounts for your country before you pay.' : 'We quote your request personally, including tax, shipping and any import duties for your country.'}
            </p>
            <ol className="offer-steps bridge-next">
              <li><span>01</span><div><strong>You send this request</strong><div>No payment, no card details.</div></div></li>
              <li><span>02</span><div><strong>We check it and email you</strong><div>{`Availability, the exact tax and shipping, ${REPLY_TIME}.`}</div></div></li>
              <li><span>03</span><div><strong>We agree the payment method</strong><div>You approve the invoice before anything is charged.</div></div></li>
            </ol>
          </div>
          <CartRequestForm items={items} quote={quote} track={trackBridge} onSent={handleSent} />
        </div>
      )}
    </section>
  </main>;
};

export default BridgeRequest;
