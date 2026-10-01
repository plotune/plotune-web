// Question content for the AI Test Readiness Assessment. Option `id`s are stable keys: the
// scoring tables (scoring.js) and analytics payloads (analytics.js) reference them, so rename
// a label freely but never an id without updating both.
//
// Hick's Law: every question is one conceptual decision, <= 10 short options, and the
// order inside a question puts the most common answer first and "Other" always last.

export const OTHER_ID = 'other';
export const ASSESSMENT_VERSION = 'v1';
export const QUESTION_COUNT = 4;

export const QUESTIONS = [
  {
    id: 'interfaces',
    title: 'How does your test bench connect to the system under test?',
    subtitle: 'Select all that apply.',
    type: 'multi',
    layout: 'grid',
    options: [
      { id: 'serial_uart', label: 'Serial / UART / RS-485' },
      { id: 'ros2_dds', label: 'ROS 2 / DDS' },
      { id: 'peak_pcan', label: 'PEAK / PCAN' },
      { id: 'kvaser_ixxat', label: 'Kvaser / IXXAT' },
      { id: 'vector', label: 'Vector' },
      { id: 'etas', label: 'ETAS' },
      { id: 'dspace_ni', label: 'dSPACE / NI' },
      { id: 'ethernet_doip', label: 'Ethernet / DoIP' },
      { id: OTHER_ID, label: 'Other / Custom hardware' },
    ],
    other: {
      label: 'What interface or hardware do you use?',
      placeholder: 'e.g. custom UART device',
      hint: 'Custom UART device, proprietary CAN interface, serial controller…',
    },
  },
  {
    id: 'tools',
    title: 'Which tools are part of your test workflow?',
    subtitle: 'Select all that apply.',
    type: 'multi',
    layout: 'grid',
    options: [
      { id: 'canoe_canalyzer', label: 'CANoe / CANalyzer' },
      { id: 'inca', label: 'INCA' },
      { id: 'ecu_test', label: 'ECU-TEST' },
      { id: 'controldesk', label: 'ControlDesk' },
      { id: 'veristand_labview', label: 'NI VeriStand / LabVIEW' },
      { id: 'carmaker', label: 'IPG CarMaker' },
      { id: 'matlab_simulink', label: 'MATLAB / Simulink' },
      { id: 'python_scripts', label: 'Python / custom scripts' },
      // CAPL is its own option on purpose: "partially automated" alone hides *how* a bench is
      // automated (a CAPL-driven bench and a Python-driven one are very different starting points).
      { id: 'capl', label: 'CAPL' },
      { id: OTHER_ID, label: 'Other' },
    ],
    other: {
      label: 'Which other tools do you use?',
      placeholder: 'e.g. in-house test runner',
      hint: 'An in-house test runner, a vendor tool not listed here…',
    },
  },
  {
    id: 'bottlenecks',
    title: 'Where does your team spend the most engineering time?',
    subtitle: 'Select up to 2.',
    type: 'multi',
    max: 2,
    layout: 'list',
    options: [
      { id: 'setup', label: 'Setting up and configuring tests' },
      { id: 'repetitive_runs', label: 'Running repetitive test sequences' },
      { id: 'failure_investigation', label: 'Investigating failed tests and unexpected behavior' },
      { id: 'data_analysis', label: 'Analyzing measurement data and signals' },
      { id: 'reporting', label: 'Preparing reports and documenting results' },
      { id: 'manual_bench', label: 'Manually controlling or interacting with the test bench' },
      { id: 'automation_upkeep', label: 'Developing and maintaining test automation/scripts' },
      { id: OTHER_ID, label: 'Other' },
    ],
    other: {
      label: 'What else takes your team’s time?',
      placeholder: 'e.g. coordinating bench access',
      hint: 'Anything not covered by the options above.',
    },
  },
  {
    id: 'automation',
    title: 'How automated is your test bench today?',
    subtitle: 'Choose the closest match.',
    type: 'single',
    layout: 'list',
    options: [
      { id: 'manual', label: 'Mostly manual', description: 'Engineers directly operate most of the test process.' },
      { id: 'partial', label: 'Partially automated', description: 'Some sequences are automated, but engineers frequently intervene.' },
      { id: 'high', label: 'Highly automated', description: 'Most tests run automatically, but engineers handle decisions, exceptions, and analysis.' },
      { id: 'full', label: 'Fully automated', description: 'Execution, data collection, and reporting are largely automated end-to-end.' },
      { id: 'varies', label: 'It varies significantly between test setups.' },
    ],
  },
];

export const EMPTY_ANSWERS = {
  interfaces: [],
  tools: [],
  bottlenecks: [],
  automation: null,
  otherText: { interfaces: '', tools: '', bottlenecks: '' },
};

// A question counts as answered once it has at least one selection. "Other" with no text is a
// valid answer (the free text is always optional).
export const isAnswered = (question, answers) => {
  const value = answers[question.id];
  return question.type === 'single' ? Boolean(value) : Array.isArray(value) && value.length > 0;
};
