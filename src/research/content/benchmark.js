import finalBenchmarkData from './finalBenchmarkData.json';

const metricDefinitions = {
  performance: { label: 'Performance', key: 'score', suffix: '', higher: true },
  cost: { label: 'Cost', key: 'cost', suffix: '$ / task', higher: false },
  latency: { label: 'Latency', key: 'time', suffix: 'min / task', higher: false },
};

// One color per provider (not per model) so the scatter chart's legend can double as a filter —
// clicking "Anthropic" in a Plotly legend hides/shows every Anthropic model's trace at once.
const providerColors = {
  Anthropic: '#d97706', OpenAI: '#10a37f', Google: '#4285f4', DeepSeek: '#7c3aed', Qwen: '#0891b2',
  Meta: '#2563eb', Mistral: '#111827', 'Z.ai': '#ef4444', Moonshot: '#f97316', Amazon: '#f59e0b',
  Cohere: '#7c2d12', Microsoft: '#0ea5e9', NVIDIA: '#76b900', IBM: '#1f70c1', MiniMax: '#fb7185',
  xAI: '#111111', Alibaba: '#ea580c',
};
const fallbackProviderColors = ['#0f766e', '#9333ea', '#0369a1', '#b91c1c', '#4d7c0f', '#a21caf'];
const getProviderColor = (provider) => providerColors[provider]
  || fallbackProviderColors[Math.abs([...provider].reduce((hash, char) => hash + char.charCodeAt(0), 0)) % fallbackProviderColors.length];

export const formatMetricValue = (value, metric) => metric === 'cost' ? `$${value.toFixed(3)}`
  : metric === 'latency' ? `${value.toFixed(1)} min`
  : value.toFixed(1);

const average = (values) => values.reduce((total, value) => total + value, 0) / values.length;

export const selectBenchmarkRows = (rows, selectedModels = []) => rows
  .filter((row) => selectedModels.includes(row.model))
  .sort((left, right) => selectedModels.indexOf(left.model) - selectedModels.indexOf(right.model));

export const rankMetricRows = (rows, metric = 'performance', limit = 12) => {
  const config = metricDefinitions[metric] || metricDefinitions.performance;
  return [...rows]
    .sort((left, right) => config.higher ? right[config.key] - left[config.key] : left[config.key] - right[config.key])
    .slice(0, limit);
};

export const buildBenchmarkView = ({ taskGroup = 'All tasks', metric = 'performance', sort } = {}) => {
  const taskIndex = finalBenchmarkData.tasks.indexOf(taskGroup);
  const rows = finalBenchmarkData.models.map((model) => {
    const score = taskIndex >= 0 ? model.scores[taskIndex] : average(model.scores);
    const [provider, ...modelParts] = model.name.split(': ');
    return {
      model: model.name,
      provider,
      modelName: modelParts.join(': '),
      color: getProviderColor(provider),
      providerColor: getProviderColor(provider),
      scores: model.scores,
      score: Number(score.toFixed(1)),
      taskScore: taskIndex >= 0 ? model.scores[taskIndex] : null,
      cost: model.cost,
      time: model.time,
    };
  });
  const metricConfig = metricDefinitions[metric] || metricDefinitions.performance;
  const sortConfig = metricDefinitions[sort] || metricConfig;
  rows.sort((a, b) => sortConfig.higher ? b[sortConfig.key] - a[sortConfig.key] : a[sortConfig.key] - b[sortConfig.key]);

  return {
    id: 'agentic-validation-v1-0',
    name: 'Agentic Test & Validation',
    version: 'v1.0',
    updatedAt: '20 Sep 2026',
    isPreview: false,
    taskGroup,
    taskGroups: ['All tasks', ...finalBenchmarkData.tasks],
    providers: [...new Set(rows.map((row) => row.provider))].sort(),
    metric: metricConfig,
    rows: rows.map((row, index) => ({ ...row, rank: index + 1 })),
    pareto: rows.filter((row) => !rows.some((other) => other.model !== row.model && other.cost <= row.cost && other.score >= row.score && (other.cost < row.cost || other.score > row.score))),
    matrix: finalBenchmarkData.models.map((model) => ({ model: model.name, color: getProviderColor(model.name.split(': ')[0]), scores: model.scores })),
  };
};

