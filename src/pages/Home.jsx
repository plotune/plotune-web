import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import UseCaseCarousel from '../components/UseCaseCarousel';
import { homeUseCases } from '../content/useCases';
import { withFunnelParams } from '../utils/funnel';

// Home: the Plotune platform story, not one product. Hero (bench photo + live product UI) ->
// product bento (each tile opens that product's own funnel) -> use cases -> research -> closing.
const photo = (name, sizes) => ({
  src: `/assets/photos/${name}-${sizes[0]}.webp`,
  srcSet: sizes.map((w) => `/assets/photos/${name}-${w}.webp ${w}w`).join(', '),
});

// Example agent run: real Nexus MCP tool names, example values.
const agentSteps = [
  ['acquire_can_interface', 'can0 · 500 kbit/s', 'ok'],
  ['send_dbc_message', 'BrakeCmd · Pressure=40', 'ok'],
  ['wait_dbc_signal', 'BrakeStatus.Active == 1', '38 ms'],
  ['capture_can_snapshot', '2 412 frames', 'saved'],
];
const events = [
  ['12:00:04', 'test.completed', 'passed', true],
  ['12:00:01', 'motor.sample', '72.4 °C'],
  ['11:59:58', 'motor.sample', '71.9 °C'],
  ['11:59:40', 'device.connected', 'bench-01'],
];
const research = [
  ['/research/reports', 'Technical reports', 'Studies on agentic test and validation workflows'],
  ['/research', 'Model results', 'Comparisons and benchmark data'],
  ['/research/methodology', 'Methodology', 'How the evaluations are run'],
];

function Bars() {
  // Small static bar chart for the Stream tile (example data).
  const v = [12, 18, 15, 22, 30, 26, 34, 41, 37, 45, 52, 48, 58, 63, 57, 66, 72, 69, 78, 84];
  return <svg className="lh-bars" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
    {v.map((h, i) => <rect key={i} x={i * 10 + 1} y={60 - h * 0.7} width="7" height={h * 0.7} rx="1.5" />)}
  </svg>;
}

export default function Home() {
  return <main className="home-design lx-home lh">
    <Seo title="Plotune: DataOps Platform & AI-Ready Test Systems" description="Plotune is a DataOps platform for orchestrating and governing data, plus Nexus, a local-first appliance that brings controlled, AI-ready workflows to real test hardware." path="/" />
    <div className="design-container">
      <header className="lh-hero">
        <span className="lx-pill"><i />Hardware, data and AI agents, connected</span>
        <h1>From the physical world. <em>Into your workflow.</em></h1>
        <div className="lh-hero-row">
          <p className="lh-lead">Plotune connects engineering hardware to AI agents and keeps the evidence. Start at the test bench and keep control of the operation.</p>
          <div className="lx-actions">
            <a className="design-button" href="#products">Choose your product</a>
            <Link className="design-button secondary" to={withFunnelParams('/contact')}>Talk to us</Link>
          </div>
        </div>
      </header>

      <div className="lh-stage" role="group" aria-label="Plotune on a test bench: an AI agent runs a CAN test through Nexus and the results land in Stream">
        <img className="lh-stage-photo" {...photo('bench-hero', [1584, 960])} sizes="(max-width: 1200px) 100vw, 1160px" width="1584" height="672" alt="Plotune Nexus and a Plotune Bridge CAN connected to an ECU board on a lab bench" fetchpriority="high" decoding="async" />
        <div className="lh-ui lh-agent">
          <div className="lh-ui-bar"><span className="lh-dot" />Agent session <span className="lh-ui-meta">Nexus · MCP</span></div>
          <ol>{agentSteps.map(([tool, arg, res], i) => <li key={tool} style={{ '--i': i }}>
            <span className="lh-tick" aria-hidden="true" /><code>{tool}</code><span className="lh-arg">{arg}</span><span className="lh-res">{res}</span>
          </li>)}</ol>
          <div className="lh-verdict"><span>Verdict</span><b>Passed</b></div>
        </div>
        <div className="lh-ui lh-events">
          <div className="lh-ui-bar"><span className="lh-dot" />Stream · Events <span className="lh-ui-meta">live</span></div>
          <table><tbody>{events.map(([t, ev, val, ok]) => <tr key={t}>
            <td>{t}</td><td className="ev">{ok && <span className="lx-ok" />}{ev}</td><td><span className="lx-kv">{val}</span></td>
          </tr>)}</tbody></table>
        </div>
        <span className="lh-stage-cap">Example run</span>
      </div>

      <section className="lx-section" id="products">
        <div className="lx-head"><h2>One platform. Three ways in.</h2><p className="lx-sub">Use one product, or connect all three.</p></div>
        <div className="lh-bento">
          <article className="lh-tile lh-tile-nexus">
            <img {...photo('nexus-rack', [1376, 720])} sizes="(max-width: 900px) 100vw, 680px" width="1376" height="768" alt="Plotune Nexus in front of a hardware test rack" loading="lazy" decoding="async" />
            <div className="lh-tile-body">
              <p className="lh-kicker">Plotune Nexus</p>
              <h3>AI agents on real hardware, under your control.</h3>
              <p>Connects AI agents to physical engineering and test systems through MCP.</p>
              <Link className="design-button" to={withFunnelParams('/nexus/pricing')}>Rent or buy Nexus</Link>
            </div>
          </article>
          <article className="lh-tile lh-tile-bridge">
            <img {...photo('bridge-family', [1376, 720])} sizes="(max-width: 900px) 100vw, 480px" width="1376" height="768" alt="Plotune Bridge CAN, Serial, DAQ and I/O on a bench" loading="lazy" decoding="async" />
            <div className="lh-tile-body">
              <p className="lh-kicker">Plotune Bridge</p>
              <h3>Your hardware, reachable anywhere.</h3>
              <p>CAN, Serial, DAQ and I/O. Wireless, managed from the browser.</p>
              <Link className="design-button" to={withFunnelParams('/bridge')}>Choose your Bridge</Link>
            </div>
          </article>
          <article className="lh-tile lh-tile-stream">
            <div className="lh-stream-ui" aria-hidden="true">
              <div className="lh-ui-bar"><span className="lh-dot" />test.completed <span className="lh-ui-meta">last 24 h</span></div>
              <Bars />
              <div className="lh-stream-kpis"><span><b>1 284</b>runs</span><span><b>98.6%</b>passed</span><span><b>6</b>benches</span></div>
            </div>
            <div className="lh-tile-body">
              <p className="lh-kicker">Plotune Stream</p>
              <h3>Every run, one explorable history.</h3>
              <p>Bring events from your tools, test benches and scripts together. Live demo, no account.</p>
              <Link className="design-button" to={withFunnelParams('/stream/demo')}>Try the demo</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="lx-section" id="usecases">
        <div className="lx-head"><h2>What you can do with Plotune.</h2><p className="lx-sub">Real workflows, from the bus to the browser to AI agents.</p></div>
        <UseCaseCarousel items={homeUseCases()} label="Plotune use cases" />
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
