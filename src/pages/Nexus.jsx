import React from 'react';
import {
  FiActivity,
  FiArrowRight,
  FiCloud,
  FiCpu,
  FiDatabase,
  FiHardDrive,
  FiLayers,
  FiShield,
  FiTool,
} from 'react-icons/fi';

const contactEmail = 'contact@plotune.net';
const mailtoLink = `mailto:${contactEmail}?subject=Plotune%20Nexus%20Pre-order%20Inquiry`;
const nexusImage = '/assets/plotune-nexus.png';

const capabilityCards = [
  {
    title: 'DAQ-first device runtime',
    description:
      'Nexus is framed around adapters, recording jobs, and control paths near the hardware boundary rather than around a generic edge box story.',
    icon: FiActivity,
  },
  {
    title: 'Local value first',
    description:
      'The device stays useful on-site for acquisition and diagnostics even when remote paths are degraded or intentionally absent.',
    icon: FiCpu,
  },
  {
    title: 'Remote operations layer',
    description:
      'A control-plane service can add claim flow, secure routing, policy, and fleet visibility without turning the cloud into the data bottleneck.',
    icon: FiShield,
  },
  {
    title: 'BYO-cloud artifact model',
    description:
      'Large captures and logs are meant to land in S3-compatible storage so customers keep ownership while the platform avoids heavy storage drag.',
    icon: FiDatabase,
  },
];

const architecturePillars = [
  {
    eyebrow: 'Device Plane',
    title: 'Hardware access and async execution',
    copy:
      'DAQ adapters, local MCP tools, background jobs, diagnostics, and device UX stay close to the interfaces where timing and control actually matter.',
    icon: FiTool,
  },
  {
    eyebrow: 'Control Plane',
    title: 'Secure routing and fleet awareness',
    copy:
      'Registration, heartbeat, reachability, ownership checks, and remote access policy become a service layer instead of leaking into every local workflow.',
    icon: FiLayers,
  },
  {
    eyebrow: 'Data Plane',
    title: 'Artifact flow without cloud lock-in',
    copy:
      'Metadata can flow through Plotune while raw traces, binary captures, and large outputs move toward customer-controlled object storage.',
    icon: FiCloud,
  },
];

const dataFlowSteps = [
  'An agent invokes a device tool locally or through a routed path.',
  'The device validates the request and creates an async job.',
  'Collection runs near the hardware and writes temporary local output.',
  'Small responses can return inline while larger artifacts move to object storage.',
  'The result resolves as status, timestamps, and retrieval metadata rather than a bloated blocking payload.',
];

const preorderUseCases = [
  'Teams building AI-assisted diagnostics around CAN, Modbus, UART, or mixed field interfaces',
  'Labs that need a local MCP gateway for recording jobs and repeatable device control',
  'Industrial pilots that want remote access and fleet visibility without pushing raw data through the cloud path',
  'Customers validating a production-ready gateway that can fit into their own storage and security model',
];

