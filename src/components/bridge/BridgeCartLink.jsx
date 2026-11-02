import React from 'react';
import { Link } from 'react-router-dom';
import { cartCount, useCart } from '../../utils/bridgeCart';
import { withFunnelParams } from '../../utils/funnel';

// "Your request (2) →" once something is in the cart, otherwise whatever `fallback` is. It lives
// inside an existing line of text (the section index), so it appears without moving the layout.
const BridgeCartLink = ({ fallback = null }) => {
  const items = useCart();
  const count = cartCount(items);
  if (!count) return fallback;
  return <Link to={withFunnelParams('/request')}>Your request ({count}) →</Link>;
};

export default BridgeCartLink;
