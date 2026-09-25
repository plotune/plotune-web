import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Seo from '../components/Seo';
import { nexusDocs } from '../content/nexusDocs';

const NexusDocsOverview = () => (
  <main className="overflow-hidden bg-dark-bg text-dark-text">
    <Seo
      title="Plotune Nexus Documentation"
      description="Technical reference documentation for Plotune Nexus: security model, hardware and protocol compatibility, the MCP tool surface, system architecture, and deployment."
      path="/docs/nexus"
    />
    <section className="relative pt-32 pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(38,166,154,0.16),transparent_40%),linear-gradient(180deg,#101112_0%,#121212_100%)]" />
      <div className="relative container mx-auto max-w-3xl px-5">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Documentation</p>
        <h1 className="mt-5 text-4xl font-semibold leading-tight text-light-text md:text-5xl">Plotune Nexus Documentation</h1>
        <p className="mt-6 text-lg leading-8 text-gray-text">
          Reference documentation for engineers evaluating or operating Plotune Nexus: what the
          appliance actually does, what it doesn&apos;t yet do, and how to verify either.
        </p>
      </div>
    </section>

    <section className="pb-24">
      <div className="container mx-auto max-w-3xl px-5">
        <div className="grid gap-4">
          {nexusDocs.map((doc) => (
            <Link
              key={doc.slug}
              to={`/docs/nexus/${doc.slug}`}
              className="group flex items-start justify-between gap-6 rounded-2xl border border-white/10 bg-dark-card/60 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-dark-card/90"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{doc.topic}</p>
                <h2 className="mt-2 text-xl font-semibold text-light-text group-hover:text-primary">{doc.title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-text">{doc.summary}</p>
                <p className="mt-3 text-xs text-gray-text">{doc.readingTime}</p>
              </div>
              <FiArrowRight className="mt-2 shrink-0 text-xl text-gray-text transition-colors group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default NexusDocsOverview;
