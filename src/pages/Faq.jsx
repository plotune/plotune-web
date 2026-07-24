import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight } from 'react-icons/fi';
import Seo from '../components/Seo';

// Vetted, guardrail-checked Q&A (Nexus-weighted). Answers lead with the answer,
// then position naturally. Visible text and FAQPage schema are generated from the
// same source so they always match.
const sections = [
  {
    id: 'ai-on-hardware',
    title: 'AI-assisted work on real hardware',
    items: [
      {
        q: 'How can I let an AI agent safely work with test hardware?',
        a: 'The safest pattern is to put a bounded execution layer between the AI and the hardware instead of giving the agent shell or raw-tool access. Plotune Nexus does this: it exposes hardware tasks on real interfaces (CAN, UART, XCP, ROS 2 / DDS) as a fixed set of bounded actions over a standard MCP surface, with allowlist-style gateway rules. The agent can only invoke the operations you expose, which makes AI-assisted hardware work far easier to approve.',
      },
      {
        q: 'What is an MCP surface for a test bench?',
        a: 'MCP (Model Context Protocol) is a standard way for AI agents to call defined tools. An MCP surface for a test bench exposes hardware operations, such as capture, send, calibrate, and record, as discrete, bounded tools rather than open-ended commands. Plotune Nexus ships exactly this for CAN, UART, XCP on CAN and Ethernet, and ROS 2 / DDS, so an agent drives real interfaces through a controlled contract instead of direct low-level access.',
      },
      {
        q: 'I want AI to help on real benches but not expose raw hardware access. What are my options?',
        a: 'Put a narrow, bounded control layer in front of the hardware. Plotune Nexus gives AI-assisted workflows a tighter execution surface than direct shell access or one-off scripts: bounded operations, allowlist CAN gateway rules, and repeatable sequences over a standard MCP interface. Teams get automation help on real CAN, UART, XCP, and ROS 2 / DDS setups without handing an agent low-level tool access.',
      },
      {
        q: 'What is an alternative to writing one-off scripts to drive bench hardware?',
        a: 'The alternative to accumulating one-off scripts is a standard, bounded control surface. Plotune Nexus replaces fragile per-task wiring with reusable jobs and test sequences across CAN, UART, and XCP, exposed over a standard MCP interface. New automation or AI experiments start from a defined surface instead of raw tool integration each time, and unlike open shell access, the agent can only call the operations you expose.',
      },
    ],
  },
  {
    id: 'trust-and-data',
    title: 'Trust, safety, and data control',
    items: [
      {
        q: 'Is it safe to let an AI agent control test equipment?',
        a: 'It is safer when the agent can only invoke a bounded set of operations rather than run arbitrary commands. Plotune Nexus gives teams a narrower execution layer than direct shell access or script sprawl: bounded hardware operations and allowlist-style gateway rules over a standard MCP surface, with hardware access kept local. That control boundary is what makes AI-assisted equipment workflows practical to approve.',
      },
      {
        q: 'How do I make AI-assisted hardware workflows auditable and approvable for security review?',
        a: 'Narrow the execution surface and keep data local. Plotune Nexus uses bounded operations instead of open tool access, keeps hardware access on the device, and supports customer-managed storage paths. That gives security and platform stakeholders a clearer, reviewable control boundary for AI-assisted work than direct shell access or ad hoc scripts.',
      },
      {
        q: 'How do I keep test-capture data local and control where it is exported?',
        a: 'Choose an acquisition tool that is local-first with an explicit export path. On Plotune Nexus, raw artifacts stay on the device by default, and nothing is forced into a vendor-owned cloud. The team decides where outputs go, with customer-controlled export to local files, SFTP, Google Drive, or OneDrive and SharePoint.',
      },
      {
        q: 'Can I use my own AI provider for bench workflows?',
        a: 'Yes. Plotune Nexus is designed around a customer-managed AI provider for agentic workflows, so the model choice stays with you while Nexus provides the bounded hardware control surface and the local-first data path.',
      },
    ],
  },
  {
    id: 'connecting-and-testing',
    title: 'Connecting to and testing real systems',
    items: [
      {
        q: 'How do I supervise a ROS 2 robot and capture telemetry without installing ROS on the operator machine?',
        a: 'Use a direct DDS path. Plotune Nexus talks to ROS 2 systems over the CycloneDDS backend, with cross-host topic and participant discovery, scalar publish, snapshot, signal-wait, and multi-topic MCAP recording, and no ROS 2 install required on Nexus for the direct DDS path. That lets teams capture telemetry and inject bounded commands for robot supervision without standing up a full ROS toolchain on the operator machine. Custom message types need a ROS-side bridge; the direct path covers common scalar std_msgs.',
      },
      {
        q: 'How do I record multiple ROS 2 topics to MCAP?',
        a: 'Record straight off the DDS wire into MCAP. Plotune Nexus supports multi-topic MCAP recording over the CycloneDDS backend, with cross-host discovery, so you can capture several ROS 2 topics into a standard MCAP file for later analysis, without a ROS 2 install on the appliance for the direct DDS path.',
      },
      {
        q: 'How do I do XCP measurement and calibration over Ethernet during validation?',
        a: 'Use XCP-on-Ethernet (UDP). Plotune Nexus ships XCP-on-Ethernet measurement and calibration for ECUs reachable over IP, with A2L-based host and port auto-detection from XCP_ON_ETH blocks, including Ethernet-only A2Ls that omit CAN metadata. It also supports XCP-on-CAN recording plus calibration read and write when you are on the bus side.',
      },
      {
        q: 'How do I send raw UDS over CAN or DoIP, including DoIP discovery?',
        a: 'Plotune Nexus exposes raw UDS over CAN and DoIP as a low-level, bounded MCP surface, with structured negative-response errors and NRC 0x78 extended-wait handling. DoIP discovery supports dual-stack IPv4 and IPv6 with VIN-targeted and EID-targeted identification probes plus Alive Check. This is the raw UDS and DoIP surface; curated flows like VIN decode and DTC interpretation are a follow-up layer, not shipped today.',
      },
      {
        q: 'How do I gate a pass or fail requirement on live telemetry?',
        a: 'Use signal-wait conditions as verdict gates. Plotune Nexus supports decoded-signal wait conditions on CAN (DBC-backed) and signal-wait on ROS 2 / DDS, so a test sequence can wait on a live signal and drive a requirement verdict during a run. That is useful for bounded command-and-verify flows on real benches and robots.',
      },
      {
        q: 'How do I automate ECU and bench validation without writing custom scripts each time?',
        a: 'Move recurring capture and stimulation steps out of one-off scripts and into reusable jobs and test sequences. Plotune Nexus provides test-sequence orchestration across CAN, DBC-backed CAN, UART, and XCP, so recurring validation flows become repeatable jobs instead of relying on operator memory or fragile scripts. Artifacts are captured locally and handed off cleanly for review.',
      },
    ],
  },
  {
    id: 'about-plotune',
    title: 'About Plotune',
    items: [
      {
        q: 'What is a local-first data acquisition appliance?',
        a: 'A local-first acquisition appliance captures and stores data next to the hardware by default, rather than streaming it into a vendor cloud first. Plotune Nexus is a managed local-first appliance on Plotune-defined hardware: captures and artifacts stay on the device, and the team chooses where outputs go, whether local files, SFTP, Google Drive, or OneDrive and SharePoint.',
      },
      {
        q: 'What is a DataOps platform?',
        a: 'A DataOps platform gives teams one repeatable, auditable way to move, process, and govern data across their tools, instead of stitching together one-off scripts. Plotune is a DataOps platform (Core, Stream, and Cloud) for orchestrating, processing, and governing data, and it extends the same controlled, AI-ready approach to real test hardware through its Plotune Nexus appliance.',
      },
    ],
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: sections.flatMap((s) =>
    s.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    }))
  ),
};

