import traceData from './decisionModelTraceData.json';

// Bit-exact tick-by-tick simulation data and real per-checkpoint decision records, exported
// directly from the plotune-agent-benchmarks repo's Python simulation and real (paid) run
// JSON -- not reimplemented or approximated here. See decisionModelTraceData.json.

const FONT = { family: 'Inter, sans-serif', color: '#334155', size: 11 };
const PLOT_BG = '#fbfcfe';
const GRID = '#e2e8f0';
const INK = '#1f2937';
const CATEGORICAL = ['#1f2937', '#c65d1e', '#6d28d9'];
const HOVERLABEL = { bgcolor: '#0f172a', font: { color: '#ffffff' } };

const OUTCOME_STYLE_GUARDRAIL = {
  TP: { color: '#15803d', symbol: 'circle', size: 10, label: 'caught the fault' },
  FP: { color: '#dc2626', symbol: 'triangle-up', size: 11, label: 'false alarm' },
  FN: { color: '#d97706', symbol: 'diamond', size: 10, label: 'missed it' },
  TN: { color: '#9ca3af', symbol: 'circle', size: 6, label: 'correctly quiet' },
};
const OUTCOME_STYLE_BATTERY = {
  EXACT: { color: '#15803d', symbol: 'circle', size: 10, label: 'exact match' },
  SAFE: { color: '#d97706', symbol: 'diamond', size: 10, label: 'over-cautious but safe' },
  UNSAFE: { color: '#dc2626', symbol: 'triangle-up', size: 11, label: 'unsafe' },
};

const guardrailOutcome = (truthFaulty, predictedFaulty) => {
  if (truthFaulty && predictedFaulty) return 'TP';
  if (!truthFaulty && predictedFaulty) return 'FP';
  if (truthFaulty && !predictedFaulty) return 'FN';
  return 'TN';
};

const MODE_LANE = { jev_escalation: 0, jev_always: 1, baseline_only: 2, baseline_literal: 2 };
const MODE_LABEL = {
  jev_escalation: 'Jev (escalation)', jev_always: 'Jev (always)',
  baseline_only: 'Baseline', baseline_literal: 'Baseline',
};
const STATUS_LANE_ORDER = ['baseline', 'jevAlways', 'jevEscalation'];

// Contiguous runs of `true` in a boolean array, as [startIndex, endIndex] pairs.
const contiguousWindows = (flags) => {
  const windows = [];
  let start = null;
  flags.forEach((flag, i) => {
    if (flag && start === null) start = i;
    if (!flag && start !== null) { windows.push([start, i - 1]); start = null; }
  });
  if (start !== null) windows.push([start, flags.length - 1]);
  return windows;
};

// Evenly divides [0,1] into `n` row domains (top to bottom, matching reading order) by
// relative `weights`, leaving a small gap between rows -- Plotly.js has no make_subplots
// convenience helper, so subplot rows are positioned by hand via explicit axis domains.
const rowDomains = (weights, gap = 0.02) => {
  const totalGap = gap * (weights.length - 1);
  const scale = (1 - totalGap) / weights.reduce((sum, w) => sum + w, 0);
  const domains = [];
  let top = 1;
  weights.forEach((w) => {
    const height = w * scale;
    domains.push([top - height, top]);
    top -= height + gap;
  });
  return domains;
};

const zoomedRange = (windowTicks, allTicks, pad = 15) => {
  const lastTick = allTicks[allTicks.length - 1];
  if (!windowTicks.length) return [allTicks[0], lastTick];
  return [Math.max(allTicks[0], Math.min(...windowTicks) - pad), Math.min(lastTick, Math.max(...windowTicks) + pad)];
};

