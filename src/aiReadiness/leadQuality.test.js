import { AD_CONVERSION_MIN, EMAIL_CAPTURE_MIN, assessAnswers, assessLead, emailSignals } from './leadQuality';
import { EMPTY_ANSWERS } from './questions';

const answers = (overrides = {}) => ({ ...EMPTY_ANSWERS, automation: 'partial', ...overrides, otherText: { ...EMPTY_ANSWERS.otherText, ...(overrides.otherText || {}) } });
const humanPace = { interfaces: 9, tools: 7, bottlenecks: 6, automation: 3 };
const typical = answers({ interfaces: ['peak_pcan'], tools: ['python_scripts', 'canoe_canalyzer'], bottlenecks: ['failure_investigation'] });

test('a considered answer set keeps the email form and counts as a conversion, even from a free mailbox', () => {
  expect(assessAnswers(typical, humanPace)).toMatchObject({ flags: [], showEmailCapture: true });
  expect(assessLead(typical, humanPace, 'eng@bosch.com')).toMatchObject({ score: 100, countsAsAdConversion: true });
  expect(assessLead(typical, humanPace, 'ayse.yilmaz@gmail.com')).toMatchObject({ flags: ['free_email'], countsAsAdConversion: true });
});

test('tapping the first option on every screen hides the email form', () => {
  const tapped = answers({ interfaces: ['serial_uart'], tools: ['canoe_canalyzer'], bottlenecks: ['setup'] });
  const q = assessAnswers(tapped, humanPace);
  expect(q.flags).toContain('first_options');
  expect(q.showEmailCapture).toBe(false);
});

test('ticking (nearly) every interface or tool hides the email form', () => {
  const all = answers({
    interfaces: ['serial_uart', 'ros2_dds', 'peak_pcan', 'kvaser_ixxat', 'vector', 'etas', 'dspace_ni', 'ethernet_doip'],
    tools: ['python_scripts'],
    bottlenecks: ['setup'],
  });
  expect(assessAnswers(all, humanPace)).toMatchObject({ showEmailCapture: false });
  expect(assessAnswers(all, humanPace).flags).toContain('select_all');
});

test('two multi-select screens in under 4 seconds hides the form; under 6 s only costs the conversion with a free mailbox', () => {
  expect(assessAnswers(typical, { tools: 1.8, bottlenecks: 1.3 })).toMatchObject({ flags: ['too_fast'], showEmailCapture: false });
  const fast = { tools: 2.5, bottlenecks: 2.4 };
  expect(assessAnswers(typical, fast)).toMatchObject({ flags: ['fast'], showEmailCapture: true });
  expect(assessLead(typical, fast, 'eng@bosch.com').countsAsAdConversion).toBe(true);
  expect(assessLead(typical, fast, 'eng@gmail.com').countsAsAdConversion).toBe(false);
});

test('unknown timing (restored after a reload) is neutral', () => {
  expect(assessAnswers(typical, {}).flags).toEqual([]);
});

test('"Other" everywhere or junk Other text is a signal; a real Other text is not', () => {
  expect(assessAnswers(answers({ interfaces: ['other'], tools: ['other'], bottlenecks: ['setup'] }), humanPace).flags).toContain('empty_other');
  expect(assessAnswers(answers({ interfaces: ['other'], tools: ['inca'], bottlenecks: ['setup'], otherText: { interfaces: 'H' } }), humanPace).flags).toContain('empty_other');
  expect(assessAnswers(answers({ interfaces: ['other'], tools: ['inca'], bottlenecks: ['setup'], otherText: { interfaces: 'Custom LIN box' } }), humanPace).flags).toEqual([]);
});

test('email signals: placeholder domains, phone numbers and keyboard mashes, non-ASCII, free mailboxes', () => {
  expect(emailSignals('nema@company.com')).toContain('placeholder_email');
  expect(emailSignals('05446426458a@gmail.com')).toContain('gibberish_email');
  expect(emailSignals('jgihfehihfehijhgfhhgf@gmail.com')).toContain('gibberish_email');
  expect(emailSignals('POLATANDARİMAN@gmail.com')).toContain('non_ascii_email');
  expect(emailSignals('veysel.k@gmail.com')).toEqual(['free_email']);
  expect(emailSignals('m.schmidt2@continental.com')).toEqual([]);
  expect(assessLead(typical, humanPace, 'nema@company.com').countsAsAdConversion).toBe(false);
});

test('thresholds stay ordered: anything that loses the form also loses the conversion', () => {
  expect(EMAIL_CAPTURE_MIN).toBeLessThan(AD_CONVERSION_MIN);
});
