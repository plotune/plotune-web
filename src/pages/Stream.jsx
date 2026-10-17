import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight, FiArrowRight, FiActivity, FiSearch, FiLayers, FiCopy, FiCheck, FiRotateCcw } from 'react-icons/fi';
import Seo from '../components/Seo';
import StreamHeroVisual from './StreamHeroVisual';
import './Stream.css';

const samples = [
  { id: 'motor', title: 'Motor sample', number: '01', source: 'A motor test bench', description: 'A reading becomes an event with the device, test session, and values kept together.', event: 'motor.sample', device_id: 'motor-003', session_id: 'test-run-817', properties: { temperature: 72.4, rpm: 1840, state: 'running' } },
  { id: 'test', title: 'Test verdict', number: '02', source: 'An automated test', description: 'Your test runner supplies the verdict and the context needed to investigate it later.', event: 'test.completed', device_id: 'ecu-012', session_id: 'validation-042', properties: { test: 'startup_sequence', verdict: 'passed', duration_ms: 842 } },
  { id: 'limit', title: 'Temperature limit', number: '03', source: 'A monitoring script', description: 'Your script detects a threshold crossing and records the reading alongside its configured limit.', event: 'temperature.limit_exceeded', device_id: 'chamber-02', session_id: 'thermal-cycle-09', properties: { temperature: 86.2, limit: 85, unit: '°C' } },
];
const payloadFor = ({ event, device_id, session_id, properties }) => ({ event, device_id, session_id, properties });
const Arrow = () => <FiArrowUpRight aria-hidden="true" />;

function StreamActions({ className = '' }) {
  return <div className={`sl-goal-actions ${className}`}>
    <Link className="design-button" to="/stream/demo">Try the demo <Arrow /></Link>
    <Link className="design-button secondary" to="/stream/workspace">Open workspace <FiArrowRight aria-hidden="true" /></Link>
  </div>;
}

function EventPreview() {
  const [selected, setSelected] = useState('motor');
  const [mode, setMode] = useState('details');
  const [replay, setReplay] = useState(0);
  const [copied, setCopied] = useState('');
  const reduced = useReducedMotion();
  const sample = samples.find(item => item.id === selected);
  const payload = JSON.stringify(payloadFor(sample), null, 2);
  const selectSample = (id) => { setSelected(id); setCopied(''); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(payload); setCopied('Event JSON copied'); }
    catch { setMode('json'); setCopied('Copy unavailable. Select the JSON text to copy it.'); }
  };
  return <section id="stream-preview" className="design-container sl-preview" aria-labelledby="sl-preview-title">
    <div className="sl-section-heading"><div><span className="technical-label">01 / Interactive demo</span><h2 id="sl-preview-title">One event.<br />The whole picture.</h2></div><p>Choose an engineering workflow. <br />See the context that travels with each event.</p></div>
    <div className="sl-scenarios" role="group" aria-label="Choose an event example">{samples.map(item => <button key={item.id} aria-pressed={selected === item.id} aria-controls="sl-sample-scene" onClick={() => selectSample(item.id)}><span>{item.number}</span>{item.title}{selected === item.id ? <FiCheck aria-hidden="true" /> : <FiArrowUpRight aria-hidden="true" />}</button>)}</div>
    <motion.div key={selected} id="sl-sample-scene" className="sl-sample-scene" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}>
      <div className="sl-scene-heading"><div><span className="technical-label">{sample.source}</span><h3>{sample.title}</h3><p>{sample.description}</p></div></div>
      <div className="sl-path-caption"><span className="technical-label">From source to inspection</span><button type="button" onClick={() => setReplay(value => value + 1)}><FiRotateCcw aria-hidden="true" /> Replay event path</button></div>
      <div className="sl-event-path" key={`${selected}-${replay}`} aria-label="Event path: your system, HTTP capture, event inspection">
        <div><FiActivity aria-hidden="true" /><span>Your system<small>Supplies the event</small></span></div><span className="sl-path-connector" aria-hidden="true"><i /></span><div><FiLayers aria-hidden="true" /><span>HTTP capture<small>Preserves its context</small></span></div><span className="sl-path-connector" aria-hidden="true"><i /></span><div><FiSearch aria-hidden="true" /><span>Event inspection<small>Makes it explorable</small></span></div>
      </div>
      <div className="sl-event-panels">
        <section className="sl-inspector" aria-label="Inspect event"><header><span>Event inspector</span><button type="button" onClick={copy} aria-label="Copy event JSON">{copied === 'Event JSON copied' ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />} {copied === 'Event JSON copied' ? 'Copied' : 'Copy JSON'}</button></header>
          <div className="sl-copy-feedback" role="status" aria-live="polite">{copied}</div>
          <div className="sl-inspector-event"><span><FiActivity aria-hidden="true" /></span><div><small>Event name</small><h4>{sample.event}</h4></div></div>
          <div className="sl-inspector-tabs" role="group" aria-label="Event view">{['details', 'json'].map(value => <button key={value} aria-pressed={mode === value} onClick={() => setMode(value)} aria-controls="sl-inspector-content">{value === 'details' ? 'Event details' : 'Raw JSON'}</button>)}</div>
          <motion.div key={mode} id="sl-inspector-content" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.25 }}>
            {mode === 'json' ? <><pre className="sl-inspector-json" tabIndex={0} aria-label="Event JSON"><code>{payload}</code></pre><div className="sl-integration-link"><Link to="/stream/demo?view=api">Explore API setup <Arrow /></Link></div></> : <div className="sl-inspector-fields"><dl><div><dt>Device</dt><dd>{sample.device_id}</dd></div><div><dt>Session</dt><dd>{sample.session_id}</dd></div></dl><span className="technical-label">Event properties</span><dl className="sl-property-list">{Object.entries(sample.properties).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{String(value)}</dd></div>)}</dl></div>}
          </motion.div>
        </section>
        <aside className="sl-preview-next"><span className="technical-label">Keep exploring</span><h3>From one event<br />to the bigger picture.</h3><p>Search event history, filter by device or session, and explore dashboards in the full demo.</p><ul><li><FiSearch aria-hidden="true" /> Find the events that matter.</li><li><FiLayers aria-hidden="true" /> Follow context across your systems.</li><li><FiActivity aria-hidden="true" /> Build a view of your event history.</li></ul><StreamActions /><span className="sl-preview-ready">Ready to connect your systems? Open your workspace.</span></aside>
      </div>
      <div className="sl-selection-status" role="status" aria-live="polite">{sample.title} selected</div>
    </motion.div>
  </section>;
}

