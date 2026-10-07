// Suggests a fix for a mistyped email domain ("name@gmial.com" -> "name@gmail.com"), so a lead
// isn't lost to a typo we could have caught. Only well-known consumer and mail-provider domains
// are corrected; a company domain is never guessed at (we can't know it, and a wrong "fix" would
// be worse than none).
const KNOWN_DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'live.com', 'yandex.com'];
// Real providers that sit one or two letters from a known one ("mail.com" vs "gmail.com"): never
// "corrected".
const REAL_LOOKALIKES = ['mail.com', 'gmx.com', 'gmx.net', 'ymail.com', 'aol.com', 'msn.com', 'me.com', 'mac.com', 'hotmail.co.uk', 'yahoo.co.uk', 'outlook.de', 'hotmail.de', 'yandex.ru', 'mail.ru'];

// Common slips that edit distance alone wouldn't catch reliably (wrong or missing TLD).
const EXPLICIT = {
  'gmail.co': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.comm': 'gmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'outlook.co': 'outlook.com',
  'outlook.con': 'outlook.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'icloud.co': 'icloud.com',
};

// Optimal string alignment distance (Levenshtein plus adjacent swaps, so "gmial" is one edit).
const distance = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j += 1) d[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
};

// Returns the corrected address, or null when there is nothing to suggest.
export const suggestEmailFix = (email) => {
  const value = (email || '').trim();
  const at = value.lastIndexOf('@');
  if (at < 1) return null;
  const local = value.slice(0, at);
  const domain = value.slice(at + 1).toLowerCase();
  if (!domain || KNOWN_DOMAINS.includes(domain) || REAL_LOOKALIKES.includes(domain)) return null;
  if (EXPLICIT[domain]) return `${local}@${EXPLICIT[domain]}`;
  // One or two edits away from a known provider, and not just a short unrelated domain.
  const match = KNOWN_DOMAINS.find((known) => distance(domain, known) <= (known.length > 8 ? 2 : 1));
  return match && domain.length >= 6 ? `${local}@${match}` : null;
};
