import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(38,166,154,0.14),transparent_62%),linear-gradient(180deg,#101112_0%,#121212_100%)] py-24">
      <div className="container mx-auto px-5">
        <div className="relative z-10 max-w-2xl text-center md:text-left">
          <p className="mb-5 text-lg font-semibold text-primary md:text-xl">
            Execute, validate, and adapt anywhere.
          </p>
          <h2 className="mb-6 text-4xl font-bold text-light-text md:text-6xl">
            Talk to your test systems.
          </h2>
          <p className="mb-9 text-xl font-semibold text-gray-text md:text-2xl">
            Connected. Intelligent. Automated.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-lg"
            >
              Request a Demo
            </Link>
            <Link
              to="/nexus"
              className="inline-flex items-center justify-center rounded-full border-2 border-primary px-7 py-3 font-semibold text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-primary/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-1/2 hidden w-1/2 max-w-2xl -translate-y-1/2 pr-8 md:block">
        <div className="ml-auto max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-light-text">Plotune Nexus</h3>
            <span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
              Live
            </span>
          </div>

          <div className="space-y-4">
            {[
              ['CAN / XCP', 'Read signals and trigger measurements'],
              ['Remote Tests', 'Run validation from any location'],
              ['AI Context', 'Turn requirements into test actions'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-lg border-l-4 border-primary bg-primary/10 p-4">
                <p className="font-semibold text-light-text">{title}</p>
                <p className="mt-1 text-sm text-gray-text">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
