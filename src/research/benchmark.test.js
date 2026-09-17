import { buildBenchmarkView, rankMetricRows, selectBenchmarkRows } from './content/benchmark';

test('builds a filtered performance leaderboard and Pareto panel from the same model set', () => {
  const view = buildBenchmarkView({ taskGroup: 'Connecting test benches', metric: 'performance', sort: 'score' });

  expect(view.rows).toHaveLength(24);
  expect(view.rows[0].score).toBeGreaterThanOrEqual(view.rows[1].score);
  expect(view.metric.label).toBe('Performance');
  expect(view.pareto.every((point) => view.rows.some((row) => row.model === point.model))).toBe(true);
  expect(view.isPreview).toBe(true);
});

test('sorts reliability without changing the selected task group', () => {
  const view = buildBenchmarkView({ taskGroup: 'Diagnostics & root cause', metric: 'reliability', sort: 'reliability' });

  expect(view.rows[0].reliability).toBeGreaterThanOrEqual(view.rows[1].reliability);
  expect(view.taskGroup).toBe('Diagnostics & root cause');
});

test('exposes a representative preview corpus for Nexus-relevant workflows', () => {
  const view = buildBenchmarkView();

  expect(view.rows).toHaveLength(24);
  expect(view.taskGroups).toEqual(expect.arrayContaining([
    'Industrial data analysis',
    'Connecting test benches',
    'AI safety & evidence quality',
  ]));
});

test('derives a compact selected-model comparison from the visible research corpus', () => {
  const view = buildBenchmarkView();
  const selected = selectBenchmarkRows(view.rows, ['OpenAI: GPT-5.6', 'Anthropic: Claude Fable 5.1']);

  expect(selected.map((row) => row.model)).toEqual(['OpenAI: GPT-5.6', 'Anthropic: Claude Fable 5.1']);
  expect(selected[0].scores).toHaveLength(7);
});

test('returns a readable chart cohort ordered for the selected metric', () => {
  const rows = buildBenchmarkView().rows;
  const fastest = rankMetricRows(rows, 'latency', 8);

  expect(fastest).toHaveLength(8);
  expect(fastest[0].time).toBeLessThanOrEqual(fastest[1].time);
  expect(fastest.every((row) => rows.includes(row))).toBe(true);
});
