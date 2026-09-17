import { demoData } from './charts';

const operational = {
  'Atlas Reasoner': { cost: 0.12, time: 2.8, reliability: 99.1 },
  'Vector Agent': { cost: 0.08, time: 2.1, reliability: 98.2 },
  'Summit Code': { cost: 0.15, time: 2.4, reliability: 97.6 },
};

const metricDefinitions = {
  performance: { label: 'Performance', key: 'score', suffix: '', higher: true },
  cost: { label: 'Cost', key: 'cost', suffix: '$ / task', higher: false },
  latency: { label: 'Latency', key: 'time', suffix: 'min / task', higher: false },
  reliability: { label: 'Reliability', key: 'reliability', suffix: '%', higher: true },
};

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
  const taskIndex = demoData.tasks.indexOf(taskGroup);
  const rows = demoData.models.map((model) => {
    const score = taskIndex >= 0 ? model.scores[taskIndex] : average(model.scores);
    const [provider, ...modelParts] = model.name.split(': ');
    return {
      model: model.name,
      provider,
      modelName: modelParts.join(': '),
      color: model.color,
      scores: model.scores,
      score: Number(score.toFixed(1)),
      taskScore: taskIndex >= 0 ? model.scores[taskIndex] : null,
      ...(operational[model.name] || {
        cost: Number((0.025 + (model.scores[0] % 7) * 0.018).toFixed(3)),
        time: Number((1.4 + (model.scores[1] % 7) * 0.32).toFixed(1)),
        reliability: Number((94 + (model.scores[2] % 6) * 0.8).toFixed(1)),
      }),
    };
  });
  const metricConfig = metricDefinitions[metric] || metricDefinitions.performance;
  const sortConfig = metricDefinitions[sort] || metricConfig;
  rows.sort((a, b) => sortConfig.higher ? b[sortConfig.key] - a[sortConfig.key] : a[sortConfig.key] - b[sortConfig.key]);

  return {
    id: 'agentic-validation-v0-1',
    name: 'Agentic Test & Validation',
    version: 'v0.1',
    updatedAt: '17 Sep 2026',
    isPreview: true,
    taskGroup,
    taskGroups: ['All tasks', ...demoData.tasks],
    providers: [...new Set(rows.map((row) => row.provider))].sort(),
    metric: metricConfig,
    rows: rows.map((row, index) => ({ ...row, rank: index + 1 })),
    pareto: rows.filter((row) => !rows.some((other) => other.model !== row.model && other.cost <= row.cost && other.score >= row.score && (other.cost < row.cost || other.score > row.score))),
    matrix: demoData.models.map((model) => ({ model: model.name, color: model.color, scores: model.scores })),
  };
};

export { metricDefinitions };
