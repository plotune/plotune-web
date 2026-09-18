import React, { useEffect } from 'react';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Seo from '../components/Seo';
import { getSolutionSegment, solutionSegmentAliases } from '../content/solutions';
import { captureFunnelTouch, withFunnelParams } from '../utils/funnel';

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

  return (
    <main className="bg-dark-bg text-dark-text">
      <Seo title={`${config.label} | Plotune Nexus`} description={config.problem} path={`/solutions/${config.slug}`} />

      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(38,166,154,0.18),transparent_34%),linear-gradient(180deg,#101112_0%,#121212_58%,#151719_100%)]" />
        <div className="relative container mx-auto max-w-3xl px-5">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{config.label}</p>
          <h1 className="mt-5 text-4xl font-semibold text-light-text md:text-5xl">{config.heroTitle}</h1>
          <p className="mt-6 text-lg leading-8 text-gray-text">{config.problem}</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto grid max-w-3xl gap-6 px-5 md:grid-cols-2">
          <div className="rounded-[1.5rem] bg-dark-card/80 p-6 shadow-custom">
            <h2 className="text-lg font-semibold text-light-text">The workflow today</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-text">
              {config.currentWorkflow.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="rounded-[1.5rem] border border-primary/20 bg-dark-card/80 p-6 shadow-custom">
            <h2 className="text-lg font-semibold text-light-text">With Plotune Nexus</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-text">
              {config.nexusWorkflow.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto max-w-3xl px-5">
          <h2 className="text-lg font-semibold text-light-text">Supported integrations</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {config.integrations.map((item) => (
              <span key={item} className="rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-text">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto max-w-3xl px-5">
          <h2 className="text-lg font-semibold text-light-text">Example run</h2>
          <div className="mt-4 overflow-hidden rounded-[1.25rem] bg-dark-card/80 p-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{config.exampleScenario.title}</span>
            <dl className="mt-3 space-y-2">
              {config.exampleScenario.rows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 text-sm">
                  <dt className="text-gray-text">{label}</dt>
                  <dd className="font-mono text-light-text">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto max-w-3xl px-5">
          <div className="rounded-[2rem] bg-[linear-gradient(145deg,rgba(38,166,154,0.16),rgba(63,81,181,0.08))] p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-light-text">See this mapped to your bench.</h3>
                <p className="mt-2 text-gray-text">Plotune Nexus is one product — this is how it runs against {config.label}.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to={withFunnelParams('/nexus', { segment: config.slug, solution: config.slug })} className="inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.06] px-6 py-3 font-semibold text-light-text transition-all duration-300 hover:bg-white/[0.1]">
                  Explore Nexus
                </Link>
                <Link to={withFunnelParams('/contact', { segment: config.slug, solution: config.slug })} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark">
                  Discuss your setup <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SolutionPage;
