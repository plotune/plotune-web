import { COUNTRIES, COUNTRY_ALIASES, POPULAR_COUNTRIES } from '../content/countries';

// Lower-case, no accents, no dots, "&" as "and", single spaces. Turkish dotless/dotted i fold to i,
// so "TÜRKİYE", "turkiye" and "Türkiye" compare equal.
export const normalizeCountry = (text) => (text || '')
  .replace(/[İIı]/g, 'i')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/&/g, ' and ')
  .replace(/[.’'()-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const ENTRIES = COUNTRIES.map((country) => ({
  ...country,
  keys: [country.name, ...(COUNTRY_ALIASES[country.code] || [])].map(normalizeCountry),
}));
const BY_CODE = Object.fromEntries(ENTRIES.map((e) => [e.code, e]));
const popularity = (code) => {
  const i = POPULAR_COUNTRIES.indexOf(code);
  return i === -1 ? POPULAR_COUNTRIES.length : i;
};

// The visitor's own country from the browser language ("tr-TR" -> Türkiye), if it has a region.
export const localeCountryCode = (languages) => {
  const list = languages || (typeof navigator !== 'undefined' ? navigator.languages || [navigator.language] : []);
  for (const tag of list) {
    const region = /[-_]([A-Za-z]{2})\b/.exec(tag || '');
    if (region && BY_CODE[region[1].toUpperCase()]) return region[1].toUpperCase();
  }
  return null;
};

// The canonical name when the text names a country exactly (by name or alias), otherwise null.
export const resolveCountry = (text) => {
  const q = normalizeCountry(text);
  if (!q) return null;
  const hit = ENTRIES.find((e) => e.keys.includes(q));
  return hit ? hit.name : null;
};

// 0 = exact, 1 = name/alias starts with it, 2 = a word starts with it, 3 = contains it (3+ letters).
const scoreKey = (key, q) => {
  if (key === q) return 0;
  if (key.startsWith(q)) return 1;
  if (key.split(' ').some((word) => word.startsWith(q))) return 2;
  if (q.length >= 3 && key.includes(q)) return 3;
  return null;
};

// Up to `limit` suggestions for what has been typed so far. Empty input suggests the visitor's
// own country first, then the popular ones.
export const suggestCountries = (text, { limit = 6, localeCode = null } = {}) => {
  const q = normalizeCountry(text);
  if (!q) {
    const codes = [localeCode, ...POPULAR_COUNTRIES].filter((c, i, all) => c && BY_CODE[c] && all.indexOf(c) === i);
    return codes.slice(0, limit).map((c) => BY_CODE[c].name);
  }
  return ENTRIES
    .map((e) => {
      const scores = e.keys.map((key) => scoreKey(key, q)).filter((s) => s !== null);
      return scores.length ? { e, score: Math.min(...scores) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score
      || (a.e.code === localeCode ? -1 : b.e.code === localeCode ? 1 : 0)
      || popularity(a.e.code) - popularity(b.e.code)
      || a.e.name.localeCompare(b.e.name))
    .slice(0, limit)
    .map(({ e }) => e.name);
};
