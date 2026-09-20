import { buildBenchmarkView, rankMetricRows, selectBenchmarkRows } from './content/benchmark';
import { buildMonthlyBenchmarkCharts } from './content/charts';

test('builds a final-data leaderboard from the matching workflow category', () => {
  const view = buildBenchmarkView({ taskGroup: 'Automated test flows', metric: 'performance', sort: 'score' });

  expect(view.rows).toHaveLength(13);
  expect(view.rows[0].score).toBeGreaterThanOrEqual(view.rows[1].score);
  expect(view.metric.label).toBe('Performance');
  expect(view.pareto.every((point) => view.rows.some((row) => row.model === point.model))).toBe(true);
  expect(view.isPreview).toBe(false);
});

test('sorts real task duration without changing the selected task group', () => {
  const view = buildBenchmarkView({ taskGroup: 'V-cycle', metric: 'latency', sort: 'latency' });

  expect(view.rows[0].time).toBeLessThanOrEqual(view.rows[1].time);
  expect(view.taskGroup).toBe('V-cycle');
});

test('uses exactly the categories and models present in the final benchmark', () => {
  const view = buildBenchmarkView();

  expect(view.rows).toHaveLength(13);
  expect(view.taskGroups).toEqual([
    'All tasks',
    'Industrial data analysis',
    'Automated test flows',
    'Calibration & software',
    'Real-time stream validation',
    'Safety & evidence',
    'V-cycle',
  ]);
});

test('derives a compact selected-model comparison from the visible research corpus', () => {
  const view = buildBenchmarkView();
  const selected = selectBenchmarkRows(view.rows, ['OpenAI: GPT-6 Astra', 'Anthropic: Fable 5.1']);

  expect(selected.map((row) => row.model)).toEqual(['OpenAI: GPT-6 Astra', 'Anthropic: Fable 5.1']);
  expect(selected[0].scores).toHaveLength(6);
  expect(selected[0]).toMatchObject({ score: 85.1, cost: 2.2599, time: 6.7 });
});

test('returns a readable chart cohort ordered for the selected metric', () => {
  const rows = buildBenchmarkView().rows;
  const fastest = rankMetricRows(rows, 'latency', 8);

  expect(fastest).toHaveLength(8);
  expect(fastest[0].time).toBeLessThanOrEqual(fastest[1].time);
  expect(fastest.every((row) => rows.includes(row))).toBe(true);
});

test('builds scannable benchmark report charts without label collisions', () => {
  const charts = buildMonthlyBenchmarkCharts();

  expect(Object.keys(charts.categoryCharts)).toEqual([
    'Industrial data analysis',
    'Automated test flows',
    'Calibration & software',
    'Real-time stream validation',
    'Safety & evidence',
    'V-cycle',
  ]);
  expect(charts.overviewMatrix.data).toHaveLength(1);
  expect(charts.overviewMatrix.data[0]).toMatchObject({ type: 'bar', orientation: 'h' });
  expect(charts.overviewMatrix.data[0].y).toContain('Anthropic · Fable 5.1');
  expect(charts.overviewMatrix.data[0].marker.color).toContain('#c65d1e');
  expect(charts.overviewMatrix.data[0].marker.color).toContain('#1f2937');
  expect(charts.overviewMatrix.data[0].marker.color).toContain('#5a860b');
  expect(charts.overviewMatrix.layout.yaxis.automargin).toBe(true);
  expect(charts.overviewMatrix.height).toBe(440);
  expect(charts.recommendationProfile.data.map((trace) => trace.name)).toEqual([
    'Sonnet 5',
    'GPT-5.6 Terra',
    'GLM 5.3 Flash',
  ]);
  expect(charts.recommendationProfile.data.every((trace) => trace.orientation === 'h')).toBe(true);
  expect(charts.recommendationProfile.layout.legend.y).toBeGreaterThan(1);
  expect(charts.recommendationProfile.layout.yaxis.autorange).toBe('reversed');
  expect(charts.recommendationProfile.height).toBe(400);
  expect(charts.categoryCharts['Industrial data analysis'].data[0].x).toHaveLength(13);
});