export default function Stream() {
  return <main className="stream-design sl-page">
    <Seo title="Plotune Stream: Events for Engineering Systems" description="Understand events from your engineering systems in one explorable history. Try the Plotune Stream demo or open your workspace to connect your tools, test benches, and scripts." path="/stream" />
    <section className="design-container sl-hero">
      <div className="sl-hero-copy"><p className="technical-label"><span translate="no">Plotune Stream</span> / Event history for engineering systems</p><h1>Know what happened.<br /><em>Keep the context.</em></h1><p>Bring events from your tools, test benches, and scripts into one explorable history. Find the moment, follow the device or session, and see the details that matter.</p><StreamActions className="sl-hero-actions" /><span className="sl-hero-note">Explore without an account, or connect your own events.</span></div>
      <StreamHeroVisual />
    </section>
    <div className="design-container sl-source-strip"><span className="technical-label">Works with the tools you use</span><div>{['Python', 'C/C++', 'CAPL', 'MATLAB', 'ROS 2', 'Nexus', 'HTTP clients'].map(name => <span key={name}>{name}</span>)}</div><span className="sl-source-note">Any system that can send an HTTP request.</span></div>
    <EventPreview />
    <section className="sl-value-section"><div className="design-container"><div className="sl-section-heading"><div><span className="technical-label">02 / Built for your next investigation</span><h2>Less searching.<br />More understanding.</h2></div><p>From a single device to a shared test session, keep the event and its context together.</p></div><div className="sl-value-grid">{[
      [FiSearch, 'Find the moment.', 'Search and filter event history to narrow an investigation to the events that matter.'],
      [FiLayers, 'Keep the details.', 'Inspect device and session identifiers alongside the properties your application provides.'],
      [FiActivity, 'Explore the pattern.', 'Bring event history into dashboards and saved views you can return to.'],
    ].map(([Icon, title, text], i) => <article key={title}><div><Icon aria-hidden="true" /><span>0{i + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="design-container sl-get-started" aria-labelledby="sl-start-title"><div className="sl-section-heading"><div><span className="technical-label">03 / Choose your next step</span><h2 id="sl-start-title">Explore Stream.<br />Or bring your own events.</h2></div><p>Get a feel for Stream in the demo, or open your workspace to connect your systems.</p></div><div className="sl-experience-grid"><Link to="/stream/demo" className="sl-experience sl-experience-primary"><span className="technical-label">New to Stream?</span><FiArrowUpRight className="sl-experience-arrow" aria-hidden="true" /><h3>See what you<br />can discover.</h3><p>Explore event history, filters, and dashboards. Get a feel for the workspace before connecting your tools.</p><span className="sl-experience-action">Try the demo <FiArrowRight aria-hidden="true" /></span></Link><Link to="/stream/workspace" className="sl-experience"><span className="technical-label">Ready to connect?</span><FiArrowUpRight className="sl-experience-arrow" aria-hidden="true" /><h3>Bring your<br />own events.</h3><p>Open your projects and start capturing events from your engineering systems with your Plotune account.</p><span className="sl-experience-action">Open workspace <FiArrowRight aria-hidden="true" /></span></Link></div></section>
  </main>;
}
