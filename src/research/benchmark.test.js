import { buildBenchmarkView, rankMetricRows, selectBenchmarkRows } from './content/benchmark';

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
