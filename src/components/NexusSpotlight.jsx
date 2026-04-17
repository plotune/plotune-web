import React from 'react';
import { FiArrowRight, FiCpu, FiRadio, FiDatabase } from 'react-icons/fi';

const NexusSpotlight = () => {
  return (
    <section className="py-4 bg-dark-card/30">
      <div className="container mx-auto px-5">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-dark-card p-8 shadow-custom md:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.28em] text-primary">New Project</p>
              <h2 className="mt-4 text-3xl font-bold text-light-text md:text-4xl">
                Plotune Nexus is our new MCP gateway for DAQ and machine-facing workflows
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-text">
                Nexus is being shaped as a device-side gateway for acquisition, control, and artifact collection near
                the hardware. If this matches your environment, the dedicated page now opens pre-order conversations.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#/nexus"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-lg"
                >
                  View Nexus
                  <FiArrowRight className="text-lg" />
                </a>
                <a
                  href="mailto:contact@plotune.net?subject=Plotune%20Nexus%20Pre-order%20Inquiry"
                  className="inline-flex items-center justify-center rounded-full border-2 border-primary px-7 py-3 font-semibold text-primary transition-all duration-300 hover:bg-primary/10"
                >
                  Pre-order by email
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl bg-dark-surface p-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <FiCpu className="text-xl" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-light-text">Device-side control</h3>
                <p className="mt-2 text-sm leading-6 text-gray-text">
                  Run tools and jobs near the interfaces instead of tunneling everything through a remote layer.
                </p>
              </div>
              <div className="rounded-2xl bg-dark-surface p-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <FiRadio className="text-xl" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-light-text">Remote-ready path</h3>
                <p className="mt-2 text-sm leading-6 text-gray-text">
                  Add claim flow, reachability, and managed routing when remote operations actually matter.
                </p>
              </div>
              <div className="rounded-2xl bg-dark-surface p-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <FiDatabase className="text-xl" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-light-text">Storage-aware design</h3>
                <p className="mt-2 text-sm leading-6 text-gray-text">
                  Large artifacts are meant to move into customer-controlled object storage for later analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NexusSpotlight;
