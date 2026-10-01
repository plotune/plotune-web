import { OTHER_ID } from './questions';

// ---------------------------------------------------------------------------------------------
// AI Test Readiness scoring -- V1
//
// WHAT THE SCORE MEANS
//   "How ready is this test environment for meaningful AI-agent participation?"
//   It blends four independent areas (one per question):
//     interfaces   -- can an agent physically/programmatically reach the system under test?
//     tools        -- is the existing toolchain scriptable, or locked behind a GUI/proprietary runtime?
//     bottlenecks  -- are there engineering-time sinks where an agent could provide real value?
//     automation   -- is there an automation foothold to build on, with room left for an agent?
//
// WHAT IT IS NOT
//   Not scientifically validated. The per-option values below are product-judgment heuristics
//   (the interface values follow the public Nexus hardware-compatibility tiers in
//   src/nexusdocs/docs/hardware-compatibility.mdx: Linux-native transports score high, closed
//   vendor stacks that need an integration project score low-to-middling). Change them here
//   and nowhere else; tests lock the *rules* (unknown handling, bounds, determinism), not the
//   exact numbers.
//
// RULES
//   1. Deterministic: same answers -> same score. No randomness, no model calls.
//   2. UNKNOWN != UNSUPPORTED. "Other" selections are never given a penalty or a neutral 50%.
//      They are simply left out of the maths and reduce *coverage* (how much of the bench we
//      could actually assess) instead.
//   3. An area is "assessed" when at least one of its selections is classifiable. Unassessed
//      areas drop out and the remaining weights are renormalised, so a custom-interface user
//      with otherwise strong answers still scores high, with "3 of 4 areas assessed".
//   4. Strong conventional automation is not automatically "agent-ready" (see AUTOMATION_SCORES):
//      the curve peaks at "highly automated", dips for "fully automated" (little left for an
//      agent to add) and is low for "mostly manual" (no programmatic foothold yet).
//   5. Within a multi-select area the value is BEST_PATH_WEIGHT * best + (1 - BEST_PATH_WEIGHT) *
//      average of the classifiable selections: one good path matters most, but a weak link
//      still drags the area down.
//   6. Integer percentages only; rounding happens once, at the very end.
// ---------------------------------------------------------------------------------------------

export const SCORING_VERSION = 'v1';
export const AREA_IDS = ['interfaces', 'tools', 'bottlenecks', 'automation'];

export const AREA_WEIGHTS = {
  interfaces: 0.35,
  tools: 0.2,
  bottlenecks: 0.2,
  automation: 0.25,
};

export const BEST_PATH_WEIGHT = 0.6;

// How reachable the system under test is for an agent through this interface.
export const INTERFACE_SCORES = {
  peak_pcan: 90,       // Linux SocketCAN -- native today
  kvaser_ixxat: 88,    // Linux SocketCAN for the CAN path -- native today
  ethernet_doip: 85,   // plain IP reachability, no extra dongle
  ros2_dds: 90,        // DDS / ROS 2 is a first-class transport
  etas: 75,            // only a Linux-supported subset of ES5xx is native
  vector: 40,          // Windows-oriented vendor stack -- integration needed
  dspace_ni: 35,       // closed vendor stacks / HIL runtime -- integration project
};

// How scriptable the tool is from outside its own GUI (can an agent drive it headlessly?).
export const TOOL_SCORES = {
  python_scripts: 95,
  matlab_simulink: 65,
  carmaker: 60,
  ecu_test: 60,
  capl: 55,
  veristand_labview: 50,
  canoe_canalyzer: 50,
  inca: 45,
  controldesk: 45,
};

// How much agent-addressable value sits behind each time sink.
export const BOTTLENECK_SCORES = {
  failure_investigation: 90,
  data_analysis: 85,
  repetitive_runs: 85,
  automation_upkeep: 80,
  manual_bench: 80,
  setup: 75,
  reporting: 65,
};

// Not monotonic on purpose -- see rule 4.
export const AUTOMATION_SCORES = {
  manual: 35,
  partial: 65,
  high: 80,
  full: 70,
  varies: 55, // heterogeneous benches: assessable, but a middling signal
};

