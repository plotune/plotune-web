import { EMPTY_ANSWERS, OTHER_ID, QUESTIONS } from './questions';

// Keeps the visitor's progress in sessionStorage (this tab only; gone when the tab closes), so a
// reload doesn't wipe a half-finished assessment or a result they already got. That matters most
// for the main audience: phone visitors in the LinkedIn in-app browser, who routinely switch apps
// (e.g. to copy their work email) and come back to a reloaded page.
//
// Best effort only: private modes and in-app browsers may block storage, so every access is
// guarded and the page works the same without it. Restored data is re-validated against the
// current question set, so a stale or tampered entry can never put the UI in an impossible state.

const KEY = 'plotune_ai_readiness_v1';
const MAX_OTHER = 120;

const sanitizeAnswers = (raw) => {
  if (!raw || typeof raw !== 'object') return EMPTY_ANSWERS;
  const next = { ...EMPTY_ANSWERS, otherText: { ...EMPTY_ANSWERS.otherText } };
  QUESTIONS.forEach((q) => {
    const valid = new Set(q.options.map((o) => o.id));
    if (q.type === 'single') {
      next[q.id] = valid.has(raw[q.id]) ? raw[q.id] : null;
      return;
    }
    const list = Array.isArray(raw[q.id]) ? [...new Set(raw[q.id].filter((id) => valid.has(id)))] : [];
    next[q.id] = q.max ? list.slice(0, q.max) : list;
    const text = raw.otherText && typeof raw.otherText[q.id] === 'string' ? raw.otherText[q.id].slice(0, MAX_OTHER) : '';
    next.otherText[q.id] = next[q.id].includes(OTHER_ID) ? text : '';
  });
  return next;
};

const sanitizeSubmission = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  if (raw.delivery !== 'sent' && raw.delivery !== 'not_configured') return null;
  return { delivery: raw.delivery, email: typeof raw.email === 'string' ? raw.email.slice(0, 254) : '' };
};

export const loadProgress = () => {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { answers: sanitizeAnswers(parsed.answers), submission: sanitizeSubmission(parsed.submission) };
  } catch {
    return null;
  }
};

export const saveProgress = ({ answers, submission }) => {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify({ answers, submission }));
  } catch {
    // storage unavailable: progress simply isn't kept across reloads
  }
};

export const clearProgress = () => {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
};
