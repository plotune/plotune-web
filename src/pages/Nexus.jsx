import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useCtaTracking } from '../utils/ctaTracking';
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiCpu,
  FiPlay,
  FiRefreshCw,
  FiShield,
  FiXCircle,
} from 'react-icons/fi';

const nexusImage = '/assets/plotune-nexus.webp';

// Everything on this page is taken from the Nexus docs (architecture, quick start, hardware
// compatibility) and the approved positioning in the Nexus repo. If a claim here changes,
// change the docs first.

const heroFacts = ['Rent or buy', 'Arrives ready to use', 'Runs on your own network'];

const flow = [
  {
    title: 'Your AI agent',
    copy: 'Claude Code, Cursor, VS Code, n8n, or any MCP-capable tool.',
  },
  {
    title: 'Plotune Nexus',
    copy: 'The box on your network. It gives the agent a fixed set of bounded, logged actions instead of raw access.',
    highlight: true,
  },
  {
    title: 'Your test bench',
    copy: 'ECU, rig or vehicle, over CAN, UART, XCP, DoIP or DDS.',
  },
];

const youGet = [
  {
    title: 'The appliance',
    copy: 'A Plotune-provisioned mini-PC in a sealed case. In the box: the appliance, a power cable, and an Ethernet cable if included with your unit. It is not software you install on your own PC.',
    icon: FiCpu,
  },
  {
    title: 'Software, updates and support',
    copy: 'Nexus software arrives pre-installed and licensed. Plotune handles updates, support and the device lifecycle.',
    icon: FiRefreshCw,
  },
  {
    title: 'A first test on day one',
    copy: 'Built-in CAN, UART/XCP and DDS simulators let you run a full test before you connect any hardware of your own.',
    icon: FiPlay,
  },
  {
    title: 'Not in the box',
    copy: 'Your CAN adapter and your bench. Plug in a supported adapter (see the list below) and connect it to the appliance by USB.',
    icon: FiAlertCircle,
  },
];

const startSteps = [
  ['Plug in power and Ethernet', 'Nothing to install on the box. It is already set up.'],
  ['Open its page in your browser and sign in', 'The first account to sign in becomes the owner and manages access for the rest of your team.'],
  ['Connect your AI tool', 'Claude Code, Cursor, VS Code or n8n connect to the box through a standard MCP endpoint.'],
  ['Run a first test', 'Use the built-in simulators, or point the same actions at your own bench.'],
];

const canRun = [
  ['CAN with DBC', 'Capture traffic, send messages encoded from your DBC, and wait for a decoded signal to reach a value. Classic CAN today; CAN FD is in qualification.'],
  ['UART and RS-485', 'Open serial sessions, read, write, wait and record, including RS-485 and modem-control lines.'],
  ['XCP measurement and calibration', 'Measure and read or write calibration over XCP on CAN and on Ethernet, with the connection details picked up from your A2L file.'],
  ['UDS over CAN and DoIP', 'Send diagnostic requests to an ECU over CAN or over DoIP, with clear error reporting.'],
  ['ROS 2 and DDS', 'Discover topics, publish commands, wait for a state, and record the whole run.'],
  ['Repeatable test sequences', 'Chain steps into a sequence you can rerun, with each run saved as evidence.'],
];

const worksToday = [
  'PEAK PCAN adapters',
  'Kvaser adapters',
  'HMS IXXAT USB-to-CAN',
  'ETAS ES581, ES582 and ES584',
  'SLCAN adapters such as CANable',
  'Any ECU or gateway reachable over DoIP',
  'Any CAN, Ethernet or serial connection you can reach with the above, whatever else is on that bench',
];

// Closed vendor stacks: things that only work through the vendor's own driver or software.
// A bench that happens to contain this hardware is still reachable over its standard
// CAN / Ethernet / serial connections; it is the vendor stack itself that is not supported.
const notYet = [
  'Vector interfaces (through the Vector driver)',
  'NI-XNET (through the NI driver)',
  'J2534 and D-PDU tools',
  "dSPACE's own HIL runtime and toolchain",
];

const dataPoints = [
  'Recordings and logs are written on the device first.',
  'The cloud is used for remote access, sign-in, licensing and optional export.',
  'Local operation continues if the cloud connection is degraded.',
];

