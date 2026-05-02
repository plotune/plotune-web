import React from 'react';
import { Link } from 'react-router-dom';
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_20%,rgba(38,166,154,0.28),transparent_30%),radial-gradient(circle_at_78%_72%,rgba(63,81,181,0.22),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="absolute left-8 top-8 h-28 w-44 rounded-[1.5rem] border border-white/10 bg-white/[0.05] shadow-2xl backdrop-blur-md" />
        <div className="absolute bottom-10 right-8 h-32 w-48 rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-md" />
        <div className="absolute right-16 top-14 h-20 w-20 rounded-full border border-primary/30 bg-primary/10 blur-[1px]" />

        <svg viewBox="0 0 520 420" className="absolute inset-0 h-full w-full" role="img" aria-label="Abstract connectivity artwork">
          <defs>
            <linearGradient id="artLineA" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#26A69A" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#3f51b5" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="artLineB" x1="1" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f5f5f5" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#26A69A" stopOpacity="0.75" />
            </linearGradient>
            <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path d="M92 92 C176 42, 262 82, 292 170 S386 300, 462 216" fill="none" stroke="url(#artLineA)" strokeWidth="3" strokeLinecap="round" filter="url(#softGlow)" />
          <path d="M64 304 C154 252, 190 320, 256 236 S366 76, 454 112" fill="none" stroke="url(#artLineB)" strokeWidth="2.5" strokeLinecap="round" filter="url(#softGlow)" />
          <path d="M112 210 C176 166, 208 168, 254 210 S348 266, 422 326" fill="none" stroke="#26A69A" strokeOpacity="0.42" strokeWidth="2" strokeDasharray="8 12" strokeLinecap="round" />
          <path d="M122 348 C184 288, 290 314, 336 240 S390 124, 474 70" fill="none" stroke="#3f51b5" strokeOpacity="0.38" strokeWidth="2" strokeDasharray="6 10" strokeLinecap="round" />

          <g filter="url(#softGlow)">
            {[
              [92, 92, 9],
              [64, 304, 8],
              [112, 210, 7],
              [454, 112, 9],
              [462, 216, 8],
              [422, 326, 7],
              [474, 70, 6],
            ].map(([cx, cy, r]) => (
              <g key={`${cx}-${cy}`}>
                <circle cx={cx} cy={cy} r={r + 8} fill="#26A69A" opacity="0.08" />
                <circle cx={cx} cy={cy} r={r} fill="#26A69A" opacity="0.9" />
                <circle cx={cx} cy={cy} r={r / 2} fill="#f5f5f5" opacity="0.72" />
              </g>
            ))}
          </g>

          <g transform="translate(188 142)">
            <rect x="0" y="0" width="148" height="118" rx="26" fill="#111315" stroke="#ffffff" strokeOpacity="0.12" />
            <rect x="18" y="18" width="112" height="82" rx="18" fill="#1e1e1e" stroke="#26A69A" strokeOpacity="0.38" />
            <circle cx="48" cy="58" r="16" fill="#26A69A" opacity="0.95" filter="url(#softGlow)" />
            <rect x="72" y="44" width="36" height="28" rx="8" fill="#f5f5f5" opacity="0.9" />
            <path d="M36 18 V4 M74 18 V4 M112 18 V4 M36 114 V100 M74 114 V100 M112 114 V100" stroke="#26A69A" strokeOpacity="0.72" strokeWidth="3" strokeLinecap="round" />
            <path d="M0 36 H-18 M0 60 H-18 M0 84 H-18 M148 36 H166 M148 60 H166 M148 84 H166" stroke="#3f51b5" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>

        <div className="absolute inset-x-8 bottom-8 grid grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-16 rounded-2xl border border-white/10 bg-white/[0.045] shadow-lg backdrop-blur-md">
              <div className="mx-auto mt-4 h-2 w-10 rounded-full bg-primary/70" />
              <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NexusConnectivity = () => {
  return (
    <main className="overflow-hidden bg-dark-bg text-dark-text">
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
