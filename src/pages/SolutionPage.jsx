import React, { useEffect } from 'react';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import Seo from '../components/Seo';
import UseCaseCarousel from '../components/UseCaseCarousel';
import ART from '../content/useCaseArt';
import { USE_CASES } from '../content/useCases';
import { getSolutionSegment, solutionSegmentAliases } from '../content/solutions';
import { captureFunnelTouch, withFunnelParams } from '../utils/funnel';

// Each solution page: hero with the workflow illustration and an example run, the workflow today
// against the workflow with Nexus, supported integrations, the other Nexus workflows, one closing action.
const ART_FOR = { 'can-ecu-testing': 'can_ecu', 'ros2-dds-testing': 'ros', 'test-orchestration': 'auto', 'hil-testing': 'hil' };

const Cross = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#b34540" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>;
const Tick = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#2e8b57" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8" /></svg>;

const SolutionPage = () => {
  const { segment } = useParams();
  const location = useLocation();
  const config = getSolutionSegment(segment);

  useEffect(() => {
    if (config) captureFunnelTouch({ segment: config.slug, solution: config.slug });
  }, [config]);

  if (!config) {
    const renamedTo = solutionSegmentAliases[segment];
    if (renamedTo) return <Navigate to={`/solutions/${renamedTo}${location.search}`} replace />;
    return <Navigate to="/nexus" replace />;
  }

  const funnel = { segment: config.slug, solution: config.slug };
  const others = USE_CASES.filter((u) => u.group === 'Nexus' && u.href !== `/solutions/${config.slug}`);

  return (
    <main className="solution-design lx-solution">
      <Seo title={`${config.label} | Plotune Nexus`} description={config.problem} path={`/solutions/${config.slug}`} />
      <div className="design-container">
        <header className="lx-shero">
          <div className="lx-shero-copy">
            <Link to="/research" className="lx-back">← Related research</Link>
            <span className="lx-pill"><i />{config.label}</span>
            <h1>{config.heroTitle}</h1>
            <p className="lx-lead-left">{config.problem}</p>
            <div className="lx-actions lx-actions-left">
              <Link className="design-button" to={withFunnelParams('/contact', funnel)}>Discuss your setup</Link>
              <Link className="design-button secondary" to={withFunnelParams('/nexus', funnel)}>Explore Nexus</Link>
            </div>
          </div>
          <div className="lx-card lx-run">
            <div className="lx-art lx-art-lg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ART[ART_FOR[config.slug]] }} />
            <div className="lx-run-body">
              <div className="lx-run-head"><span>{config.exampleScenario.title}</span><em>Example run</em></div>
              <dl>{config.exampleScenario.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            </div>
          </div>
        </header>

        <section className="lx-section">
          <div className="lx-compare">
            <div className="lx-card lx-before">
              <h2>The workflow today</h2>
              <ul>{config.currentWorkflow.map((item) => <li key={item}><Cross /><span>{item}</span></li>)}</ul>
            </div>
            <div className="lx-card lx-after">
              <h2>With Plotune Nexus</h2>
              <ul>{config.nexusWorkflow.map((item) => <li key={item}><Tick /><span>{item}</span></li>)}</ul>
            </div>
          </div>
        </section>

        <section className="lx-section">
          <div className="lx-head"><h2>Works with.</h2><p className="lx-sub">Supported integrations for this workflow.</p></div>
          <ul className="lx-chiprow">{config.integrations.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="lx-section">
          <div className="lx-head"><h2>More Nexus workflows.</h2></div>
          <UseCaseCarousel items={others} label="More Nexus workflows" layout="grid" />
        </section>

        <section className="lx-closing">
          <h2>See this mapped to your bench.</h2>
          <p>Plotune Nexus is one product. This is how it runs against {config.label}.</p>
          <div className="lx-actions"><Link className="design-button" to={withFunnelParams('/contact', funnel)}>Discuss your setup</Link></div>
        </section>
        <div className="lx-bottom" />
      </div>
    </main>
  );
};

export default SolutionPage;
