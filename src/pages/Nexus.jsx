import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import EngineeringDiagram from '../components/EngineeringDiagram';
import UseCaseCarousel from '../components/UseCaseCarousel';
import { USE_CASES } from '../content/useCases';
import { posthog } from '../posthog';
import { useCtaTracking } from '../utils/ctaTracking';
import { contactHref, getFunnelContext, withFunnelParams } from '../utils/funnel';
const G = {
  can: "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 12h18\"/><rect x=\"5\" y=\"6\" width=\"4\" height=\"6\" rx=\"1\"/><rect x=\"15\" y=\"12\" width=\"4\" height=\"6\" rx=\"1\"/></svg>",
  uart: "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"8\" width=\"18\" height=\"8\" rx=\"2\"/><path d=\"M7 12h.01M11 12h.01M15 12h.01\"/></svg>",
  xcp: "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 3v4M12 17v4M3 12h4M17 12h4\"/></svg>",
  uds: "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 4v6a4 4 0 008 0V4\"/><path d=\"M10 14v2a4 4 0 004 4 4 4 0 004-4v-1\"/><circle cx=\"18\" cy=\"13\" r=\"2\"/></svg>",
  ros: "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"6\" cy=\"12\" r=\"2.5\"/><circle cx=\"18\" cy=\"6\" r=\"2.5\"/><circle cx=\"18\" cy=\"18\" r=\"2.5\"/><path d=\"M8.3 11l7.4-4M8.3 13l7.4 4\"/></svg>",
  inspect: "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"11\" r=\"6\"/><path d=\"M16 16l5 5\"/></svg>",
  run: "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 5l11 7-11 7z\"/></svg>",
  keep: "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 4h10l4 4v12H5z\"/><path d=\"M9 13l2 2 4-4\"/></svg>",
};
const interfaces = [
 ['CAN / CAN FD', 'Linux CAN transports for bus interaction and capture.', G.can],
 ['UART', 'Serial interfaces, including RS-485 and modem-control lines.', G.uart],
 ['XCP', 'CAN and Ethernet transports with different supported operations.', G.xcp],
 ['UDS / DoIP', 'Diagnostics through reachable network and CAN transports.', G.uds],
 ['ROS 2 / DDS', 'Join an existing DDS domain, discover topics and record evidence.', G.ros],
];
const steps = [
 ['Inspect the system', 'Discover the available interfaces and current state before requesting an operation.', G.inspect],
 ['Run a bounded operation', 'Use the relevant MCP tools and job controls within the configured access and execution limits.', G.run],
 ['Keep the evidence', 'Return status, metadata and retrieval paths for locally recorded logs, traces and artifacts.', G.keep],
];
// The pricing page records where the visitor came from (?from=), alongside the funnel context.
const pricingHref=(from)=>{const base=withFunnelParams('/nexus/pricing');return `${base}${base.includes('?')?'&':'?'}from=${from}`;};
export default function Nexus() {
 const heroAssessmentCta=useCtaTracking('nexus_hero_assessment');
 const bottomContactCta=useCtaTracking('nexus_bottom_contact');
 const pricingCta=useCtaTracking('nexus_pricing');
 return <main className="nexus-design"><Seo title="Plotune Nexus: Local-First Appliance for AI-Ready Test Systems" description="Plotune Nexus is a managed, local-first appliance that connects to real test systems and runs bounded, AI-ready workflows over a standard MCP surface, with data that stays yours." path="/nexus" />
 <section className="design-container nexus-intro"><div className="section-index"><span>Plotune Nexus / Local-first appliance</span><span>Hardware + software</span></div><div className="product-spread"><div className="product-copy"><p className="technical-label">The agent meets the bench.</p><h1>Real hardware.<br /><span>Controlled operations.</span></h1><p className="nexus-lead">Nexus lets AI agents run tests on your real hardware through MCP. You decide what they can touch, and every run is recorded on the appliance.</p><div className="design-actions"><div><Link className="design-button" to={withFunnelParams('/ai-readiness')} ref={heroAssessmentCta.ref} onClick={()=>posthog.capture('nexus_assessment_clicked',{...getFunnelContext(),path:'/nexus'})}>Check Your AI Readiness ↗</Link><p className="action-note">4 quick questions · about 30 seconds · no sign-up</p></div><Link className="text-link" to="/nexus/connectivity">See How It Connects →</Link></div></div><figure className="hardware-plate lx-photo-plate"><img src="/assets/photos/nexus-rack-1376.webp" srcSet="/assets/photos/nexus-rack-720.webp 720w, /assets/photos/nexus-rack-1376.webp 1376w" sizes="(max-width: 900px) 100vw, 560px" width="1376" height="768" fetchpriority="high" decoding="async" alt="Plotune Nexus appliance on a lab bench in front of a hardware test rack" /><figcaption>Plotune-defined hardware. Pre-integrated software. Managed lifecycle.</figcaption></figure></div></section>
 <section className="design-container lx-section" id="nexus-use-cases"><div className="lx-head"><h2>What teams do with Nexus.</h2><p className="lx-sub">Four workflows, from a single CAN bus to AI agents on real hardware.</p></div><UseCaseCarousel items={USE_CASES.filter((u) => u.group === 'Nexus')} label="Nexus use cases" layout="grid" /></section>

 <section className="design-container lx-section nexus-architecture"><div className="lx-head"><h2>One controlled surface.<br />A physical result.</h2><p className="lx-sub">A request goes in, a bounded operation runs on the bench, evidence comes back.</p></div><div className="lx-panel"><EngineeringDiagram interactive /></div><p className="diagram-note">Conceptual flow. Available operations depend on transport, connected hardware, access and configuration.</p></section>
 <section className="design-container lx-section interface-section"><div className="lx-head"><h2>Speak the language<br />of your system.</h2><p className="lx-sub">Use the supported transports on your bench, rig or vehicle. <Link className="lx-inline" to="/docs/nexus/hardware-compatibility">Compatibility matrix ↗</Link></p></div><ul className="lx-icards">{interfaces.map(([name,copy,glyph])=><li className="lx-card lx-icard" key={name}><span className="lx-glyph" dangerouslySetInnerHTML={{__html:glyph}} /><h3>{name}</h3><p>{copy}</p></li>)}</ul><div className="lx-after-row"><Link className="lx-more" to="/nexus/connectivity">Explore connectivity →</Link></div></section>
 <section className="design-container lx-section nexus-workflow-lx"><div className="lx-head"><h2>Discover. Execute.<br />Record what happened.</h2><p className="lx-sub">A bounded workflow, from requirement to evidence.</p></div><ol className="lx-steps">{steps.map(([title,copy,glyph],i)=><li className="lx-card lx-step" key={title}><span className="lx-glyph" dangerouslySetInnerHTML={{__html:glyph}} /><span className="lx-stepno">Step {i+1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol><div className="lx-chiprow lx-linkrow"><Link to="/solutions/can-ecu-testing">CAN / ECU testing ↗</Link><Link to="/solutions/ros2-dds-testing">ROS 2 / DDS testing ↗</Link><Link to="/nexus/stream">Stream integration ↗</Link><Link to="/nexus/use-cases">View Use Cases ↗</Link></div></section>
 <section className="design-container lx-section"><div className="lx-duo">
  <div className="lx-card lx-duo-card"><h2>Know the boundary.</h2><p>Local-first operation is documented alongside cloud dependencies, hardware compatibility and current constraints. Start with the architecture and security model.</p><div className="lx-chiprow lx-linkrow"><Link to="/docs/nexus/security-model">Security model ↗</Link><Link to="/docs/nexus/data-handling">Data handling ↗</Link><Link to="/docs/nexus/protocols">Protocols ↗</Link></div><Link className="lx-more" to="/docs/nexus">Read the Nexus documentation →</Link></div>
  <div className="lx-card lx-duo-card lx-duo-accent"><h2>Rent it for a project.<br /><span>Or keep it.</span></h2><p>Monthly rental or one-time purchase, with full functionality either way. See the options and what they cost for your project.</p><div className="lx-actions lx-actions-left"><Link className="design-button" ref={pricingCta.ref} to={pricingHref('nexus_pricing_band')} onClick={()=>posthog.capture('nexus_pricing_clicked',{...getFunnelContext(),path:'/nexus',placement:'pricing_band'})}>See rent &amp; buy options</Link></div></div>
 </div></section>
 <section className="design-container"><div className="lx-closing"><h2>Map Nexus<br />to your bench.</h2><p>Not sure it fits yet? Tell us about your hardware, interfaces and first workflow.</p><div className="lx-actions"><Link className="design-button" ref={bottomContactCta.ref} to={contactHref('nexus')}>Get Your Integration Plan</Link><Link className="design-button secondary" to="/nexus/use-cases">View Use Cases</Link></div></div><div className="lx-bottom" /></section></main>;
}
