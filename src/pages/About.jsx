import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import ART from '../content/useCaseArt';

// About: who Plotune is, the four products as cards, the three principles, one closing action.
const products = [
  { to: '/nexus', name: 'Plotune Nexus', tag: 'Physical systems', copy: 'The local-first appliance that connects AI agents to real test hardware.', image: '/assets/plotune-nexus.webp' },
  { to: '/stream', name: 'Plotune Stream', tag: 'Event infrastructure', copy: 'One explorable history for events from your tools, benches and scripts.', art: 'st_motor' },
  { to: '/download', name: 'Plotune Desktop', tag: 'Data operations', copy: 'Local visualization and engineering data workflows.', art: 'desk' },
  { to: '/research', name: 'Plotune Research', tag: 'Technical publication', copy: 'Studies and benchmark data on agentic test and validation.', art: 'res' },
];
const G = (b) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${b}</svg>`;
const principles = [
  ['Bounded', 'Agents and scripts act through defined operations with access and execution limits, not open shells on the bench.', G('<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>')],
  ['Local-first', 'Hardware interaction and first-write data stay on your side. Cloud services support routing, identity and export.', G('<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>')],
  ['Evidence', 'A run should leave results, logs and artifacts that an engineer can inspect and a reviewer can approve.', G('<path d="M5 4h10l4 4v12H5z"/><path d="M9 13l2 2 4-4"/>')],
];

export default function About() {
  return <main className="lx-about">
    <Seo title="About Plotune" description="Plotune helps engineering teams orchestrate, process, and govern their data, and builds Plotune Nexus for controlled, AI-ready work on real test hardware." path="/about" />
    <div className="design-container">
      <header className="lx-hero">
        <span className="lx-pill"><i />Founded in 2025</span>
        <h1>Engineering systems. <em>Connected with intent.</em></h1>
        <p className="lx-lead">Plotune builds tools for engineering data operations, physical test infrastructure and controlled AI-agent integration. Each product addresses a different part of the engineering workflow.</p>
        <div className="lx-actions"><Link className="design-button" to="/partners">Partner with us</Link><a className="design-button secondary" href="#mission">Our mission</a></div>
      </header>

      <section className="lx-section">
        <div className="lx-head"><h2>Four products. One workflow.</h2></div>
        <div className="lx-ugrid" data-n="4">{products.map((p) => <Link className="lx-card lx-ucard" key={p.to} to={p.to}>
          <div className="lx-art" aria-hidden="true">{p.image ? <img className="lx-art-img" src={p.image} alt="" loading="lazy" decoding="async" /> : <span dangerouslySetInnerHTML={{ __html: ART[p.art] }} />}</div>
          <div className="lx-ubody"><span className="lx-tag">{p.tag}</span><h3>{p.name}</h3><p>{p.copy}</p><span className="lx-more">Explore →</span></div>
        </Link>)}</div>
      </section>

      <section className="lx-section" id="mission">
        <div className="lx-head"><h2>Make physical engineering work inspectable.</h2><p className="lx-sub">Engineering teams already have the hardware, the scripts and the data. What is usually missing is a controlled way to connect them. Plotune builds that connection and keeps the operator in charge of it.</p></div>
        <ul className="lx-icards lx-icards-3">{principles.map(([title, copy, glyph]) => <li className="lx-card lx-icard" key={title}><span className="lx-glyph" dangerouslySetInnerHTML={{ __html: glyph }} /><h3>{title}</h3><p>{copy}</p></li>)}</ul>
      </section>

      <section className="lx-closing">
        <h2>Talk to the team.</h2>
        <p>Tell us what you build and test. We will tell you where Plotune fits.</p>
        <div className="lx-actions"><Link className="design-button" to="/contact">Contact us</Link><Link className="design-button secondary" to="/partners">Partnership</Link></div>
      </section>
      <div className="lx-bottom" />
    </div>
  </main>;
}
