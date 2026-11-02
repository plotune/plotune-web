import React, { useEffect, useRef, useState } from 'react';
import { trackBridge } from '../../utils/bridgeFunnel';

// The Plotune Bridge family film (public/assets/bridge/video/): four product shots and a brand end card.
// A wide cut for desktop and a separate vertical cut for phones (different framing, shorter shots), each
// as WebM (smaller) with an MP4 fallback.
//
// Behaviour, on purpose:
//  - The poster is a plain <picture> (the right poster for the screen width is chosen by CSS, so there is
//    no flash of the wrong crop); the video is only fetched once it scrolls into view (preload="none").
//  - It plays muted and looping while visible and pauses off-screen (battery and bandwidth).
//  - A visible pause/play button (autoplaying motion needs one). A visitor's pause is respected.
//  - With "reduce motion" set it does not autoplay; the poster shows and the button starts it.
const FILM = {
  wide: { webm: '/assets/bridge/video/bridge-family.webm', mp4: '/assets/bridge/video/bridge-family.mp4' },
  tall: { webm: '/assets/bridge/video/bridge-family-mobile.webm', mp4: '/assets/bridge/video/bridge-family-mobile.mp4' },
};
const POSTER = { wide: '/assets/bridge/video/bridge-family-poster.jpg', tall: '/assets/bridge/video/bridge-family-mobile-poster.jpg' };
const PHONE = '(max-width: 700px)';
const REDUCED = '(prefers-reduced-motion: reduce)';

const matches = (query) => (typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(query) : null);

const BridgeVideo = () => {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const userPaused = useRef(false);
  const reducedRef = useRef(false);
  const startedRef = useRef(false);
  const [tall, setTall] = useState(false);
  const [playing, setPlaying] = useState(false);

  // which cut: follows the screen width, and reacts if the phone is rotated
  useEffect(() => {
    const mq = matches(PHONE);
    if (!mq) return undefined;
    const apply = () => setTall(mq.matches);
    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply); else if (mq.addListener) mq.addListener(apply);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', apply); else if (mq.removeListener) mq.removeListener(apply); };
  }, []);

  useEffect(() => {
    const mq = matches(REDUCED);
    reducedRef.current = Boolean(mq && mq.matches);
  }, []);

  // play while at least a third is on screen, pause when it leaves
  useEffect(() => {
    const video = videoRef.current;
    const wrap = wrapRef.current;
    if (!video || !wrap || typeof IntersectionObserver === 'undefined') return undefined;
    video.muted = true; // autoplay policies need the property, not just the attribute
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !userPaused.current && !reducedRef.current) {
        const attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {}); // blocked: the poster stays
      } else if (!entry.isIntersecting) {
        video.pause();
      }
    }, { threshold: 0.35 });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [tall]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      userPaused.current = true;
      video.pause();
      trackBridge('bridge_video_paused', { cut: tall ? 'vertical' : 'wide' });
    } else {
      userPaused.current = false;
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
    }
  };

  const cut = tall ? 'tall' : 'wide';
  return (
    <figure className="bridge-film" ref={wrapRef}>
      <picture className="bridge-film-poster">
        <source media={PHONE} srcSet={POSTER.tall} />
        <img src={POSTER.wide} alt="" width="1280" height="720" loading="lazy" decoding="async" />
      </picture>
      <video
        key={cut}
        ref={videoRef}
        className={playing ? 'is-on' : ''}
        muted
        loop
        playsInline
        preload="none"
        aria-label="Plotune Bridge CAN, Serial, DAQ and I/O in a short film"
        onPlay={() => {
          setPlaying(true);
          if (!startedRef.current) { startedRef.current = true; trackBridge('bridge_video_started', { cut: tall ? 'vertical' : 'wide' }); }
        }}
        onPause={() => setPlaying(false)}
      >
        <source src={FILM[cut].webm} type="video/webm" />
        <source src={FILM[cut].mp4} type="video/mp4" />
      </video>
      <button type="button" className="bridge-film-toggle" onClick={toggle} aria-label={playing ? 'Pause the film' : 'Play the film'}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">
          {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5l11 7-11 7z" />}
        </svg>
      </button>
    </figure>
  );
};

export default BridgeVideo;
