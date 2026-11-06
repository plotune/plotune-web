import { NOT_SURE_ID, OTHER_ID, QUESTIONS } from './questions';

// ---------------------------------------------------------------------------------------------
// Lead quality -- a rough, deterministic estimate of whether a completed assessment came from a
// person who actually read the questions. It decides two things:
//
//   1. showEmailCapture -- from the answers and answer timing only (known before the result
//      screen). Clearly careless runs see their score but no email form.
//   2. countsAsAdConversion -- answers + timing + the email address. Only these leads are reported
//      to Google Ads, so bidding learns from people who might be customers, not from accidental taps.
//
// The score starts at 100 and each signal subtracts points. Signals are heuristics tuned on the
// leads collected so far; tune the numbers here, tests lock the rules. Nothing here blocks a
// visitor from finishing, and every submission still reaches the lead sheet with its flags.
// ---------------------------------------------------------------------------------------------

export const LEAD_QUALITY_VERSION = 'v1';
export const EMAIL_CAPTURE_MIN = 50;
export const AD_CONVERSION_MIN = 70;

export const PENALTIES = {
  first_options: 60,   // first option on every multi-select screen: tapping through
  select_all: 60,      // (nearly) every option ticked on Q1 or Q2: no real bench uses all of them
  empty_other: 40,     // "Other" as the only answer on 2+ screens, or a junk "Other" text ("H")
  too_fast: 60,        // Q2 + Q3 (two multi-select screens + Continue) in under 4 s
  fast: 25,            // ... in under 6 s
  placeholder_email: 60,
  gibberish_email: 30,
  non_ascii_email: 20,
  free_email: 15,
};

const MULTI_IDS = ['interfaces', 'tools', 'bottlenecks'];
const SELECT_ALL_MIN = 8;

const PLACEHOLDER_DOMAINS = new Set([
  'company.com', 'example.com', 'example.org', 'example.net', 'test.com', 'domain.com',
  'email.com', 'mycompany.com', 'yourcompany.com', 'sample.com', 'abc.com', 'asd.com',
]);

const FREE_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'hotmail.com', 'hotmail.com.tr', 'outlook.com', 'outlook.com.tr',
  'live.com', 'msn.com', 'yahoo.com', 'yahoo.com.tr', 'icloud.com', 'me.com', 'aol.com',
  'yandex.com', 'yandex.ru', 'yandex.com.tr', 'mail.ru', 'gmx.com', 'gmx.de', 'web.de',
  'proton.me', 'protonmail.com',
]);

const firstOptionId = (questionId) => QUESTIONS.find((q) => q.id === questionId).options[0].id;

const isOnlyOther = (list) => Array.isArray(list) && list.length === 1 && list[0] === OTHER_ID;

// A typed "Other" text with fewer than 3 letters/digits ("H", "-", "..").
const isJunkText = (text) => {
  const trimmed = (text || '').trim();
  return trimmed.length > 0 && trimmed.replace(/[^\p{L}\p{N}]/gu, '').length < 3;
};

export const answerSignals = (answers, stepSeconds = {}) => {
  const flags = [];

  if (MULTI_IDS.every((id) => answers[id].length === 1 && answers[id][0] === firstOptionId(id))) {
    flags.push('first_options');
  }

  const realCount = (list) => list.filter((id) => id !== NOT_SURE_ID).length;
  if (realCount(answers.interfaces) >= SELECT_ALL_MIN || realCount(answers.tools) >= SELECT_ALL_MIN) {
    flags.push('select_all');
  }

  const onlyOther = MULTI_IDS.filter((id) => isOnlyOther(answers[id])).length;
  const junkText = MULTI_IDS.some((id) => isJunkText(answers.otherText[id]));
  if (onlyOther >= 2 || junkText) flags.push('empty_other');

  // Unknown timing (e.g. restored after a reload) is neutral, never a penalty.
  const q2 = stepSeconds.tools;
  const q3 = stepSeconds.bottlenecks;
  if (Number.isFinite(q2) && Number.isFinite(q3)) {
    if (q2 + q3 < 4) flags.push('too_fast');
    else if (q2 + q3 < 6) flags.push('fast');
  }

  return flags;
};

export const emailSignals = (email) => {
  const value = (email || '').trim();
  const at = value.lastIndexOf('@');
  if (at < 1) return [];
  const local = value.slice(0, at).toLowerCase();
  const domain = value.slice(at + 1).toLowerCase();
  const flags = [];

  if (PLACEHOLDER_DOMAINS.has(domain)) flags.push('placeholder_email');
  // A phone number or a keyboard mash as the address: 6+ digits in a row, or 6+ consonants in a row
  // inside one name part (real names stay below that: "schm", "szcz").
  if (/\d{6,}/.test(local) || /[bcdfghjklmnpqrstvwxz]{6,}/.test(local)) {
    flags.push('gibberish_email');
  }
  // eslint-disable-next-line no-control-regex
  if (/[^\x00-\x7F]/.test(value)) flags.push('non_ascii_email');
  if (FREE_DOMAINS.has(domain)) flags.push('free_email');
  return flags;
};

const scoreFlags = (flags) => Math.max(0, 100 - flags.reduce((sum, flag) => sum + (PENALTIES[flag] || 0), 0));

// Before the email is known: decides whether the result screen offers the email form.
export const assessAnswers = (answers, stepSeconds) => {
  const flags = answerSignals(answers, stepSeconds);
  const score = scoreFlags(flags);
  return { score, flags, showEmailCapture: score >= EMAIL_CAPTURE_MIN };
};

// At submit time: the full estimate, sent with the lead and used to gate the ad conversion.
export const assessLead = (answers, stepSeconds, email) => {
  const flags = [...answerSignals(answers, stepSeconds), ...emailSignals(email)];
  const score = scoreFlags(flags);
  return { score, flags, countsAsAdConversion: score >= AD_CONVERSION_MIN, version: LEAD_QUALITY_VERSION };
};