// A row is on the frontier only if no other row is at least as good on both axes and strictly
// better on one — works for either axis being "higher is better" or "lower is better".
export const computeParetoFrontier = (rows, xConfig, yConfig) => rows
  .filter((row) => !rows.some((other) => {
    if (other.model === row.model) return false;
    const xAtLeastAsGood = xConfig.higher ? other[xConfig.key] >= row[xConfig.key] : other[xConfig.key] <= row[xConfig.key];
    const yAtLeastAsGood = yConfig.higher ? other[yConfig.key] >= row[yConfig.key] : other[yConfig.key] <= row[yConfig.key];
    const xStrictlyBetter = xConfig.higher ? other[xConfig.key] > row[xConfig.key] : other[xConfig.key] < row[xConfig.key];
    const yStrictlyBetter = yConfig.higher ? other[yConfig.key] > row[yConfig.key] : other[yConfig.key] < row[yConfig.key];
    return xAtLeastAsGood && yAtLeastAsGood && (xStrictlyBetter || yStrictlyBetter);
  }))
  .sort((a, b) => a[xConfig.key] - b[xConfig.key]);

// Builds a Plotly scatter chart (one trace per provider, so the legend doubles as a filter) with
// a Pareto-frontier line and a shaded "most attractive quadrant" — the pattern used across
// artificialanalysis.ai's per-metric comparisons.
export const buildScatterChart = (rows, xMetric, yMetric) => {
  const xConfig = metricDefinitions[xMetric];
  const yConfig = metricDefinitions[yMetric];
  const providers = [...new Set(rows.map((row) => row.provider))].sort();
  const data = providers.map((provider) => {
    const providerRows = rows.filter((row) => row.provider === provider);
    return {
      type: 'scatter', mode: 'markers', name: provider,
      x: providerRows.map((row) => row[xConfig.key]),
      y: providerRows.map((row) => row[yConfig.key]),
      text: providerRows.map((row) => `<b>${row.model}</b><br>${xConfig.label}: ${formatMetricValue(row[xConfig.key], xMetric)}<br>${yConfig.label}: ${formatMetricValue(row[yConfig.key], yMetric)}`),
      hovertemplate: '%{text}<extra></extra>',
      marker: { color: providerRows[0].providerColor, size: 11, line: { color: '#fff', width: 1 } },
    };
  });

  const frontier = computeParetoFrontier(rows, xConfig, yConfig);
  data.push({
    type: 'scatter', mode: 'lines', name: 'Pareto frontier', showlegend: false, hoverinfo: 'skip',
    x: frontier.map((row) => row[xConfig.key]), y: frontier.map((row) => row[yConfig.key]),
    line: { color: '#9aa3af', width: 1.5, dash: 'dot' },
  });

  const xValues = rows.map((row) => row[xConfig.key]);
  const yValues = rows.map((row) => row[yConfig.key]);
  const [xMin, xMax] = [Math.min(...xValues), Math.max(...xValues)];
  const [yMin, yMax] = [Math.min(...yValues), Math.max(...yValues)];
  const xPad = (xMax - xMin) * 0.08 || 1;
  const yPad = (yMax - yMin) * 0.08 || 1;
  const quadrantX = xConfig.higher ? [xMax - (xMax - xMin) * 0.35, xMax + xPad] : [xMin - xPad, xMin + (xMax - xMin) * 0.35];
  const quadrantY = yConfig.higher ? [yMax - (yMax - yMin) * 0.35, yMax + yPad] : [yMin - yPad, yMin + (yMax - yMin) * 0.35];

  return {
    data,
    layout: {
      margin: { l: 56, r: 20, t: 16, b: 48 },
      paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: '#fbfcfe',
      font: { family: 'Inter, sans-serif', color: '#334155', size: 12 },
      xaxis: { title: `${xConfig.label} (${xConfig.higher ? 'higher is better' : 'lower is better'})`, gridcolor: '#e2e8f0', range: [xMin - xPad, xMax + xPad] },
      yaxis: { title: `${yConfig.label} (${yConfig.higher ? 'higher is better' : 'lower is better'})`, gridcolor: '#e2e8f0', range: [yMin - yPad, yMax + yPad] },
      legend: { orientation: 'h', y: -0.22, font: { size: 11 } },
      hoverlabel: { bgcolor: '#0f172a', font: { color: '#ffffff' } },
      shapes: [{
        type: 'rect', xref: 'x', yref: 'y', x0: quadrantX[0], x1: quadrantX[1], y0: quadrantY[0], y1: quadrantY[1],
        fillcolor: '#dcfce7', opacity: 0.4, line: { width: 0 }, layer: 'below',
      }],
      annotations: [{
        x: (quadrantX[0] + quadrantX[1]) / 2, y: quadrantY[1],
        xref: 'x', yref: 'y', text: 'Most attractive quadrant', showarrow: false,
        font: { size: 10, color: '#166534' }, yanchor: 'bottom',
      }],
    },
    config: { responsive: true, displaylogo: false, displayModeBar: false },
  };
};

export { metricDefinitions };
