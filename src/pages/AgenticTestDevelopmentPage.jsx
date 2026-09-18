import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Seo from '../components/Seo';
import { agenticTestDevelopmentPillar as pillar } from '../content/pillar';
import { solutionSegments } from '../content/solutions';
import { withFunnelParams } from '../utils/funnel';

const AgenticTestDevelopmentPage = () => (
  <main className="bg-dark-bg text-dark-text">
    <Seo title={`${pillar.label} | Plotune`} description={pillar.intro} path={pillar.path} />

    <section className="relative pt-32 pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(38,166,154,0.18),transparent_34%),linear-gradient(180deg,#101112_0%,#121212_58%,#151719_100%)]" />
      <div className="relative container mx-auto max-w-3xl px-5">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{pillar.label}</p>
        <h1 className="mt-5 text-4xl font-semibold text-light-text md:text-5xl">{pillar.heroTitle}</h1>
        <p className="mt-6 text-lg leading-8 text-gray-text">{pillar.intro}</p>
      </div>
    </section>

    <section className="pb-16">
      <div className="container mx-auto max-w-3xl px-5">
        <h2 className="text-lg font-semibold text-light-text">Traditional automation vs. an agentic workflow</h2>
      </div>
      <div className="container mx-auto grid max-w-3xl gap-6 px-5 pt-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] bg-dark-card/80 p-6 shadow-custom">
          <h3 className="text-base font-semibold text-light-text">Traditional automation</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-text">
            {pillar.traditional.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="rounded-[1.5rem] border border-primary/20 bg-dark-card/80 p-6 shadow-custom">
          <h3 className="text-base font-semibold text-light-text">The agentic approach</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-text">
            {pillar.agentic.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>

    <section className="pb-16">
      <div className="container mx-auto max-w-3xl px-5">
        <h2 className="text-lg font-semibold text-light-text">Explore by workflow</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {pillar.segmentSlugs.map((slug) => {
            const segment = solutionSegments[slug];
            if (!segment) return null;
            return (
              <Link
                key={slug}
                to={withFunnelParams(`/solutions/${slug}`)}
                className="group rounded-[1.25rem] bg-dark-card/80 p-5 shadow-custom transition-all duration-300 hover:bg-dark-card"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{segment.label}</p>
                <p className="mt-2 text-sm leading-6 text-gray-text">{segment.heroTitle}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-light-text">
                  Read more <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>

    <section className="pb-24">
      <div className="container mx-auto max-w-3xl px-5">
        <div className="rounded-[2rem] bg-[linear-gradient(145deg,rgba(38,166,154,0.16),rgba(63,81,181,0.08))] p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-light-text">See the bounded-operation model in practice.</h3>
              <p className="mt-2 text-gray-text">Plotune Nexus is the runtime this whole approach is built on.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={withFunnelParams('/nexus')} className="inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.06] px-6 py-3 font-semibold text-light-text transition-all duration-300 hover:bg-white/[0.1]">
                Explore Nexus
              </Link>
              <Link to={withFunnelParams('/contact')} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark">
                Discuss your setup <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default AgenticTestDevelopmentPage;
