import demoData from './finalBenchmarkData.json';
import { buildBenchmarkView, buildScatterChart } from './benchmark';

const chartColors = ['#c65d1e', '#1f2937', '#6d28d9'];
const providerColors = {
  Anthropic: '#c65d1e', OpenAI: '#1f2937', 'Z.ai': '#6d28d9', Qwen: '#1d5db8',
  MoonshotAI: '#0f5b78', DeepSeek: '#4555c7', NVIDIA: '#5a860b', opencode: '#475569',
};
const providerFromModel = (modelName) => modelName.split(': ')[0];
const modelColor = (modelName) => providerColors[providerFromModel(modelName)] || '#64748b';
const modelLabel = (modelName) => modelName.replace(/^.*?: /, '');
const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const reportLabels = {
  'Qwen: Qwen3 Coder 480B A35B': 'Qwen · Qwen3 Coder',
  'MoonshotAI: Kimi K2.7 Code': 'Moonshot · Kimi K2.7',
  'NVIDIA: Nemotron 3 Ultra': 'NVIDIA · Nemotron 3',
  'opencode: big-pickle': 'opencode · big-pickle',
};
const reportModelLabel = (modelName) => reportLabels[modelName] || `${providerFromModel(modelName)} · ${modelLabel(modelName)}`;
const rankingColor = modelColor;
const recommendationLabels = {
  'Anthropic: Sonnet 5': 'Sonnet 5',
  'OpenAI: GPT-5.6 Terra': 'GPT-5.6 Terra',
  'Z.ai: GLM 5.3 Flash': 'GLM 5.3 Flash',
};

export const buildModelComparisonChart = () => ({
  data: demoData.models.slice(0, 3).map((model, index) => ({
    type: 'bar', name: model.name, x: demoData.tasks, y: model.scores, marker: { color: chartColors[index] },
    hovertemplate: '%{x}<br>%{fullData.name}: %{y}/100<extra></extra>',
  })),
  layout: { barmode: 'group', margin: { l: 48, r: 20, t: 24, b: 98 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: '#fbfcfe', font: { family: 'Inter, sans-serif', color: '#334155' }, yaxis: { range: [0, 100], title: 'Validation index', gridcolor: '#e2e8f0', zeroline: false }, xaxis: { tickangle: -24 }, legend: { orientation: 'h', y: -0.36 }, hoverlabel: { bgcolor: '#0f172a', font: { color: '#ffffff' } } },
  config: { responsive: true, displaylogo: false, displayModeBar: false },
  summary: 'Three final benchmark models are compared across six engineering workflow categories.',
  fallbackLabel: 'Grouped comparison across six final benchmark workflow categories.',
});

export const buildMonthlyBenchmarkCharts = () => {
  const recommendationModels = [
    'Anthropic: Sonnet 5',
    'OpenAI: GPT-5.6 Terra',
    'Z.ai: GLM 5.3 Flash',
  ];
  const categoryCharts = Object.fromEntries(demoData.tasks.map((task, taskIndex) => {
    const rows = demoData.models.map((model) => ({ ...model, score: model.scores[taskIndex] })).sort((left, right) => left.score - right.score);
    return [task, {
      data: [{
        type: 'bar', orientation: 'h',
        x: rows.map((row) => row.score), y: rows.map((row) => reportModelLabel(row.name)),
        text: rows.map((row) => `${row.score.toFixed(1)}`), textposition: 'auto',
        hovertemplate: '%{y}<br>Validation index: %{x:.1f}<extra></extra>',
        marker: { color: rows.map((row) => rankingColor(row.name)) },
      }],
      layout: {
        margin: { l: 190, r: 42, t: 16, b: 48 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: '#fbfcfe',
        font: { family: 'Inter, sans-serif', color: '#334155', size: 12 },
        xaxis: { range: [0, 100], title: 'Validation index', gridcolor: '#e2e8f0', zeroline: false },
        yaxis: { automargin: true }, hoverlabel: { bgcolor: '#0f172a', font: { color: '#ffffff' } },
      },
      config: { responsive: true, displaylogo: false, displayModeBar: false },
      height: 420,
      summary: `All 13 final benchmark models ranked for ${task}.`,
      fallbackLabel: `Final model ranking for ${task}.`,
    }];
  }));

  const overall = demoData.models
    .map((model) => ({ ...model, score: Number(average(model.scores).toFixed(1)) }))
    .sort((left, right) => right.score - left.score);
  const overviewRows = [...overall].reverse();

  return {
    overviewMatrix: {
      data: [{
        type: 'bar', orientation: 'h',
        x: overviewRows.map((row) => row.score), y: overviewRows.map((row) => reportModelLabel(row.name)),
        text: overviewRows.map((row) => row.score.toFixed(1)), textposition: 'auto',
        marker: { color: overviewRows.map((row) => rankingColor(row.name)) },
        hovertemplate: '%{y}<br>Category-normalized index: %{x:.1f}<extra></extra>',
      }],
      layout: {
        margin: { l: 190, r: 42, t: 16, b: 48 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: '#fbfcfe',
        font: { family: 'Inter, sans-serif', color: '#334155', size: 12 },
        xaxis: { range: [0, 100], title: 'Category-normalized validation index', gridcolor: '#e2e8f0', zeroline: false },
        yaxis: { automargin: true }, hoverlabel: { bgcolor: '#0f172a', font: { color: '#ffffff' } },
      },
      config: { responsive: true, displaylogo: false, displayModeBar: false },
      height: 440,
      summary: 'All 13 models ranked by category-normalized final validation index, using recognizable provider colors and labels.',
      fallbackLabel: 'Category-normalized final benchmark ranking for all 13 models.',
    },
    operatingTradeoff: buildScatterChart(buildBenchmarkView().rows, 'cost', 'performance'),
    recommendationProfile: {
      data: recommendationModels.map((name) => {
        const model = demoData.models.find((candidate) => candidate.name === name);
        return {
          type: 'bar', orientation: 'h', name: recommendationLabels[model.name],
          x: model.scores, y: demoData.tasks, marker: { color: rankingColor(model.name) },
          hovertemplate: `%{y}<br>${model.name}: %{x:.1f}<extra></extra>`,
        };
      }),
      layout: {
        barmode: 'group', margin: { l: 190, r: 36, t: 54, b: 48 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: '#fbfcfe',
        font: { family: 'Inter, sans-serif', color: '#334155', size: 12 },
        xaxis: { range: [0, 100], title: 'Validation index', gridcolor: '#e2e8f0', zeroline: false }, yaxis: { automargin: true, autorange: 'reversed' },
        legend: { orientation: 'h', y: 1.18, x: 0, font: { size: 11 } }, hoverlabel: { bgcolor: '#0f172a', font: { color: '#ffffff' } },
      },
      config: { responsive: true, displaylogo: false, displayModeBar: false },
      height: 400,
      summary: 'Recommended Anthropic, OpenAI, and low-cost candidates compared across the six final benchmark categories.',
      fallbackLabel: 'Recommended deployment candidates across six final benchmark categories.',
    },
    categoryCharts,
    overall,
  };
};

export { demoData };