const Nexus = () => {
  // Only the two contact CTAs are measured (hero = first-screen message test, bottom = whether
  // people reach the end). The secondary buttons beside them share a viewport with them and
  // would just fire the same impression at the same moment.
  const heroContactCta = useCtaTracking('nexus_hero_contact');
  const bottomContactCta = useCtaTracking('nexus_bottom_contact');

  return (
    <main className="overflow-hidden bg-dark-bg text-dark-text">
      <Seo
        title="Plotune Nexus: Local-First Appliance for AI-Ready Test Systems"
        description="Plotune Nexus is a managed, local-first appliance that connects to real test systems and runs bounded, AI-ready workflows over a standard MCP surface, with data that stays yours."
        path="/nexus"
      />

      {/* 1. What it is, in plain words */}
      <section className="relative pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(38,166,154,0.22),transparent_38%),radial-gradient(circle_at_82%_18%,rgba(63,81,181,0.16),transparent_24%),linear-gradient(180deg,#101112_0%,#121212_55%,#151719_100%)]" />
        <div className="relative container mx-auto px-5">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary md:text-sm md:tracking-[0.18em]">
                For test and validation engineers
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-light-text md:mt-4 md:text-6xl">
                Connect your AI agents to real hardware.
              </h1>
              <p className="mt-4 text-base leading-7 text-gray-text md:mt-5 md:text-lg md:leading-8">
                Plotune Nexus is a ready-to-use box that sits next to your test bench. Your AI agent
                uses it to run bounded, logged tests on real CAN, UART, XCP and DoIP hardware, on your
                own network.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 md:mt-6">
                {heroFacts.map((fact) => (
                  <li
                    key={fact}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-light-text md:gap-2 md:px-4 md:py-2 md:text-sm"
                  >
                    <FiCheckCircle className="shrink-0 text-primary" aria-hidden="true" />
                    {fact}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8 md:gap-4">
                <Link
                  to="/contact"
                  ref={heroContactCta.ref}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-lg"
                >
                  Ask about renting or buying
                  <FiArrowRight />
                </Link>
                <Link
                  to="#what-you-get"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 font-semibold text-light-text transition-all duration-300 hover:border-primary hover:bg-primary/10"
                >
                  See what you get
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#0f1012]/85 p-5 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">The appliance</p>
                <h2 className="mt-2 text-xl font-semibold text-light-text">
                  A managed box, delivered set up and licensed
                </h2>
                <div className="mt-5 rounded-[1.5rem] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),rgba(0,0,0,0)_42%),linear-gradient(180deg,#1a1a1c_0%,#0d0d10_100%)] p-5">
                  <img
                    src={nexusImage}
                    alt="Plotune Nexus appliance"
                    width={1088}
                    height={725}
                    fetchPriority="high"
                    className="mx-auto w-full max-w-[34rem] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.75)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How it fits: the product sits in the middle, the bench is on the page */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-light-text md:text-4xl">What it does, in one picture</h2>
            <p className="mt-4 text-lg leading-8 text-gray-text">
              AI agents are good at reasoning about tests and cannot reach your hardware. Nexus is the
              safe link between the two.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {flow.map((step, index) => (
              <React.Fragment key={step.title}>
                <div
                  className={`rounded-2xl p-6 text-center shadow-custom ${
                    step.highlight
                      ? 'border border-primary/40 bg-primary/10'
                      : 'bg-dark-card/80'
                  }`}
                >
                  <h3 className="text-xl font-semibold text-light-text">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-text">{step.copy}</p>
                </div>
                {index < flow.length - 1 && (
                  <div className="flex items-center justify-center text-2xl text-primary" aria-hidden="true">
                    <span className="md:hidden">↓</span>
                    <span className="hidden md:inline">→</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-7 text-gray-text">
            Every run leaves evidence: logs, traces and recordings, saved on the device first.
          </p>
        </div>
      </section>

      {/* 3. What exactly is being rented or bought */}
      <section id="what-you-get" className="scroll-mt-24 py-16">
        <div className="container mx-auto px-5">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-light-text md:text-4xl">
              What you are renting or buying
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-text">
              A physical appliance plus the software and support that keep it running. Here is exactly
              what that means.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {youGet.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="rounded-2xl bg-dark-card/80 p-6 shadow-custom">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25">
                    <Icon className="text-xl" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-light-text">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-text">{item.copy}</p>
                </article>
              );
            })}
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-base leading-8 text-gray-text">
            Rent it, run one real workflow, and decide from there, or buy it outright. Ask us for the
            current terms and availability in your country.
          </p>
        </div>
      </section>

      {/* 4. How you start */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-semibold text-light-text md:text-4xl">How you start</h2>
            <ol className="mt-10 space-y-6">
              {startSteps.map(([title, copy], index) => (
                <li key={title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-light-text">{title}</p>
                    <p className="mt-1 text-sm leading-7 text-gray-text">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 5. What the agent can actually run */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-light-text md:text-4xl">What your agent can run</h2>
            <p className="mt-4 text-lg leading-8 text-gray-text">
              Each action is bounded and logged, so you can see exactly what the agent did.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {canRun.map(([title, copy]) => (
              <article key={title} className="rounded-2xl bg-dark-card/80 p-6 shadow-custom">
                <h3 className="text-xl font-semibold text-light-text">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-text">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Will it work with my hardware: honest, so the wrong bench self-selects out */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-light-text md:text-4xl">Will it work with your hardware?</h2>
            <p className="mt-4 text-lg leading-8 text-gray-text">
              An honest list, so you do not have to guess.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-dark-card/80 p-6 shadow-custom">
              <h3 className="text-xl font-semibold text-light-text">Works today</h3>
              <ul className="mt-4 space-y-3">
                {worksToday.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-gray-text">
                    <FiCheckCircle className="mt-1 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-dark-card/80 p-6 shadow-custom">
              <h3 className="text-xl font-semibold text-light-text">Closed vendor stacks, not supported yet</h3>
              <ul className="mt-4 space-y-3">
                {notYet.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-gray-text">
                    <FiXCircle className="mt-1 shrink-0 text-gray-text" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-7 text-gray-text">
                These only work through the vendor’s own driver or software, so they would need a separate integration project. A CAN, Ethernet or serial connection on the same bench still works.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-text">
            Not sure about yours?{' '}
            <Link to="/docs/nexus/hardware-compatibility" className="font-semibold text-primary hover:text-primary-dark">
              See the full compatibility table
            </Link>
            .
          </p>
        </div>
      </section>

      {/* 7. Data stays local first */}
      <section className="py-16">
        <div className="container mx-auto px-5">
          <div className="mx-auto max-w-3xl rounded-2xl border border-primary/25 bg-primary/10 p-6 md:p-8">
            <div className="flex items-center gap-3">
              <FiShield className="shrink-0 text-xl text-primary" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-light-text">Your data stays local first</h2>
            </div>
            <ul className="mt-4 space-y-2">
              {dataPoints.map((point) => (
                <li key={point} className="text-sm leading-7 text-gray-text">{point}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              <Link to="/docs/nexus/security-model" className="font-semibold text-primary hover:text-primary-dark">
                Read the security model
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 8. Close */}
      <section className="pb-24 pt-8">
        <div className="container mx-auto px-5">
          <div className="flex flex-col items-center justify-center gap-4 rounded-[2rem] bg-[linear-gradient(145deg,rgba(38,166,154,0.16),rgba(63,81,181,0.12))] p-8 text-center shadow-custom md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className="text-2xl font-semibold text-light-text">Rent it, run one real workflow, and decide from there.</h3>
              <p className="mt-2 text-gray-text">Tell us what your bench uses and we will tell you honestly whether Nexus fits.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/nexus/use-cases"
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 font-semibold text-light-text transition-all duration-300 hover:border-primary hover:bg-primary/10"
              >
                See example workflows
              </Link>
              <Link
                to="/contact"
                ref={bottomContactCta.ref}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"
              >
                Ask about renting or buying
                <FiArrowRight />
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-text">
            Already evaluating the technical fit?{' '}
            <Link to="/docs/nexus" className="font-semibold text-primary hover:text-primary-dark">
              Read the Nexus documentation
            </Link>
            {' '}for the security model, hardware compatibility, and MCP API reference.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Nexus;
