import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const industries = [
  'Automotive & Mobility',
  'Robotics',
  'Autonomous Systems',
  'ECU & Gateway',
  'Field Diagnostics',
  'HIL & Test Automation',
];

const subpages = [
  {
    label: 'Connectivity',
    copy: 'One connection point for the test systems and tools your team already uses.',
    to: '/nexus/connectivity',
  },
  {
    label: 'Stream',
    copy: 'Monitor live signals and validate requirements continuously, as your tests run.',
    to: '/nexus/stream',
  },
];

const NexusUseCasesTeaser = () => (
  <section className="bg-dark-card/30 py-16 md:py-20">
    <div className="container mx-auto px-5">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Scenarios by industry</p>
        <h2 className="mt-4 text-3xl font-bold text-light-text md:text-4xl">
          See how Plotune Nexus works in your world.
        </h2>
        <p className="mt-4 text-base leading-8 text-gray-text">
          From automotive validation and autonomous robotics to ECU integration, field diagnostics,
          and test automation, each scenario shows the workflows Nexus runs on real hardware and the
          evidence each one leaves behind.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {industries.map((industry) => (
            <span
              key={industry}
              className="rounded-full bg-white/[0.05] px-4 py-2 text-xs font-semibold text-gray-text sm:text-sm"
            >
              {industry}
            </span>
          ))}
        </div>

        <Link
          to="/nexus/use-cases"
          className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-lg"
        >
          Explore the Use Cases
          <FiArrowRight />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2">
        {subpages.map((page) => (
          <Link
            key={page.to}
            to={page.to}
            className="group flex items-center justify-between gap-4 rounded-2xl bg-dark-card p-6 shadow-custom transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <h3 className="text-xl font-semibold text-light-text">{page.label}</h3>
              <p className="mt-2 text-sm leading-7 text-gray-text">{page.copy}</p>
            </div>
            <FiArrowRight className="shrink-0 text-xl text-primary transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default NexusUseCasesTeaser;