const buildGuardrailChart = (scenarioName) => {
  const s = traceData.guardrail[scenarioName];
  const decisionsForScenario = traceData.guardrail_decisions.filter((r) => r.scenario === scenarioName);
  const windows = contiguousWindows(s.is_faulty_truth);
  const [topDomain, bottomDomain] = rowDomains([0.62, 0.38]);

  const data = [
    {
      type: 'scatter', mode: 'lines', x: s.ticks, y: s.sensor_reading, xaxis: 'x', yaxis: 'y',
      line: { color: '#2563d9', width: 1.5 }, hovertemplate: 'tick %{x}<br>reading %{y:.1f}<extra></extra>',
    },
    {
      type: 'scatter', mode: 'lines', x: s.ticks, y: s.ticks.map(() => s.setpoint), xaxis: 'x', yaxis: 'y',
      line: { color: '#94a3b8', width: 1, dash: 'dot' }, hoverinfo: 'skip',
    },
  ];

  ['baseline_only', 'jev_always', 'jev_escalation'].forEach((mode) => {
    const run = decisionsForScenario.find((r) => r.mode === mode);
    if (!run) return;
    const y0 = MODE_LANE[mode];
    run.decisions.forEach((d) => {
      const style = OUTCOME_STYLE_GUARDRAIL[guardrailOutcome(d.truth_faulty, d.predicted_faulty)];
      data.push({
        type: 'scatter', mode: 'markers', x: [d.tick], y: [y0], xaxis: 'x2', yaxis: 'y2', showlegend: false,
        marker: { color: style.color, symbol: style.symbol, size: style.size, line: { width: d.called_jev ? 2 : 0, color: INK } },
        hovertext: `${MODE_LABEL[mode]} @ tick ${d.tick}: ${style.label}${d.called_jev ? ' (real Jev call)' : ''}`,
        hoverinfo: 'text',
      });
    });
  });

  const shapes = windows.flatMap(([lo, hi]) => [
    { type: 'rect', xref: 'x', yref: 'paper', x0: lo - 0.5, x1: hi + 0.5, y0: topDomain[0], y1: topDomain[1], fillcolor: '#dc2626', opacity: 0.08, line: { width: 0 } },
    { type: 'rect', xref: 'x2', yref: 'paper', x0: lo - 0.5, x1: hi + 0.5, y0: bottomDomain[0], y1: bottomDomain[1], fillcolor: '#dc2626', opacity: 0.08, line: { width: 0 } },
  ]);

  const range = zoomedRange(windows.flat(), s.ticks);

  return {
    data,
    layout: {
      // fixedrange on every axis: these figures are pre-zoomed to the interesting window and
      // read only via hover, never explored by zoom/pan. Without it, a touch tap that a mobile
      // browser interprets as the start of a drag can rescale just the tapped subplot's axis
      // (they're positioned by hand, not through a shared-axes helper, so nothing keeps them
      // in step), visibly desyncing the sensor trace from the status lane beneath it.
      xaxis: { domain: [0, 1], anchor: 'y', range, showticklabels: false, gridcolor: GRID, fixedrange: true },
      yaxis: { domain: topDomain, anchor: 'x', title: { text: 'Reading', font: { size: 10 } }, gridcolor: GRID, color: '#334155', fixedrange: true },
      xaxis2: { domain: [0, 1], anchor: 'y2', range, matches: 'x', title: { text: 'tick', font: { size: 10 } }, gridcolor: GRID, color: '#334155', fixedrange: true },
      yaxis2: {
        domain: bottomDomain, anchor: 'x2', tickvals: [0, 1, 2], ticktext: ['Jev (escalation)', 'Jev (always)', 'Baseline'],
        range: [-0.7, 2.7], gridcolor: GRID, color: INK, fixedrange: true,
      },
      shapes, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: PLOT_BG, font: FONT, showlegend: false,
      margin: { l: 108, r: 16, t: 10, b: 34 }, hoverlabel: HOVERLABEL,
    },
    config: { responsive: true, displaylogo: false, displayModeBar: false },
    height: 360,
    summary: `${scenarioName.replace(/_/g, ' ')}: sensor reading over time with the ground-truth fault window shaded, and each strategy's call at every checkpoint below.`,
    fallbackLabel: `Time-series trace for the ${scenarioName.replace(/_/g, ' ')} sensor scenario.`,
  };
};

const BATTERY_PANELS = [
  ['pack_voltage', 'Voltage (V)'],
  ['pack_current', 'Current (A)'],
  ['soc', 'SOC (%)'],
  ['max_cell_temp', 'Temp (°C)'],
  ['min_cell_voltage', 'Min cell (V)'],
];

const batteryFaultWindows = (truths) => {
  const windows = contiguousWindows(truths.map((a) => a !== 'continue_normal'));
  return windows.map(([lo, hi]) => {
    const actionsInWindow = new Set(truths.slice(lo, hi + 1));
    const critical = ['reduce_discharge_current', 'reduce_charge_current', 'open_contactor'].some((a) => actionsInWindow.has(a));
    return [lo, hi, critical ? '#dc2626' : '#d97706'];
  });
};

