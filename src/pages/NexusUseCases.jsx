import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { ReactComponent as BusGateSvg } from '../assets/use-case-bus-gate.svg';
import { ReactComponent as DiffSvg } from '../assets/use-case-diff.svg';
import { ReactComponent as TimelineSvg } from '../assets/use-case-timeline.svg';
import { ReactComponent as MeshSvg } from '../assets/use-case-mesh.svg';
import { ReactComponent as DocumentSvg } from '../assets/use-case-document.svg';

const publicBase = process.env.PUBLIC_URL || '';

const syncMessageType = 'plotune-nexus-use-case';

const familyOrder = ['claude', 'codex'];

const families = {
  claude: {
    id: 'claude',
    label: 'Claude',
    shell: '~ : claude',
    railLabel: 'Operational cases',
    runtimeLabel: 'Operational flow',
    src: `${publicBase}/use-cases/claude/index.html`,
    scenarios: [
      {
        id: 'hil-firmware-gate',
        label: 'HIL firmware gate',
        status: 'Gate passed',
        chips: ['0.09 m', '52 ms', '0 unexpected'],
        Svg: BusGateSvg,
      },
      {
        id: 'gateway-regression',
        label: 'Gateway regression',
        status: 'Baseline clean',
        chips: ['+0.1 ms', '0 new IDs', 'aligned'],
        Svg: DiffSvg,
      },
      {
        id: 'bms-field-triage',
        label: 'BMS field triage',
        status: 'Root cause found',
        chips: ['820 ms', '2.4 A', 'P1C44:28'],
        Svg: TimelineSvg,
      },
      {
        id: 'multi-ecu-handshake',
        label: 'Multi-ECU handshake',
        status: 'Sign-off ready',
        chips: ['4 ECUs', '12 UDS', '0 DTC'],
        Svg: MeshSvg,
      },
    ],
  },
  codex: {
    id: 'codex',
    label: 'Codex',
    shell: 'OpenAI Codex',
    railLabel: 'Follow-up cases',
    runtimeLabel: 'Follow-up flow',
    src: `${publicBase}/use-cases/codex/index.html`,
    scenarios: [
      {
        id: 'brake-ecu',
        label: 'Brake ECU',
        status: 'Checklist built',
        chips: ['gap closed', '3 + 2 rules', 'PDF ready'],
        Svg: DocumentSvg,
      },
      {
        id: 'inverter',
        label: 'Inverter',
        status: 'Margin restored',
        chips: ['438 → 428 A', '2.4 → 8.7 A', 'note ready'],
        Svg: DiffSvg,
      },
      {
        id: 'charger',
        label: 'Charger',
        status: 'Report published',
        chips: ['22.184–22.432 s', '47.6 V', 'fault window'],
        Svg: TimelineSvg,
      },
      {
        id: 'endurance',
        label: 'Endurance',
        status: 'Addendum published',
        chips: ['+4.6 pp', '+0.8 C', 'watch item'],
        Svg: MeshSvg,
      },
    ],
  },
};

const motionCss = `
  .use-case-row {
    animation: useCaseRowPulse 5.4s ease-in-out infinite;
  }

  .use-case-status {
    animation: useCaseStatusPulse 3s ease-in-out infinite;
  }

  @keyframes useCaseRowPulse {
    0%, 100% { background-color: rgba(255, 255, 255, 0); }
    14% { background-color: rgba(38, 166, 154, 0.08); }
    26% { background-color: rgba(38, 166, 154, 0.16); }
    42% { background-color: rgba(255, 255, 255, 0.03); }
  }

  @keyframes useCaseStatusPulse {
    0%, 100% { opacity: 0.76; box-shadow: 0 0 0 0 rgba(38, 166, 154, 0); }
    34% { opacity: 1; box-shadow: 0 0 0 10px rgba(38, 166, 154, 0); }
    14% { opacity: 1; box-shadow: 0 0 0 0 rgba(38, 166, 154, 0.3); }
  }

  @media (prefers-reduced-motion: reduce) {
    .use-case-row,
    .use-case-status {
      animation: none !important;
    }
  }
`;