const MULTI_TABLES = {
  interfaces: INTERFACE_SCORES,
  tools: TOOL_SCORES,
  bottlenecks: BOTTLENECK_SCORES,
};

const average = (values) => values.reduce((sum, v) => sum + v, 0) / values.length;
const blend = (values) => BEST_PATH_WEIGHT * Math.max(...values) + (1 - BEST_PATH_WEIGHT) * average(values);

const scoreMultiArea = (areaId, selected = []) => {
  const table = MULTI_TABLES[areaId];
  const known = selected.filter((id) => id !== OTHER_ID && id in table);
  // An id that is neither "other" nor in the table is also treated as unknown, never as zero.
  const hasUnknown = selected.some((id) => id === OTHER_ID || !(id in table));
  return {
    score: known.length ? blend(known.map((id) => table[id])) : null,
    hasUnknown,
  };
};

const scoreAutomationArea = (level) => ({
  score: level in AUTOMATION_SCORES ? AUTOMATION_SCORES[level] : null,
  hasUnknown: !(level in AUTOMATION_SCORES),
});

export const SCORE_BANDS = [
  {
    id: 'strong',
    min: 75,
    interpretation: 'Your bench already has the access points an AI agent needs. The open question is which workflow to hand it first.',
  },
  {
    id: 'foundation',
    min: 55,
    interpretation: 'You already have a strong automation foundation, but parts of your workflow still depend heavily on engineer interaction.',
  },
  {
    id: 'potential',
    min: 35,
    interpretation: 'There is real potential here, but today much of your bench is reached through manual steps or closed tooling.',
  },
  {
    id: 'early',
    min: 0,
    interpretation: 'Your bench is mostly operated by hand today, so the first gains will come from making it reachable by software.',
  },
];

export const getBand = (score) => SCORE_BANDS.find((band) => score >= band.min);

// What we say when part of the bench could not be classified. Keyed by area; phrased so it
// reads as "our model has a gap", never "your hardware is unsupported".
const UNASSESSED_NOTES = {
  interfaces: 'your custom interface',
  tools: 'your custom tooling',
  bottlenecks: 'the time sink you described',
  automation: 'your automation level',
};

export const scoreAssessment = (answers) => {
  const areas = {
    interfaces: scoreMultiArea('interfaces', answers.interfaces),
    tools: scoreMultiArea('tools', answers.tools),
    bottlenecks: scoreMultiArea('bottlenecks', answers.bottlenecks),
    automation: scoreAutomationArea(answers.automation),
  };

  const assessedIds = AREA_IDS.filter((id) => areas[id].score !== null);
  const totalWeight = assessedIds.reduce((sum, id) => sum + AREA_WEIGHTS[id], 0);
  const weighted = assessedIds.reduce((sum, id) => sum + areas[id].score * AREA_WEIGHTS[id], 0);

  // `score` is null only if literally nothing was classifiable; the UI never reaches that
  // state (automation is a single-select with no unknown option) but the maths stays safe.
  const score = totalWeight > 0 ? Math.round(weighted / totalWeight) : null;

  const unknownAreaIds = AREA_IDS.filter((id) => areas[id].hasUnknown);
  const assessedCount = assessedIds.length;
  const confidence = assessedCount === AREA_IDS.length ? 'high' : assessedCount === 3 ? 'medium' : 'low';

  return {
    version: SCORING_VERSION,
    score,
    band: score === null ? null : getBand(score).id,
    interpretation: score === null ? '' : getBand(score).interpretation,
    assessedAreas: assessedCount,
    totalAreas: AREA_IDS.length,
    confidence,
    areas: Object.fromEntries(AREA_IDS.map((id) => [id, {
      score: areas[id].score === null ? null : Math.round(areas[id].score),
      assessed: areas[id].score !== null,
      hasUnknown: areas[id].hasUnknown,
    }])),
    unknownAreaIds,
    // Only shown when something genuinely could not be assessed.
    coverageNote: unknownAreaIds.length
      ? `We couldn’t fully assess ${unknownAreaIds.map((id) => UNASSESSED_NOTES[id]).join(' and ')}.`
      : '',
  };
};
