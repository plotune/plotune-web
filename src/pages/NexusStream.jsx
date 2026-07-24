import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import {
  FiArrowRight,
  FiBarChart2,
  FiBell,
  FiCheckCircle,
  FiClock,
  FiCloud,
  FiDatabase,
  FiFileText,
  FiMonitor,
  FiRefreshCw,
  FiShield,
  FiZap,
} from 'react-icons/fi';

const steps = [
  ['Step 1', 'Stream live test data', 'Your test environment sends live signals from Plotune Nexus to the validation system. CAN, XCP, Ethernet, all supported.'],
  ['Step 2', 'Monitor conditions continuously', 'Validation logic runs around the clock on incoming data. No one needs to be watching.'],
  ['Step 3', 'Trigger actions automatically', 'When a condition is met, a threshold crossed, or a signal pattern matched, the system starts logging, runs a test, or applies a change. Automatically.'],
  ['Step 4', 'Analyze and validate results', 'Results are checked against your defined requirements. Pass, fail, deviation, all captured and categorized.'],
  ['Step 5', 'Notify and report instantly', 'Alerts, logs, and structured reports are generated and sent to your team the moment validation is complete.'],
];

const testSources = ['Vehicle / ECU', 'Test Bench / HiL', 'Measurement Devices', 'Other Sources'];
const agentActions = ['Monitor Conditions', 'Run Actions', 'Analyze Results', 'Generate Reports', 'Send Notifications'];
const results = ['Real-time Dashboards', 'Reports & Logs', 'Alerts & Notifications', 'Your Database / Data Lake', 'External Systems (via integration)'];

const badges = [
  ['Always-on, 24/7', "Validation doesn't stop when your team does.", FiCloud],
  ['Secure by design', 'Your test data stays protected throughout the pipeline.', FiShield],
  ['Scalable & resilient', 'Grows with your test volume. Built to handle real production workloads.', FiBarChart2],
  ['Low latency & responsive', "Validation results arrive when they're still actionable.", FiZap],
];

const scenarios = [
  ['Night Validation Runs', 'Set up your validation routines before you leave for the day. Plotune Stream runs them overnight and your results are waiting when you arrive in the morning.'],
  ['Calibration Change Validation', 'Apply a calibration change, then let Plotune Stream monitor the system response automatically. Verify expected behavior without watching the screen.'],
  ['Fault-Triggered Recording', 'Define a fault condition. When a signal crosses your threshold, Plotune Stream immediately starts logging and notifies your team, so you never miss a critical event.'],
  ['Requirement Regression Checks', 'When a requirement changes, Plotune Stream automatically re-runs the relevant validation routines. Your test coverage stays current without manual effort.'],
  ['Remote Expert Support', 'Your on-site team runs the vehicle. A remote validation expert monitors and validates from another location in real time, using the same live data stream.'],
];

const FlowBox = ({ title, children, icon: Icon }) => (
  <div className="rounded-2xl bg-dark-surface p-5 shadow-custom">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="text-xl text-primary" />}
      <h3 className="text-lg font-semibold text-light-text">{title}</h3>
    </div>
    <div className="mt-4 space-y-2">{children}</div>
  </div>
);

const FlowArrow = () => <div className="py-2 text-center text-3xl text-primary">↓</div>;

