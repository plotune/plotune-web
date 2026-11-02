import React, { useCallback, useRef, useState } from 'react';

// A swipeable carousel: native horizontal scroll with snap points, so touch, trackpad and keyboard
// scrolling all work without script; the arrows and dots are an addition. No autoplay (moving
// content needs a pause control, and an unrequested slide change takes the picture away from
// someone studying it).
//
// slides: [{ key, label, content }]. `label` names the slide for screen readers ("Bridge CAN").
// onSlide(index) fires when the visitor moves to another slide (arrows, dots or swipe), never on load.
const BridgeCarousel = ({ label, slides, onSlide = () => {}, className = '' }) => {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const last = slides.length - 1;

  const settle = useCallback((next) => {
    setIndex((current) => {
      if (current !== next) onSlide(next);
      return next;
    });
  }, [onSlide]);

  const goTo = (target) => {
    const el = trackRef.current;
    const next = Math.max(0, Math.min(last, target));
    if (el && typeof el.scrollTo === 'function') {
      const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollTo({ left: next * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    }
    settle(next);
  };

  const handleScroll = (e) => {
    const el = e.currentTarget;
    if (!el.clientWidth) return;
    settle(Math.max(0, Math.min(last, Math.round(el.scrollLeft / el.clientWidth))));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
  };

  return (
    <div className={`bridge-carousel ${className}`} role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="bridge-carousel-track" ref={trackRef} onScroll={handleScroll} onKeyDown={handleKeyDown} tabIndex={0}>
        {slides.map((slide, i) => (
          <div className="bridge-carousel-slide" key={slide.key} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}: ${slide.label}`}>
            {slide.content}
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="bridge-carousel-bar">
          <button type="button" className="bridge-carousel-btn" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous slide">←</button>
          <div className="bridge-carousel-dots">
            {slides.map((slide, i) => (
              <button type="button" key={slide.key} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}: ${slide.label}`} aria-current={i === index ? 'true' : undefined} />
            ))}
          </div>
          <button type="button" className="bridge-carousel-btn" onClick={() => goTo(index + 1)} disabled={index === last} aria-label="Next slide">→</button>
        </div>
      )}
    </div>
  );
};

export default BridgeCarousel;