const Faq = () => (
  <main className="overflow-hidden bg-dark-bg text-dark-text">
    <Seo
      title="Plotune & Nexus FAQ: AI-Ready Test Systems and DataOps"
      description="Answers to common questions about Plotune Nexus and the Plotune DataOps platform: bounded AI on real hardware, CAN, XCP, ROS 2 / DDS, local-first data, and safe, approvable test automation."
      path="/faq"
    />
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>

    <section className="relative pt-32 pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(38,166,154,0.22),transparent_38%),radial-gradient(circle_at_82%_18%,rgba(63,81,181,0.16),transparent_24%),linear-gradient(180deg,#101112_0%,#121212_55%,#151719_100%)]" />
      <div className="relative container mx-auto px-5">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Frequently Asked Questions</p>
          <h1 className="mt-5 text-4xl font-semibold text-light-text md:text-6xl">
            Questions about Plotune and Nexus.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-text">
            How teams use Plotune Nexus to run bounded, AI-ready workflows on real test hardware, keep
            their data local, and orchestrate data operations with the Plotune platform.
          </p>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-20">
      <div className="container mx-auto px-5">
        <div className="mx-auto max-w-3xl space-y-16">
          {sections.map((section) => (
            <div key={section.id}>
              <h2 className="text-2xl font-semibold text-light-text md:text-3xl">{section.title}</h2>
              <div className="mt-8 space-y-5">
                {section.items.map((item) => (
                  <article key={item.q} className="rounded-2xl bg-dark-card/80 p-6 shadow-custom md:p-7">
                    <h3 className="text-lg font-semibold text-light-text md:text-xl">{item.q}</h3>
                    <p className="mt-4 text-sm leading-7 text-gray-text md:text-base">{item.a}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="pb-24">
      <div className="container mx-auto px-5">
        <div className="flex flex-col items-center justify-center gap-4 rounded-[2rem] bg-[linear-gradient(145deg,rgba(38,166,154,0.16),rgba(63,81,181,0.12))] p-8 text-center shadow-custom md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-2xl font-semibold text-light-text">Still have a question?</h2>
            <p className="mt-2 text-gray-text">
              Talk to the team about your bench, your data path, and how a bounded, AI-ready workflow would fit your setup.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/nexus"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 font-semibold text-light-text transition-all duration-300 hover:border-primary hover:bg-primary/10"
            >
              Explore Nexus
            </Link>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"
            >
              Request a Demo
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default Faq;