const Nexus = () => {
  return (
    <main className="overflow-hidden bg-dark-bg text-dark-text">
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(38,166,154,0.22),transparent_38%),radial-gradient(circle_at_82%_18%,rgba(63,81,181,0.16),transparent_24%),linear-gradient(180deg,#101112_0%,#121212_55%,#151719_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative container mx-auto px-5">
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-text backdrop-blur">
                Plotune Nexus
                <span className="mx-3 h-1 w-1 rounded-full bg-primary" />
                Industrial MCP gateway
              </div>

              <h1 className="mt-6 max-w-3xl font-mono text-4xl font-semibold tracking-tight text-light-text md:text-6xl">
                Connect AI-driven tooling to real machines with a DAQ-native gateway.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-text">
                Plotune Nexus is a device for acquisition, control, and artifact collection near the hardware.
                It is aimed at teams exploring MCP in environments where long-running jobs, field interfaces, and large
                outputs need a more serious operating model than a simple request-response wrapper.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href={mailtoLink}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-lg"
                >
                  Pre-order by email
                  <FiArrowRight className="text-lg" />
                </a>
                <a
                  href="#nexus-preorder"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 text-base font-semibold text-light-text transition-all duration-300 hover:border-primary hover:bg-primary/10"
                >
                  Explore use cases
                </a>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-dark-card/70 p-4 shadow-custom">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">Local</p>
                  <p className="mt-2 text-sm leading-6 text-gray-text">Device-side tools and jobs stay usable at the edge.</p>
                </div>
                <div className="rounded-2xl bg-dark-card/70 p-4 shadow-custom">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">Remote</p>
                  <p className="mt-2 text-sm leading-6 text-gray-text">Control-plane services add routing, claim flow, and policy.</p>
                </div>
                <div className="rounded-2xl bg-dark-card/70 p-4 shadow-custom">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">Artifacts</p>
                  <p className="mt-2 text-sm leading-6 text-gray-text">Large outputs move toward customer-controlled object storage.</p>
                </div>
              </div>

              <p className="mt-5 text-sm text-gray-text">
                Early demand validation is open now.
                <a href={mailtoLink} className="ml-2 text-primary transition-colors hover:text-white">
                  {contactEmail}
                </a>
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -right-8 bottom-6 h-28 w-28 rounded-full bg-secondary/20 blur-3xl" />

              <div className="relative rounded-[2rem] bg-[#0f1012]/85 p-5 shadow-2xl backdrop-blur-xl">
                <div className="rounded-[1.6rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Hardware</p>
                      <h2 className="mt-2 text-2xl font-semibold text-light-text">Nexus edge appliance</h2>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-text">
                      render
                    </div>
                  </div>

                  <div className="relative mt-6 overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),rgba(0,0,0,0)_42%),linear-gradient(180deg,#1a1a1c_0%,#0d0d10_100%)] p-5">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03),transparent_18%,transparent_82%,rgba(255,255,255,0.03))]" />
                    <img
                      src={nexusImage}
                      alt="Plotune Nexus hardware"
                      className="relative z-10 mx-auto w-full max-w-[34rem] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.75)]"
                    />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-dark-card/70 p-4">
                      <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Positioning</p>
                      <p className="mt-2 text-sm leading-6 text-gray-text">
                        A bridge between MCP-native software workflows and field-facing industrial interfaces.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-dark-card/70 p-4">
                      <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Launch Goal</p>
                      <p className="mt-2 text-sm leading-6 text-gray-text">
                        Validate where gateway demand is strongest before freezing the production package.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="container mx-auto px-5">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-primary">Why Nexus</p>
            <h2 className="mt-4 text-3xl font-semibold text-light-text md:text-4xl">
              A practical MCP gateway for acquisition-heavy workflows
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-text">
              The product thesis is straightforward: create value locally on the device, layer recurring operational
              value in the control plane, and avoid turning high-volume industrial data into a central cost center.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {capabilityCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-[1.5rem] bg-dark-card/70 p-6 shadow-custom transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/30">
                    <Icon className="text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-light-text">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-text">{card.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20" id="nexus-strategy">
        <div className="container mx-auto px-5">
          <div className="grid gap-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-primary">System Shape</p>
              <h2 className="mt-4 text-3xl font-semibold text-light-text md:text-4xl">
                Structured for the real split between device, control, and data
              </h2>
              <p className="mt-5 text-lg leading-8 text-gray-text">
                Nexus is easier to reason about when these boundaries stay clean: the device handles hardware access and
                jobs, the control plane handles secure reachability and policy, and the data plane handles large
                artifacts without forcing them through the central path.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {architecturePillars.map((pillar) => {
                const Icon = pillar.icon;

                return (
                  <article
                    key={pillar.eyebrow}
                    className="rounded-[1.8rem] bg-dark-card/70 p-7 shadow-custom"
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-primary ring-1 ring-white/10">
                        <Icon className="text-xl" />
                      </div>
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">{pillar.eyebrow}</p>
                        <h3 className="mt-3 text-2xl font-semibold text-light-text">{pillar.title}</h3>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-text">{pillar.copy}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-5">
          <div className="rounded-[2.2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8 shadow-custom md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
              <div>
                <p className="font-mono text-sm uppercase tracking-[0.3em] text-primary">Data Flow</p>
                <h2 className="mt-4 text-3xl font-semibold text-light-text md:text-4xl">
                  Designed around async capture and artifact handoff
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-gray-text">
                  The acquisition model assumes that recordings can be slow, stateful, and large. Nexus is meant to
                  return small direct results when appropriate and hand off substantial outputs through a storage-aware
                  workflow instead of trapping everything in a blocking response cycle.
                </p>
              </div>

              <div className="rounded-[1.8rem] bg-dark-card/70 p-6">
                <div className="space-y-4">
                  {dataFlowSteps.map((step, index) => (
                    <div key={step} className="flex gap-4 rounded-2xl bg-dark-surface/80 p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-sm text-primary">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-7 text-gray-text">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-8" id="nexus-preorder">
        <div className="container mx-auto px-5">
          <div className="rounded-[2.4rem] bg-[radial-gradient(circle_at_top_left,rgba(38,166,154,0.18),transparent_42%),linear-gradient(145deg,rgba(15,16,18,0.94),rgba(24,26,29,0.94))] p-8 shadow-custom md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="font-mono text-sm uppercase tracking-[0.3em] text-primary">Pre-order Interest</p>
                <h2 className="mt-4 text-3xl font-semibold text-light-text md:text-4xl">
                  Pre-order if Nexus fits your deployment
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-gray-text">
                  If you already see a fit for an MCP-native DAQ gateway in your workflow, reach out for pre-order
                  discussions. The right starting customers are teams that need hardware access, async collection, and a
                  clear path to controlled remote operations.
                </p>
              </div>

              <div className="rounded-[1.8rem] bg-dark-card/70 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-gray-text">Example use cases</p>
                <div className="mt-4 space-y-3">
                  {preorderUseCases.map((signal) => (
                    <div key={signal} className="flex items-start gap-3 rounded-xl bg-dark-surface/80 px-4 py-3">
                      <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                        <FiHardDrive className="text-sm" />
                      </span>
                      <p className="text-sm leading-6 text-gray-text">{signal}</p>
                    </div>
                  ))}
                </div>
                <a
                  href={mailtoLink}
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"
                >
                  Email for pre-order
                  <FiArrowRight className="text-lg" />
                </a>
                <p className="mt-4 text-sm text-gray-text">{contactEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Nexus;