const buildBatteryChart = (scenarioName) => {
  const s = traceData.battery[scenarioName];
  const decisionsForScenario = traceData.battery_decisions.filter((r) => r.scenario === scenarioName);
  const weights = [0.16, 0.16, 0.16, 0.16, 0.16, 0.2];
  const domains = rowDomains(weights);
  const [statusDomain] = domains.slice(-1);
  const windows = batteryFaultWindows(s.truth_action);

  const data = [];
  BATTERY_PANELS.forEach(([key, label], i) => {
    data.push({
      type: 'scatter', mode: 'lines', x: s.ticks, y: s[key], xaxis: i === 0 ? 'x' : `x${i + 1}`, yaxis: i === 0 ? 'y' : `y${i + 1}`,
      line: { color: CATEGORICAL[i % CATEGORICAL.length], width: 1.5 },
      hovertemplate: `tick %{x}<br>${label}: %{y:.1f}<extra></extra>`,
    });
  });

  ['baseline_literal', 'jev_always', 'jev_escalation'].forEach((mode) => {
    const run = decisionsForScenario.find((r) => r.mode === mode);
    if (!run) return;
    const y0 = MODE_LANE[mode];
    run.decisions.forEach((d) => {
      const style = OUTCOME_STYLE_BATTERY[d.outcome];
      data.push({
        type: 'scatter', mode: 'markers', x: [d.tick], y: [y0], xaxis: 'x6', yaxis: 'y6', showlegend: false,
        marker: { color: style.color, symbol: style.symbol, size: style.size, line: { width: d.called_jev ? 2 : 0, color: INK } },
        hovertext: `${MODE_LABEL[mode]} @ tick ${d.tick}: ${d.predicted_action} (truth: ${d.truth_action}, ${style.label})${d.called_jev ? ' [real Jev call]' : ''}`,
        hoverinfo: 'text',
      });
    });
  });

  const layout = {
    paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: PLOT_BG, font: FONT, showlegend: false,
    margin: { l: 108, r: 16, t: 10, b: 34 }, hoverlabel: HOVERLABEL,
  };
  // fixedrange + matches on every axis: see the guardrail chart's comment above -- with 6
  // independently-positioned subplot rows here, an unsynced touch-triggered zoom on any one
  // of them would be even more visibly broken than the 2-row guardrail case.
  const shapes = [];
  const range = zoomedRange(windows.map((w) => w[0]).concat(windows.map((w) => w[1])), s.ticks);
  BATTERY_PANELS.forEach(([, label], i) => {
    const axisNum = i === 0 ? '' : `${i + 1}`;
    layout[`xaxis${axisNum}`] = { domain: [0, 1], anchor: `y${axisNum}`, range, ...(i > 0 ? { matches: 'x' } : {}), showticklabels: false, gridcolor: GRID, fixedrange: true };
    layout[`yaxis${axisNum}`] = { domain: domains[i], anchor: `x${axisNum}`, title: { text: label, font: { size: 9 } }, gridcolor: GRID, color: '#334155', fixedrange: true };
    windows.forEach(([lo, hi, color]) => {
      shapes.push({ type: 'rect', xref: `x${axisNum}`, yref: 'paper', x0: lo - 0.5, x1: hi + 0.5, y0: domains[i][0], y1: domains[i][1], fillcolor: color, opacity: 0.08, line: { width: 0 } });
    });
  });
  layout.xaxis6 = { domain: [0, 1], anchor: 'y6', range, matches: 'x', title: { text: 'tick (s)', font: { size: 10 } }, gridcolor: GRID, color: '#334155', fixedrange: true };
  layout.yaxis6 = {
    domain: statusDomain, anchor: 'x6', tickvals: [0, 1, 2], ticktext: ['Jev (escalation)', 'Jev (always)', 'Baseline'],
    range: [-0.7, 2.7], gridcolor: GRID, color: INK, fixedrange: true,
  };
  windows.forEach(([lo, hi, color]) => {
    shapes.push({ type: 'rect', xref: 'x6', yref: 'paper', x0: lo - 0.5, x1: hi + 0.5, y0: statusDomain[0], y1: statusDomain[1], fillcolor: color, opacity: 0.08, line: { width: 0 } });
  });
  layout.shapes = shapes;

  return {
    data,
    layout,
    config: { responsive: true, displaylogo: false, displayModeBar: false },
    height: 720,
    summary: `${scenarioName.replace(/_/g, ' ')}: pack voltage, current, SOC, max cell temperature, and minimum cell voltage over time, with the ground-truth action window shaded, and each strategy's call at every checkpoint below.`,
    fallbackLabel: `Time-series trace for the ${scenarioName.replace(/_/g, ' ')} battery scenario.`,
  };
};

export const buildDecisionModelScenarioCharts = () => ({
  guardrail: Object.fromEntries(Object.keys(traceData.guardrail).map((name) => [name, buildGuardrailChart(name)])),
  battery: Object.fromEntries(Object.keys(traceData.battery).map((name) => [name, buildBatteryChart(name)])),
});
