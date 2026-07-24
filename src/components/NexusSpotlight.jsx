import React from 'react';
import { FiClock, FiCpu, FiMapPin, FiShield } from 'react-icons/fi';

const pillars = [
  {
    title: 'Local-first by design',
    body: 'Runs on Plotune-defined hardware. Raw artifacts stay on the device and move only to storage you already control.',
    icon: FiMapPin,
  },
  {
    title: 'Bounded, not raw',
    body: 'AI-assisted work runs through a narrow set of safe, approved actions instead of direct hardware access, so you always know what an agent can and cannot do.',
    icon: FiShield,
  },
  {
    title: 'Repeatable evidence',
    body: 'Recurring capture and stimulation move from operator memory into reusable jobs and test sequences that leave a packaged artifact behind.',
    icon: FiClock,
  },
  {
    title: 'Works with your setup',
    body: 'Connects to the real test systems your benches, vehicles, and rigs already use, with broad support that ships today.',
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
            One controlled surface for hardware-facing work.
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
