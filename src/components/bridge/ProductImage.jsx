import React from 'react';

// One product picture. With a `src` in the catalog it is a normal lazy image; without one it is a
// neutral dark panel carrying the product name, so pages look finished while the photos are
// still being prepared. `eager` is for the first visible image (it is the page's LCP).
const ProductImage = ({ product, index = 0, eager = false, className = '' }) => {
  const image = product.images[index] || product.images[0];
  if (image && image.src) {
    return <img className={`bridge-img ${className}`} src={image.src} alt={image.alt} width="1200" height="900" loading={eager ? 'eager' : 'lazy'} decoding="async" />;
  }
  return (
    <div className={`bridge-ph ${className}`} role="img" aria-label={image ? image.alt : product.name}>
      <svg viewBox="0 0 200 120" aria-hidden="true" focusable="false">
        <rect x="30" y="30" width="140" height="60" rx="10" />
        <circle cx="152" cy="46" r="3.5" />
        <path d="M30 52 h-12 v16 h12 M170 52 h12 v16 h-12" />
      </svg>
      <span>{product.name.toUpperCase()}</span>
    </div>
  );
};

export default ProductImage;
