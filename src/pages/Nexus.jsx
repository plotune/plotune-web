import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiCloud,
  FiCpu,
  FiDatabase,
  FiDownloadCloud,
  FiRefreshCw,
  FiShield,
  FiTool,
  FiUploadCloud,
} from 'react-icons/fi';

const nexusImage = '/assets/plotune-nexus.png';

const connections = [
  {
    title: 'DAQ Connections',
    copy: 'Connects to your data acquisition systems via CAN, UART, and XCP. Read signals, trigger measurements, and log data directly.',
    icon: FiActivity,
  },
  {
    title: 'Secure File Transfer',
    copy: 'Move calibration files, test scripts, and results between systems safely. Encrypted. Reliable. No manual copying required.',
    icon: FiShield,
  },
  {
    title: 'Cloud Sync',
    copy: "Sync test data and configurations to your team's shared environment. Store results and access them from anywhere.",
    icon: FiCloud,
  },
  {
    title: 'Remote Access',
    copy: 'Connect to Plotune Nexus and your test bench from any location. Run tests from the office, home, or another site entirely.',
    icon: FiDownloadCloud,
  },
];

const capabilities = [
  ['Test Execution', 'Run test routines automatically. No manual triggering.', FiCheckCircle],
  ['Software & Calibration Updates', 'Push updates to ECUs and calibration targets directly from Plotune Nexus.', FiUploadCloud],
  ['Diagnostic Checks', 'Perform diagnostic routines on connected systems. Monitor and log results.', FiTool],
  ['Scheduling', 'Set up recurring or condition-triggered test jobs. Run them overnight, remotely, or on demand.', FiCalendar],
];

const outcomes = [
  'Test Execution',
  'Software / Calibration Update',
  'Diagnostic Checks',
  'Scheduling',
];

const Nexus = () => {
  return (
    <main className="overflow-hidden bg-dark-bg text-dark-text">
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(38,166,154,0.22),transparent_38%),radial-gradient(circle_at_82%_18%,rgba(63,81,181,0.16),transparent_24%),linear-gradient(180deg,#101112_0%,#121212_55%,#151719_100%)]" />
        <div className="relative container mx-auto px-5">
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Connect. Access. Automate.</p>
              <h1 className="mt-5 text-5xl font-semibold text-light-text md:text-7xl">
                Plotune Nexus
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-text">
                Plotune Nexus is the hardware and software hub at the center of your test environment.
                It connects your bench, your tools, and your team, and lets you control everything from anywhere.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-lg"
                >
                  Request a Demo
                  <FiArrowRight />
                </Link>
                <Link
                  to="/nexus/connectivity"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 font-semibold text-light-text transition-all duration-300 hover:border-primary hover:bg-primary/10"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#0f1012]/85 p-5 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Hardware</p>
                <h2 className="mt-2 text-2xl font-semibold text-light-text">Compact test environment hub</h2>
                <div className="mt-6 rounded-[1.5rem] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),rgba(0,0,0,0)_42%),linear-gradient(180deg,#1a1a1c_0%,#0d0d10_100%)] p-5">
                  <img
                    src={nexusImage}
                    alt="Plotune Nexus hardware"
                    className="mx-auto w-full max-w-[34rem] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.75)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-5">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-light-text md:text-4xl">
              Built for your test bench. Ready for everything connected to it.
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-text">
              Plotune Nexus speaks the same language as your test systems, out of the box, without adapters or workarounds.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {connections.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="rounded-2xl bg-dark-card/80 p-6 shadow-custom">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25">
                    <Icon className="text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-light-text">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-text">{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-5">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-semibold text-light-text md:text-4xl">
                From requirement to result, automatically.
              </h2>
              <div className="mt-5 space-y-5 text-base leading-8 text-gray-text">
                <p>Define what you need to test. Plotune Nexus handles the rest.</p>
                <p>
                  Plotune Nexus connects your company's engineering data, your test environment, and an AI agent that understands automotive validation. When a requirement comes in, Plotune Nexus figures out what to run, executes it, and delivers the result, whether that's a test run, a software update, a diagnostic check, or a scheduled routine.
                </p>
              </div>
              <div className="mt-8 rounded-2xl border border-primary/25 bg-primary/10 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Powered by 500+ Automotive Context Skills</p>
                <p className="mt-3 text-sm leading-7 text-gray-text">
                  Plotune Nexus understands the full scope of automotive validation, from ADAS and thermal behavior to diagnostics, compliance, testing, and legislation requirements.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-dark-card/80 p-6 shadow-custom">
              <div className="space-y-4">
                {['Requirement', 'Company Database + AI Agent', 'Plotune Nexus'].map((label, index) => (
                  <React.Fragment key={label}>
                    <div className="rounded-2xl bg-dark-surface p-5 text-center text-lg font-semibold text-light-text">
                      {label}
                    </div>
                    {index < 2 && <div className="text-center text-2xl text-primary">↓</div>}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-light-text">
                    <FiRefreshCw className="shrink-0 text-primary" />
                    {outcome}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-12">
        <div className="container mx-auto px-5">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-light-text md:text-4xl">
              What Plotune Nexus can do for your team
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map(([title, copy, Icon]) => (
              <article key={title} className="rounded-2xl bg-dark-card/80 p-6 shadow-custom">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-primary ring-1 ring-white/10">
                  <Icon className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-light-text">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-gray-text">{copy}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-[2rem] bg-[linear-gradient(145deg,rgba(38,166,154,0.16),rgba(63,81,181,0.12))] p-8 text-center shadow-custom md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className="text-2xl font-semibold text-light-text">Ready to connect your test environment?</h3>
              <p className="mt-2 text-gray-text">See how Plotune Nexus fits your bench, vehicle, or validation team.</p>
            </div>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"
            >
              Request a Demo
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Nexus;
