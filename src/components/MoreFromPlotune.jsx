import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const items = [
  {
    label: 'Plotune Desktop App',
    copy: 'Bring Plotune to your machine. Available for Windows and Linux.',
    to: '/download',
  },
  {
    label: 'Extensions',
    copy: 'Extend Plotune with a growing marketplace of integrations and tools.',
    to: '/extensions',
  },
];

const MoreFromPlotune = () => (
  <section className="bg-dark-bg py-16 md:py-20">
    <div className="container mx-auto px-5">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">More from Plotune</p>
        <h2 className="mt-4 text-3xl font-bold text-light-text md:text-4xl">
          There is more to explore.
        </h2>
      </div>

      <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex items-center justify-between gap-4 rounded-2xl bg-dark-card p-6 shadow-custom transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <h3 className="text-xl font-semibold text-light-text">{item.label}</h3>
              <p className="mt-2 text-sm leading-7 text-gray-text">{item.copy}</p>
            </div>
            <FiArrowRight className="shrink-0 text-xl text-primary transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default MoreFromPlotune;
