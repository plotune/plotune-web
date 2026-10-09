import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import EngineeringDiagram from '../components/EngineeringDiagram';
import { withFunnelParams } from '../utils/funnel';

const ecosystem = [
  ['/download', 'Desktop', 'Local visualization and engineering data workflows.'],
  ['/extensions', 'Extensions', 'Components and integrations for your existing tools.'],
  ['/docs', 'Documentation', 'Interfaces, setup guides and technical reference.'],
];
export default function Home() {
  return <main className="home-design">
    <Seo title="Plotune: DataOps Platform & AI-Ready Test Systems" description="Plotune is a DataOps platform for orchestrating and governing data, plus Nexus, a local-first appliance that brings controlled, AI-ready workflows to real test hardware." path="/" />
    <section className="home-intro design-container">
      <p className="technical-label">Plotune / Engineering systems, connected.</p>
      <h1>From the physical world.<br /><span>Into your workflow.</span></h1>
      <div className="intro-bottom"><p>We build tools that connect engineering hardware, data and AI agents. Start at the test bench. Keep control of the operation. Work from the evidence.</p><a href="#nexus-product" className="text-link">Explore the products <span aria-hidden="true">↓</span></a></div>
    </section>
    <section id="nexus-product" className="home-nexus design-container">
      <div className="section-index"><span>01 / Hardware + software</span><span>Plotune Nexus</span></div>
      <div className="product-spread">
        <div className="product-copy"><p className="technical-label">The local-first appliance</p><h2>A connection to<br />the real bench.</h2><p>Nexus gives AI agents a controlled MCP surface for physical test systems. Connect engineering interfaces, execute bounded operations and return structured results.</p><div className="design-actions"><Link className="design-button" to="/nexus">Explore Nexus <span aria-hidden="true">↗</span></Link><Link className="text-link" to={withFunnelParams('/ai-readiness')}>Check your AI readiness →</Link></div><dl className="product-specs"><div><dt>Agent interface</dt><dd>MCP</dd></div><div><dt>Deployment</dt><dd>Local-first</dd></div><div><dt>Connections</dt><dd>CAN · UART · XCP · ROS 2 / DDS</dd></div></dl></div>
        <figure className="hardware-plate"><span className="technical-label">NEXUS / hardware overview</span><img src="/assets/plotune-nexus.webp" width="1088" height="725" loading="lazy" decoding="async" alt="Plotune Nexus appliance with a finned enclosure and physical connectors" /><figcaption>One appliance. A controlled connection to your test environment.</figcaption></figure>
      </div>
      <EngineeringDiagram />
      <div className="workflow-links"><span className="technical-label">Explore by workflow</span><Link to="/solutions/can-ecu-testing">CAN / ECU testing ↗</Link><Link to="/solutions/ros2-dds-testing">ROS 2 / DDS testing ↗</Link><Link to="/solutions/hil-testing">Hardware-in-the-loop ↗</Link><Link to="/nexus/use-cases">All use cases ↗</Link></div>
    </section>
    <section className="home-stream"><div className="design-container"><div className="section-index"><span>02 / Event infrastructure</span><span>Plotune Stream</span></div><div className="stream-spread"><div><p className="technical-label">Any source that speaks HTTP</p><h2>The event is<br />the starting point.</h2><p>Bring events from Python, C/C++, CAPL, MATLAB, ROS, shell scripts or Nexus into an inspectable history. Stream is independent of the hardware that sends it.</p><div className="design-actions"><Link className="design-button" to="/stream">Explore Stream ↗</Link><Link className="text-link" to="/stream/workspace">Open the MVP demo →</Link></div></div><div className="event-specimen" aria-label="Illustrative event structure"><div className="technical-label">Event structure / illustrative</div><pre><code>{`{\n  "event": "test.completed",\n  "device_id": "bench-01",\n  "session_id": "run-01",\n  "properties": {\n    "outcome": "passed"\n  }\n}`}</code></pre><p>Sender → HTTP → event history → inspection</p><span>Optional context. Arbitrary JSON properties.</span></div></div></div></section>
    <section className="home-research design-container"><div className="section-index"><span>03 / Research &amp; evidence</span><span>Plotune Research</span></div><div className="research-spread"><h2>Engineering needs<br /><em>evidence.</em></h2><div><p>Read the technical studies. Inspect the benchmark data. Understand the methodology behind agentic test and validation workflows.</p><Link className="text-link" to="/research">Explore the research →</Link></div></div><div className="publication-links"><Link to="/research/reports"><span className="technical-label">Publication</span><strong>Technical reports</strong><span aria-hidden="true">↗</span></Link><Link to="/research"><span className="technical-label">Data</span><strong>Model results &amp; comparisons</strong><span aria-hidden="true">↗</span></Link><Link to="/research/methodology"><span className="technical-label">Protocol</span><strong>Evaluation methodology</strong><span aria-hidden="true">↗</span></Link></div></section>
    <section id="features" className="home-ecosystem design-container"><div className="section-index"><span>04 / The wider toolkit</span><span>Data operations</span></div>{ecosystem.map(([to,title,copy],i)=><Link to={to} className="ecosystem-row" key={to}><span className="technical-label">0{i+1}</span><h3>{title}</h3><p>{copy}</p><span aria-hidden="true">↗</span></Link>)}</section>
    <section className="closing-section design-container"><p className="technical-label">Start with your system</p><h2>One real workflow.<br />A clear next step.</h2><div className="design-actions"><Link className="design-button" to="/contact">Contact Us ↗</Link><Link className="text-link" to="/nexus">Explore Nexus →</Link></div></section>
  </main>;
}
