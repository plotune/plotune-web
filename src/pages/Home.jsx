import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import UseCaseCarousel from '../components/UseCaseCarousel';
import { homeUseCases } from '../content/useCases';
import { withFunnelParams } from '../utils/funnel';

// Home: the Plotune platform story, not one product. Hero -> system panel -> use cases -> product
// entries (each opens that product's own funnel) -> research -> a single closing action.
const devices = [['can', 'Bridge CAN'], ['serial', 'Bridge Serial'], ['daq', 'Bridge DAQ'], ['io', 'Bridge I/O']];
const products = [
  ['Plotune Nexus', 'Connects AI agents to physical engineering and test systems through MCP.', 'Rent or buy', 'Rent or buy Nexus', '/nexus/pricing'],
  ['Plotune Bridge', 'Connect your hardware, access it anywhere. CAN, Serial, DAQ and I/O.', '4 models', 'Choose your Bridge', '/bridge'],
  ['Plotune Stream', 'Bring events from your tools, test benches and scripts into one explorable history.', 'Live demo, no account', 'Try the demo', '/stream/demo'],
];
const research = [
  ['/research/reports', 'Technical reports', 'Studies on agentic test and validation workflows'],
  ['/research', 'Model results', 'Comparisons and benchmark data'],
  ['/research/methodology', 'Methodology', 'How the evaluations are run'],
];

export default function Home() {
  return <main className="home-design lx-home">
    <Seo title="Plotune: DataOps Platform & AI-Ready Test Systems" description="Plotune is a DataOps platform for orchestrating and governing data, plus Nexus, a local-first appliance that brings controlled, AI-ready workflows to real test hardware." path="/" />
    <div className="design-container">
      <header className="lx-hero">
        <span className="lx-pill"><i />Hardware, data and AI agents, connected</span>
        <h1>From the physical world. <em>Into your workflow.</em></h1>
        <p className="lx-lead">Plotune connects engineering hardware to AI agents and keeps the evidence. Start at the test bench and keep control of the operation.</p>
        <div className="lx-actions">
          <a className="design-button" href="#products">Choose your product</a>
          <Link className="design-button secondary" to={withFunnelParams('/contact')}>Talk to us</Link>
        </div>

        <div className="lx-system" role="group" aria-label="How Plotune products connect">
          <div className="lx-system-in"><div className="lx-flow">
            <div className="lx-col">
              <h4>Test bench</h4>
              <div className="lx-cc"><div className="lx-devs">{devices.map(([slug, name]) => <figure className="lx-dev" key={slug}>
                <img src={`/assets/bridge/${slug}/1.webp`} alt="" width="300" height="300" loading="lazy" decoding="async" /><figcaption>{name}</figcaption>
              </figure>)}</div></div>
            </div>
            <div className="lx-wire" aria-hidden="true"><span>Wi-Fi</span></div>
            <div className="lx-col">
              <h4>Control</h4>
              <div className="lx-cc"><span className="lx-agent">AI agents · MCP</span>
                <div className="lx-tile lx-nexus"><img src="/assets/plotune-nexus.webp" alt="" width="1088" height="725" loading="lazy" decoding="async" /><b>Plotune Nexus</b><small>Controlled operations on real hardware</small></div>
              </div>
            </div>
            <div className="lx-wire" aria-hidden="true"><span>HTTP</span></div>
            <div className="lx-col">
              <h4>Evidence</h4>
              <div className="lx-cc"><div className="lx-tile lx-win">
                <div className="lx-win-bar"><i /><i /><i /><span>Plotune Stream · Events</span></div>
                <table><tbody>
                  <tr><td>12:00:04</td><td className="ev"><span className="lx-ok" />test.completed</td><td><span className="lx-kv">passed</span></td></tr>
                  <tr><td>12:00:01</td><td className="ev">motor.sample</td><td><span className="lx-kv">72.4 °C</span></td></tr>
                  <tr><td>11:59:58</td><td className="ev">motor.sample</td><td><span className="lx-kv">71.9 °C</span></td></tr>
                  <tr><td>11:59:40</td><td className="ev">device.connected</td><td><span className="lx-kv">bench-01</span></td></tr>
                </tbody></table>
              </div></div>
            </div>
          </div></div>
          <div className="lx-cap"><span>Example devices and events</span><span>Bridge · Nexus · Stream</span></div>
        </div>
      </header>

      <section className="lx-section" id="usecases">
        <div className="lx-head"><h2>What you can do with Plotune.</h2><p className="lx-sub">Real workflows, from the bus to the browser to AI agents.</p></div>
        <UseCaseCarousel items={homeUseCases()} label="Plotune use cases" />
      </section>

      <section className="lx-section" id="products">
        <div className="lx-head"><h2>Start with a product.</h2><p className="lx-sub">Each product has its own way in. Use one, or connect all three.</p></div>
        <div className="lx-rows">{products.map(([name, copy, meta, cta, to]) => <div className="lx-row" key={name}>
          <div><h3>{name}</h3><p>{copy}</p></div><span className="lx-meta">{meta}</span>
          <Link className="design-button" to={withFunnelParams(to)}>{cta}</Link>
        </div>)}</div>
      </section>

      <section className="lx-section">
        <div className="lx-head"><h2>Engineering needs evidence.</h2><p className="lx-sub">Technical studies, benchmark data and the methods behind agentic test and validation.</p></div>
        <div className="lx-list">{research.map(([to, title, copy]) => <Link key={to} to={to}><b>{title}</b><span>{copy}</span><i aria-hidden="true">→</i></Link>)}</div>
      </section>

      <section className="lx-closing">
        <h2>Not sure where to start?</h2>
        <p>Tell us what you test today and we will point you to the shortest path from the bench to an AI-driven workflow.</p>
        <div className="lx-actions"><Link className="design-button" to={withFunnelParams('/contact')}>Talk to us</Link><Link className="design-button secondary" to="/docs">Read the docs</Link></div>
      </section>
      <div className="lx-bottom" />
    </div>
  </main>;
}
