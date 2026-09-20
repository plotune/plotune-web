import demoData from './finalBenchmarkData.json';

const chartColors = ['#d97706', '#4285f4', '#10a37f'];

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

export { demoData };
