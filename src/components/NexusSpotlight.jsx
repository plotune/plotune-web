import React from 'react';
import { FiClock, FiCpu, FiMapPin, FiShield } from 'react-icons/fi';

const pillars = [
  {
    title: 'Anywhere Access',
    body: 'Work from the lab, your office, or directly at the vehicle. Your test system is always reachable.',
    icon: FiMapPin,
  },
  {
    title: 'Secure & Reliable',
    body: 'Enterprise-grade protection for your test data and configurations.',
    icon: FiShield,
  },
  {
    title: 'Faster Execution',
    body: 'Automate repetitive tasks and reduce manual steps across your validation workflow.',
    icon: FiClock,
  },
  {
    title: 'Smarter Decisions',
    body: 'Use AI-powered context to accelerate engineering judgments, with over 500 automotive-specific skills built in.',
    icon: FiCpu,
  },
];

const NexusSpotlight = () => {
  return (
    <section className="bg-dark-card/30 py-14">
      <div className="container mx-auto px-5">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Plotune Nexus</p>
          <h2 className="mt-4 text-3xl font-bold text-light-text md:text-4xl">
            Control your validation workflow from one place.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article key={pillar.title} className="rounded-2xl bg-dark-card p-6 shadow-custom">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Icon className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-light-text">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-text">{pillar.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NexusSpotlight;
