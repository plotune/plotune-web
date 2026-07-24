import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { ReactComponent as BusGateSvg } from '../assets/use-case-bus-gate.svg';
import { ReactComponent as DiffSvg } from '../assets/use-case-diff.svg';
import { ReactComponent as TimelineSvg } from '../assets/use-case-timeline.svg';
import { ReactComponent as MeshSvg } from '../assets/use-case-mesh.svg';
import { ReactComponent as DocumentSvg } from '../assets/use-case-document.svg';

const runs = [
  {
    id: 'dds-requirement-gate',
    source: 'Claude · ROS 2',
    title: 'DDS requirement gate, 15 for 15',
    status: 'Gate passed',
    copy: 'Gated a requirement on live DDS telemetry across a reliability soak — every run matched, no flakes.',
    chips: ['15/15 PASS', '0 flakes', '~0.3 s match'],
    Svg: BusGateSvg,
  },
  {
    id: 'dds-command-measure',
    source: 'Claude · ROS 2',
    title: 'Command, then measure',
    status: 'Effect proven',
    copy: 'Published a scalar Twist onto the ROS 2 graph, then gated on live odometry to prove the effect.',
    chips: ['Twist → pose', 'θ 2.87', 'stop 3.3e-16'],
    Svg: MeshSvg,
  },
  {
    id: 'dds-mcap-record',
    source: 'Claude · ROS 2',
    title: 'Multi-topic evidence to one MCAP',
    status: 'Recorded',
    copy: 'Recorded several ROS 2 topics into a single MCAP as an async job, within the expected rate window.',
    chips: ['6.47 Hz', '∈ [2,10]', '194 / 30 s'],
    Svg: TimelineSvg,
  },
  {
    id: 'xcp-calibration',
    source: 'Codex · XCP',
    title: 'XCP calibration, margin restored',
    status: 'Margin restored',
    copy: 'Ran the acceptance gate, applied a bounded XCP calibration change, and reran it to confirm the margin.',
    chips: ['438 → 428 A', '2.4 → 8.7 A', 'note ready'],
    Svg: DiffSvg,
  },
  {
    id: 'field-triage-window',
    source: 'Codex · CAN + UART',
    title: 'Field triage to a fault window',
    status: 'Window found',
    copy: 'Recorded CAN and UART through a warm restart and pinned the root-cause window from the captured evidence.',
    chips: ['47.6 V', 'P0D67:28', '22.184–22.432 s'],
    Svg: DocumentSvg,
  },
];

const motionCss = `
  .nexus-showcase-status {
    animation: nexusShowcaseStatusPulse 3s ease-in-out infinite;
  }

  @keyframes nexusShowcaseStatusPulse {
    0%, 100% { opacity: 0.78; box-shadow: 0 0 0 0 rgba(38, 166, 154, 0); }
    34% { opacity: 1; box-shadow: 0 0 0 10px rgba(38, 166, 154, 0); }
    14% { opacity: 1; box-shadow: 0 0 0 0 rgba(38, 166, 154, 0.3); }
  }

  @media (prefers-reduced-motion: reduce) {
    .nexus-showcase-status {
      animation: none !important;
    }
  }
`;

const Chip = ({ value }) => (
  <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-text">
    {value}
  </span>
);

const NexusShowcase = () => (
  <section className="bg-dark-bg py-20">
    <style>{motionCss}</style>
    <div className="container mx-auto px-5">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Claude &amp; Codex, on the bench</p>
        <h2 className="mt-4 text-3xl font-bold text-light-text md:text-4xl">
          Watch an agent run the bounded workflow — and leave the proof.
        </h2>
        <p className="mt-4 text-base leading-8 text-gray-text">
          Real example runs on Plotune Nexus. The agent acquires the interface, runs the procedure,
          gates on live signals, and packages the artifact. See the full animated runtime on the Use Cases page.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {runs.map((run) => {
          const Svg = run.Svg;

          return (
            <article key={run.id} className="rounded-[1.5rem] bg-dark-card/80 p-5 shadow-custom">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gray-text">{run.source}</p>
                <span className="nexus-showcase-status shrink-0 rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {run.status}
                </span>
              </div>

              <h3 className="mt-3 text-xl font-semibold text-light-text">{run.title}</h3>

              <div className="mt-4 min-h-[9rem] overflow-hidden rounded-[1.25rem] bg-dark-surface/80">
                <Svg className="h-auto w-full" />
              </div>

              <p className="mt-4 text-sm leading-7 text-gray-text">{run.copy}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {run.chips.map((chip) => (
                  <Chip key={chip} value={chip} />
                ))}
              </div>
            </article>
          );
        })}

        <Link
          to="/nexus/use-cases"
          className="group flex flex-col justify-center rounded-[1.5rem] border border-primary/25 bg-primary/[0.06] p-6 text-left shadow-custom transition-all duration-300 hover:-translate-y-1 hover:bg-primary/[0.1]"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Use Cases</p>
          <p className="mt-3 text-lg font-semibold text-light-text">
            See these runs animate end to end, plus the full industry set.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">
            See it run in Use Cases
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </div>
  </section>
);

export default NexusShowcase;
