import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { ReactComponent as ConnectivityHub } from '../assets/connectivity-hub.svg';
import {
  FiArrowRight,
  FiCloud,
  FiCpu,
  FiMapPin,
  FiRepeat,
  FiShare2,
  FiSliders,
  FiUsers,
  FiZap,
} from 'react-icons/fi';

const interfaces = [
  ['SocketCAN', 'Connect any compatible CAN hardware and read or write vehicle bus signals directly.', FiShare2],
  ['UART', 'Serial communication for embedded systems and legacy test equipment.', FiSliders],
  ['XCP', 'Connect to measurement and calibration workflows already used in automotive validation.', FiZap],
  ['Open Interfaces', "Work with hardware that exposes open access to your team's test and measurement data.", FiCloud],
];

const systems = [
  ['Vehicle ECUs', 'On-vehicle testing, connect directly to the ECU under test.'],
  ['Test Benches', 'HIL rigs, test stands, and full bench setups.'],
  ['Measurement Devices', 'DAQ systems, XCP measurement tools, and sensors.'],
  ['Custom Setups', 'Flexible integration for non-standard or bespoke test environments.'],
];

const enables = [
  ['Describe tests in plain language', 'Tell Plotune Nexus what you need to validate. It figures out how to run it.'],
  ['Read and write CAN and XCP signals directly', 'Interact with your measurement setup instantly, no extra tooling required.'],
  ['Update software and calibrations remotely', 'Apply changes to your ECU or calibration target from anywhere.'],
  ['Run automated test routines on a schedule', 'Create, execute, and repeat test jobs without manual intervention.'],
  ['Log data based on conditions', 'Define signal thresholds or events. Plotune Nexus logs what matters, when it matters.'],
  ['Store results in your own systems', 'Results go directly to your database or data environment, no manual export.'],
  ['Connect to AI validation services securely', 'Extend Plotune Nexus with AI-powered validation while keeping your data protected.'],
];

const values = [
  ['Mobility', 'Run tests from anywhere: lab, vehicle, or remote site.', FiMapPin],
  ['Automation', 'Execute full validation cycles without manual steps.', FiRepeat],
  ['Collaboration', 'Bridge your on-site team with remote experts in real time.', FiUsers],
];

const ConnectivityArt = () => {
  return (
    <div className="hidden lg:block">
      <div className="relative h-[31rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f1012]/85 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_20%,rgba(38,166,154,0.20),transparent_34%),radial-gradient(circle_at_78%_72%,rgba(63,81,181,0.16),transparent_38%),linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />

        <ConnectivityHub className="absolute inset-0 h-full w-full p-4" />
      </div>
    </div>
  );
};

const NexusConnectivity = () => {
  return (
    <main className="overflow-hidden bg-dark-bg text-dark-text">
      <Seo
        title="Plotune Nexus Connectivity: CAN, UART, XCP, ROS 2 / DDS"
        description="Connect Plotune Nexus to the test systems your team already uses: CAN, UART, XCP on CAN and Ethernet, ROS 2 / DDS over CycloneDDS, and raw UDS and DoIP."
        path="/nexus/connectivity"
      />
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(38,166,154,0.22),transparent_40%),linear-gradient(180deg,#101112_0%,#121212_100%)]" />
        <div className="relative container mx-auto px-5">
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Plotune Nexus Connectivity</p>
              <h1 className="mt-5 text-4xl font-semibold text-light-text md:text-6xl">
                One connection point for your entire test environment.
              </h1>
              <p className="mt-6 text-xl font-semibold text-primary">
                Connect to CAN, XCP, and your measurement systems, without being locked into a single vendor.
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-text">
                Plotune Nexus acts as the single interface between your tools and your workflow. Whether you're on a bench, inside a vehicle, or at a test rig, Plotune Nexus connects to what's already there.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark">
                  Request a Demo
                  <FiArrowRight />
                </Link>
                <Link to="/nexus/stream" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 font-semibold text-light-text transition-all duration-300 hover:border-primary hover:bg-primary/10">
                  Learn More
                </Link>
              </div>
            </div>

            <ConnectivityArt />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-5">
          <h2 className="text-3xl font-semibold text-light-text md:text-4xl">Works with open interfaces you already use</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-text">
            Plotune Nexus connects to hardware that supports SocketCAN, UART, XCP, or open access to measurement data.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {interfaces.map(([title, copy, Icon]) => (
              <article key={title} className="rounded-2xl bg-dark-card/80 p-6 shadow-custom">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Icon className="text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-light-text">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-gray-text">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-5">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="text-3xl font-semibold text-light-text md:text-4xl">Works with your real-world test systems</h2>
              <p className="mt-5 text-lg leading-8 text-gray-text">
                Connect Plotune Nexus where validation actually happens: in vehicles, on benches, and across measurement setups.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {systems.map(([title, copy]) => (
                <article key={title} className="rounded-2xl bg-dark-card/80 p-6 shadow-custom">
                  <FiCpu className="text-2xl text-primary" />
                  <h3 className="mt-4 text-xl font-semibold text-light-text">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-text">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-5">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-light-text md:text-4xl">What you can do with Plotune Nexus connected</h2>
          </div>
          <div className="mt-10 space-y-4">
            {enables.map(([title, copy], index) => (
              <div key={title} className="flex gap-4 rounded-2xl bg-dark-card/80 p-5 shadow-custom">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-light-text">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-text">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 pt-8">
        <div className="container mx-auto px-5">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map(([title, copy, Icon]) => (
              <article key={title} className="rounded-2xl bg-primary/10 p-6 shadow-custom">
                <Icon className="text-2xl text-primary" />
                <h3 className="mt-4 text-xl font-semibold text-light-text">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-text">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default NexusConnectivity;
