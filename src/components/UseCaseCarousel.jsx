import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ART from '../content/useCaseArt';
import { withFunnelParams } from '../utils/funnel';

// Illustrated use case cards in a horizontal scroll-snap strip. When the cards belong to more than
// one group (Nexus, Bridge, Stream), group chips jump to the first card of a group and follow the
// scroll position. Illustrations are static first-party SVG strings (see content/useCaseArt.js).
export default function UseCaseCarousel({ items, label = 'Use cases', onCardClick, layout = 'carousel' }) {
  const track = useRef(null);
  const [group, setGroup] = useState(items[0]?.group);
  const [edge, setEdge] = useState({ start: true, end: false });
  const groups = [...new Set(items.map((u) => u.group))];

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    const probe = el.scrollLeft + el.clientWidth * 0.35;
    let current = items[0]?.group;
    [...el.children].forEach((child, i) => { if (child.offsetLeft - el.offsetLeft <= probe) current = items[i].group; });
    setGroup(current);
  }, [items]);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync]);

  const step = (dir) => {
    const el = track.current;
    if (!el || !el.children[0]) return;
    el.scrollBy({ left: dir * (el.children[0].getBoundingClientRect().width + 16), behavior: 'smooth' });
  };
  const jump = (g) => {
    const el = track.current;
    const i = items.findIndex((u) => u.group === g);
    if (el && el.children[i]) el.scrollTo({ left: el.children[i].offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };

  const card = (u) => <Link key={u.title} className="lx-card lx-ucard" to={withFunnelParams(u.href)} onClick={() => onCardClick && onCardClick(u)}>
    <div className="lx-art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ART[u.art] }} />
    <div className="lx-ubody">
      <span className="lx-tag">{u.group}</span>
      <h3>{u.title}</h3>
      <p>{u.body}</p>
      <span className="lx-more">{u.cta} →</span>
    </div>
  </Link>;

  if (layout === 'grid') return <div className="lx-ugrid" data-n={items.length} role="region" aria-label={label}>{items.map(card)}</div>;

  return <div className="lx-uc">
    <div className="lx-uc-ctrl">
      {groups.length > 1 ? <div className="lx-chips" role="group" aria-label="Product">
        {groups.map((g) => <button key={g} type="button" aria-pressed={group === g} onClick={() => jump(g)}>{g}</button>)}
      </div> : <span />}
      {!(edge.start && edge.end) && <div className="lx-arrows">
        <button type="button" aria-label="Previous use cases" disabled={edge.start} onClick={() => step(-1)}>←</button>
        <button type="button" aria-label="Next use cases" disabled={edge.end} onClick={() => step(1)}>→</button>
      </div>}
    </div>
    <div className="lx-car" ref={track} onScroll={() => requestAnimationFrame(sync)} role="region" aria-label={label} tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); step(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); } }}>
      {items.map(card)}
    </div>
  </div>;
}
