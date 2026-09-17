import demoData from './agenticValidationDemo.json';

export const buildModelComparisonChart = () => ({
  data: demoData.models.slice(0, 3).map((model) => ({
    type: 'bar', name: model.name, x: demoData.tasks, y: model.scores, marker: { color: model.color },
    hovertemplate: '%{x}<br>%{fullData.name}: %{y}/100<extra></extra>',
  })),
  layout: { barmode: 'group', margin: { l: 48, r: 20, t: 24, b: 98 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: '#fbfcfe', font: { family: 'Inter, sans-serif', color: '#334155' }, yaxis: { range: [0, 100], title: 'Illustrative score', gridcolor: '#e2e8f0', zeroline: false }, xaxis: { tickangle: -24 }, legend: { orientation: 'h', y: -0.36 }, hoverlabel: { bgcolor: '#0f172a', font: { color: '#ffffff' } } },
  config: { responsive: true, displaylogo: false },
  summary: 'Three illustrative preview models are compared across seven Nexus-relevant engineering workflows.',
  fallbackLabel: 'Grouped comparison across seven illustrative engineering workflows.',
});

export { demoData };
