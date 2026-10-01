import { scoreAssessment, AREA_IDS, INTERFACE_SCORES, TOOL_SCORES, BOTTLENECK_SCORES, AUTOMATION_SCORES } from './scoring';
import { EMPTY_ANSWERS, QUESTIONS, OTHER_ID } from './questions';

const answers = (overrides = {}) => ({
  ...EMPTY_ANSWERS,
  interfaces: ['peak_pcan'],
  tools: ['python_scripts'],
  bottlenecks: ['failure_investigation'],
  automation: 'partial',
  ...overrides,
  otherText: { ...EMPTY_ANSWERS.otherText, ...(overrides.otherText || {}) },
});

test('is deterministic and an integer between 0 and 100', () => {
  const a = answers({ interfaces: ['peak_pcan', 'vector'], tools: ['canoe_canalyzer', 'capl'] });
  const first = scoreAssessment(a);
  expect(scoreAssessment(a)).toEqual(first);
  expect(Number.isInteger(first.score)).toBe(true);
  expect(first.score).toBeGreaterThanOrEqual(0);
  expect(first.score).toBeLessThanOrEqual(100);
});

test('every score table value is within 0-100 and every option id is scored or "other"', () => {
  [INTERFACE_SCORES, TOOL_SCORES, BOTTLENECK_SCORES, AUTOMATION_SCORES].forEach((table) => {
    Object.values(table).forEach((v) => { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(100); });
  });
  const tables = { interfaces: INTERFACE_SCORES, tools: TOOL_SCORES, bottlenecks: BOTTLENECK_SCORES, automation: AUTOMATION_SCORES };
  QUESTIONS.forEach((q) => q.options.forEach((o) => {
    if (o.id !== OTHER_ID) expect(tables[q.id]).toHaveProperty(o.id);
  }));
});

test('unknown "Other" is excluded, not penalised: custom interface alone leaves 3 of 4 areas assessed', () => {
  const withCustom = scoreAssessment(answers({ interfaces: [OTHER_ID] }));
  expect(withCustom.assessedAreas).toBe(3);
  expect(withCustom.areas.interfaces.assessed).toBe(false);
  expect(withCustom.confidence).toBe('medium');
  expect(withCustom.coverageNote).toMatch(/custom interface/);

  // The other three areas are strong, so the score must be strong -- not dragged to ~50%.
  const strongOnly = scoreAssessment(answers({ interfaces: ['peak_pcan'] }));
  expect(withCustom.score).toBeGreaterThanOrEqual(70);
  expect(Math.abs(withCustom.score - strongOnly.score)).toBeLessThanOrEqual(10);
});

test('adding "Other" next to a known selection never lowers the score', () => {
  const known = scoreAssessment(answers({ interfaces: ['peak_pcan'] }));
  const withOther = scoreAssessment(answers({ interfaces: ['peak_pcan', OTHER_ID] }));
  expect(withOther.score).toBe(known.score);
  expect(withOther.assessedAreas).toBe(4);
  expect(withOther.coverageNote).not.toBe('');
});

test('everything unknown except automation still yields a (low-confidence) score', () => {
  const r = scoreAssessment(answers({ interfaces: [OTHER_ID], tools: [OTHER_ID], bottlenecks: [OTHER_ID] }));
  expect(r.assessedAreas).toBe(1);
  expect(r.confidence).toBe('low');
  expect(r.score).toBe(AUTOMATION_SCORES.partial);
});

test('closed vendor stacks score lower than Linux-native interfaces', () => {
  const open = scoreAssessment(answers({ interfaces: ['peak_pcan'] })).score;
  const closed = scoreAssessment(answers({ interfaces: ['dspace_ni'] })).score;
  expect(closed).toBeLessThan(open);
});

test('strong automation is not automatically the highest readiness', () => {
  const high = scoreAssessment(answers({ automation: 'high' })).areas.automation.score;
  const full = scoreAssessment(answers({ automation: 'full' })).areas.automation.score;
  const manual = scoreAssessment(answers({ automation: 'manual' })).areas.automation.score;
  expect(full).toBeLessThan(high);
  expect(manual).toBeLessThan(full);
});

test('score never reports false precision and carries a one-sentence interpretation', () => {
  const r = scoreAssessment(answers());
  expect(String(r.score)).toMatch(/^\d{1,3}$/);
  expect(r.interpretation.length).toBeGreaterThan(20);
  expect(r.coverageNote).toBe('');
  expect(AREA_IDS).toHaveLength(r.totalAreas);
});

test('Serial / UART / RS-485 is a native, high-accessibility interface and leads Q1, followed by ROS 2 / DDS', () => {
  expect(QUESTIONS[0].options.slice(0, 2).map((o) => o.id)).toEqual(['serial_uart', 'ros2_dds']);
  const serial = scoreAssessment(answers({ interfaces: ['serial_uart'] }));
  expect(serial.areas.interfaces.assessed).toBe(true);
  expect(serial.areas.interfaces.score).toBeGreaterThanOrEqual(85);
});