const CaseChip = ({ value }) => (
  <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-text">
    {value}
  </span>
);

const FamilyTab = ({ family, isActive, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`rounded-[1.35rem] px-5 py-4 text-left transition-all duration-300 ${
      isActive ? 'bg-dark-surface text-light-text shadow-custom' : 'bg-transparent text-gray-text hover:bg-white/[0.04] hover:text-light-text'
    }`}
    aria-pressed={isActive}
  >
    <p className="font-mono text-xs uppercase tracking-[0.22em] text-gray-text">{family.shell}</p>
    <h2 className="mt-3 text-2xl font-semibold">{family.label}</h2>
    <p className="mt-2 text-sm text-gray-text">{family.railLabel}</p>
  </button>
);

const HeroProof = ({ family, scenario, cycle }) => {
  const Svg = scenario.Svg;

  return (
    <div className="rounded-[2rem] bg-dark-card/80 p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-gray-text">{family.shell}</p>
          <h2 className="mt-3 text-2xl font-semibold text-light-text">{scenario.label}</h2>
        </div>
        <span className="use-case-status rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          {scenario.status}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-[#0f1114]">
        <Svg key={`${scenario.id}-hero-${cycle}`} className="h-auto w-full" />
      </div>
    </div>
  );
};

const ArtifactCard = ({ scenario, isActive, cycle, onSelect }) => {
  const Svg = scenario.Svg;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group rounded-[2rem] p-4 text-left shadow-custom transition-all duration-300 ${
        isActive ? 'bg-dark-card' : 'bg-dark-card/80'
      }`}
      aria-pressed={isActive}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-light-text">{scenario.label}</h3>
        </div>
        <span className="use-case-status shrink-0 rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          {scenario.status}
        </span>
      </div>

      <div className="mt-4 min-h-[10rem] overflow-hidden rounded-[1.5rem] bg-dark-surface/80">
        <Svg key={`${scenario.id}-${isActive ? cycle : 'idle'}`} className="h-auto w-full" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {scenario.chips.map((chip) => (
          <CaseChip key={chip} value={chip} />
        ))}
      </div>
    </button>
  );
};

const ResultMatrix = ({ scenarios }) => (
  <div className="rounded-[2rem] bg-dark-card/80 p-4 shadow-custom">
    <div className="overflow-hidden rounded-[1.5rem] bg-dark-surface/75">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-[0.22em] text-gray-text">
            <th className="px-4 py-4 font-semibold">Scenario</th>
            <th className="px-4 py-4 font-semibold">Output</th>
            <th className="px-4 py-4 font-semibold">State</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario, index) => (
            <tr
              key={scenario.id}
              className="use-case-row text-light-text"
              style={{ animationDelay: `${index * 0.42}s` }}
            >
              <td className="px-4 py-4 font-semibold">{scenario.label}</td>
              <td className="px-4 py-4 text-gray-text">{scenario.chips[0]}</td>
              <td className="px-4 py-4">
                <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {scenario.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const NexusUseCases = () => {
  const [activeFamily, setActiveFamily] = useState('claude');
  const [activeScenarioByFamily, setActiveScenarioByFamily] = useState({ claude: 0, codex: 0 });
  const [frameSeed, setFrameSeed] = useState(0);
  const [artifactCycle, setArtifactCycle] = useState(0);

  const activeFamilyConfig = families[activeFamily];
  const activeScenario = activeScenarioByFamily[activeFamily];
  const activeScenarioConfig = activeFamilyConfig.scenarios[activeScenario];

  const frameSrc = useMemo(() => {
    const params = new URLSearchParams({
      scenario: String(activeScenario),
      run: String(frameSeed),
    });

    return `${activeFamilyConfig.src}?${params.toString()}`;
  }, [activeFamilyConfig.src, activeScenario, frameSeed]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      const data = event.data;
      if (!data || data.type !== syncMessageType || !families[data.family]) return;

      if (typeof data.scenario === 'number') {
        setActiveScenarioByFamily((current) => (
          current[data.family] === data.scenario
            ? current
            : { ...current, [data.family]: data.scenario }
        ));
      }

      if (data.family !== activeFamily) setActiveFamily(data.family);
      if (data.action === 'select' || data.action === 'replay' || data.action === 'load') {
        setArtifactCycle((value) => value + 1);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeFamily]);

  const selectFamily = (family) => {
    setActiveFamily(family);
    setFrameSeed((value) => value + 1);
    setArtifactCycle((value) => value + 1);
  };

  const selectScenario = (index) => {
    setActiveScenarioByFamily((current) => ({ ...current, [activeFamily]: index }));
    setFrameSeed((value) => value + 1);
    setArtifactCycle((value) => value + 1);
  };

  return (
    <main className="overflow-hidden bg-dark-bg text-dark-text">
      <style>{motionCss}</style>

      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(38,166,154,0.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(63,81,181,0.14),transparent_28%),linear-gradient(180deg,#101112_0%,#121212_58%,#151719_100%)]" />
        <div className="relative container mx-auto px-5">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Plotune Nexus</p>
              <h1 className="mt-5 text-5xl font-semibold text-light-text md:text-7xl">
                Use Cases
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-text">
                Switch between Claude and Codex, follow the full runtime on Plotune Nexus, and read the artifacts that come out of each case.
              </p>
            </div>

            <HeroProof
              family={activeFamilyConfig}
              scenario={activeScenarioConfig}
              cycle={artifactCycle}
            />
          </div>

          <div className="mt-10 grid gap-2 rounded-[1.75rem] bg-dark-card/80 p-2 shadow-custom md:grid-cols-2">
            {familyOrder.map((familyKey) => (
              <FamilyTab
                key={familyKey}
                family={families[familyKey]}
                isActive={activeFamily === familyKey}
                onSelect={() => selectFamily(familyKey)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-5">
          <div className="rounded-[2rem] bg-dark-card/80 p-3 shadow-2xl backdrop-blur-xl md:p-4">
            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-gray-text">{activeFamilyConfig.shell}</p>
              <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-text">
                {activeFamilyConfig.runtimeLabel}
              </span>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] bg-[#090a0c]">
              <iframe
                key={`${activeFamily}-${frameSeed}`}
                src={frameSrc}
                title={`${activeFamilyConfig.label} use cases`}
                className="h-[33rem] w-full border-0 bg-[#090a0c] md:h-[40rem] xl:h-[46rem]"
                loading="eager"
              />
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Artifacts</p>
              <h2 className="mt-4 text-3xl font-semibold text-light-text md:text-4xl">
                Outputs from the active flow
              </h2>
            </div>
            <p className="hidden text-sm text-gray-text md:block">{activeFamilyConfig.railLabel}</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {activeFamilyConfig.scenarios.map((scenario, index) => (
              <ArtifactCard
                key={scenario.id}
                scenario={scenario}
                isActive={activeScenario === index}
                cycle={artifactCycle}
                onSelect={() => selectScenario(index)}
              />
            ))}
          </div>

          <div className="mt-6">
            <ResultMatrix scenarios={activeFamilyConfig.scenarios} />
          </div>

          <div className="mt-12 rounded-[2rem] bg-[linear-gradient(145deg,rgba(38,166,154,0.16),rgba(63,81,181,0.08))] p-8 shadow-custom md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-light-text">Map this to your own bench.</h3>
                <p className="mt-2 text-gray-text">Plotune Nexus can mirror the same flow shape against your own validation cases.</p>
              </div>
              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"
              >
                Talk to Plotune
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NexusUseCases;
