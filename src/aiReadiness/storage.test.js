import { loadProgress, saveProgress, clearProgress } from './storage';
import { EMPTY_ANSWERS } from './questions';

afterEach(() => window.sessionStorage.clear());

test('round-trips answers and a sent submission', () => {
  const answers = { ...EMPTY_ANSWERS, interfaces: ['peak_pcan', 'other'], automation: 'partial', otherText: { ...EMPTY_ANSWERS.otherText, interfaces: 'UART rig' } };
  saveProgress({ answers, submission: { delivery: 'sent', email: 'a@b.co' } });
  const loaded = loadProgress();
  expect(loaded.answers.interfaces).toEqual(['peak_pcan', 'other']);
  expect(loaded.answers.otherText.interfaces).toBe('UART rig');
  expect(loaded.submission).toEqual({ delivery: 'sent', email: 'a@b.co' });
  clearProgress();
  expect(loadProgress()).toBeNull();
});

test('stale or tampered data is sanitised, never trusted', () => {
  window.sessionStorage.setItem('plotune_ai_readiness_v1', JSON.stringify({
    answers: {
      interfaces: ['peak_pcan', 'not_a_real_option', 'peak_pcan'],
      tools: 'python_scripts',
      bottlenecks: ['setup', 'reporting', 'data_analysis'],
      automation: 'hacked',
      otherText: { interfaces: 'x'.repeat(500), tools: 'orphan text without Other selected' },
    },
    submission: { delivery: 'error', email: 'a@b.co' },
  }));
  const { answers, submission } = loadProgress();
  expect(answers.interfaces).toEqual(['peak_pcan']);
  expect(answers.tools).toEqual([]);
  expect(answers.bottlenecks).toEqual(['setup', 'reporting']); // Q3 max 2 enforced
  expect(answers.automation).toBeNull();
  expect(answers.otherText.tools).toBe('');
  expect(submission).toBeNull(); // only sent / not_configured are restorable
});

test('corrupt JSON or blocked storage degrade to "nothing saved"', () => {
  window.sessionStorage.setItem('plotune_ai_readiness_v1', '{not json');
  expect(loadProgress()).toBeNull();
  const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  expect(loadProgress()).toBeNull();
  spy.mockRestore();
  const setSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
  expect(() => saveProgress({ answers: EMPTY_ANSWERS, submission: null })).not.toThrow();
  setSpy.mockRestore();
});