const NexusStream = () => {
  return (
    <main className="overflow-hidden bg-dark-bg text-dark-text">
      <Seo
        title="Plotune Stream: Live Validation as Your Tests Run"
        description="Plotune Stream monitors live signals and validates requirements continuously, close to your hardware, so teams get results the moment something happens."
        path="/nexus/stream"
      />
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(38,166,154,0.22),transparent_38%),radial-gradient(circle_at_82%_18%,rgba(63,81,181,0.18),transparent_28%),linear-gradient(180deg,#101112_0%,#121212_100%)]" />
        <div className="relative container mx-auto px-5">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Plotune Nexus</p>
              <h1 className="mt-5 text-4xl font-semibold text-light-text md:text-6xl">
                Plotune Stream Integration
              </h1>
              <p className="mt-6 text-xl font-semibold text-primary">
                Turn live test data into continuous validation.
              </p>
              <div className="mt-6 space-y-5 text-lg leading-8 text-gray-text">
                <p>Monitor signals, trigger routines, and validate requirements as your tests run, not after the fact.</p>
                <p>
                  Plotune Stream keeps validation running in the background, 24 hours a day, so your team gets results the moment something happens, or the moment it should have happened but didn't.
                </p>
              </div>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark">
                  Request a Demo
                  <FiArrowRight />
                </Link>
                <Link to="/nexus/connectivity" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 font-semibold text-light-text transition-all duration-300 hover:border-primary hover:bg-primary/10">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-primary/25 bg-primary/10 p-8 shadow-custom">
              <FiClock className="text-3xl text-primary" />
              <p className="mt-5 text-2xl font-semibold text-light-text">
                Always-on validation logic in the cloud.
              </p>
              <p className="mt-3 text-lg text-gray-text">Runs close to your data. 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-5">
          <h2 className="text-3xl font-semibold text-light-text md:text-4xl">How Plotune Stream works</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-5">
            {steps.map(([step, title, copy]) => (
              <article key={title} className="rounded-2xl bg-dark-card/80 p-6 shadow-custom">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">{step}</p>
                <h3 className="mt-4 text-xl font-semibold text-light-text">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-gray-text">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-5">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-light-text md:text-4xl">Live data to validated results</h2>
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-[2rem] bg-dark-card/80 p-6 shadow-custom md:p-8">
            <FlowBox title="YOUR TEST ENVIRONMENT" icon={FiMonitor}>
              {testSources.map((item) => (
                <div key={item} className="rounded-xl bg-dark-bg px-4 py-3 text-sm text-gray-text">{item}</div>
              ))}
            </FlowBox>
            <FlowArrow />
            <FlowBox title="PLOTUNE NEXUS" icon={FiDatabase}>
              <p className="rounded-xl bg-dark-bg px-4 py-3 text-sm text-gray-text">Live data collection: CAN, XCP, Ethernet</p>
              <p className="rounded-xl bg-dark-bg px-4 py-3 text-sm text-gray-text">Secure connection & data streaming</p>
            </FlowBox>
            <FlowArrow />
            <FlowBox title="PLOTUNE STREAM" icon={FiCloud}>
              <p className="rounded-xl bg-dark-bg px-4 py-3 text-sm text-gray-text">Stream Workers: always-on validation logic</p>
            </FlowBox>
            <FlowArrow />
            <FlowBox title="AI VALIDATION AGENTS" icon={FiCheckCircle}>
              {agentActions.map((item) => (
                <div key={item} className="rounded-xl bg-dark-bg px-4 py-3 text-sm text-gray-text">{item}</div>
              ))}
            </FlowBox>
            <FlowArrow />
            <FlowBox title="RESULTS & ACTIONS" icon={FiBell}>
              {results.map((item) => (
                <div key={item} className="rounded-xl bg-dark-bg px-4 py-3 text-sm text-gray-text">{item}</div>
              ))}
            </FlowBox>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-5">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {badges.map(([title, copy, Icon]) => (
              <article key={title} className="rounded-2xl bg-dark-card/80 p-6 shadow-custom">
                <Icon className="text-2xl text-primary" />
                <h3 className="mt-4 text-xl font-semibold text-light-text">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-text">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-5">
          <h2 className="text-3xl font-semibold text-light-text md:text-4xl">How teams use Plotune Stream today</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {scenarios.map(([title, copy]) => (
              <article key={title} className="rounded-2xl bg-dark-card/80 p-6 shadow-custom">
                <FiFileText className="text-2xl text-primary" />
                <h3 className="mt-4 text-xl font-semibold text-light-text">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-gray-text">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 pt-8">
        <div className="container mx-auto px-5">
          <div className="rounded-[2rem] bg-[linear-gradient(145deg,rgba(38,166,154,0.16),rgba(63,81,181,0.12))] p-8 text-center shadow-custom md:p-12">
            <h2 className="text-3xl font-semibold text-light-text md:text-4xl">
              Set up once. Let validation run continuously.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-text">
              Stream workers monitor, trigger, and validate, without manual intervention. Your team stays focused on engineering, not on watching test screens.
            </p>
            <Link to="/contact" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark">
              Request a Demo
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NexusStream;
