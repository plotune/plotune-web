import { COUNTRIES } from '../content/countries';
import { localeCountryCode, normalizeCountry, resolveCountry, suggestCountries } from './countryMatch';

test('everyday names find the right country', () => {
  for (const typed of ['UK', 'u.k.', 'England', 'Great Britain', 'britain', 'Scotland', 'Ingiltere']) {
    expect(resolveCountry(typed)).toBe('United Kingdom');
  }
  for (const typed of ['Turkey', 'turkiye', 'Türkiye', 'TÜRKİYE', 'TURKIYE']) expect(resolveCountry(typed)).toBe('Türkiye');
  expect(resolveCountry('USA')).toBe('United States');
  expect(resolveCountry('Deutschland')).toBe('Germany');
  expect(resolveCountry('almanya')).toBe('Germany');
  expect(resolveCountry('Holland')).toBe('Netherlands');
  expect(resolveCountry('czech republic')).toBe('Czechia');
});

test('text that is not a country does not resolve (autofill put a username there once)', () => {
  expect(resolveCountry('Recep200789')).toBeNull();
  expect(resolveCountry('')).toBeNull();
  expect(resolveCountry('Germ')).toBeNull();
});

test('the first letters already suggest the likely country first', () => {
  expect(suggestCountries('uk')[0]).toBe('United Kingdom');
  expect(suggestCountries('uk')).toContain('Ukraine');
  expect(suggestCountries('un')[0]).toBe('United Kingdom');
  expect(suggestCountries('un').slice(0, 2)).toEqual(['United Kingdom', 'United States']);
  expect(suggestCountries('ger')[0]).toBe('Germany');
  expect(suggestCountries('tur')[0]).toBe('Türkiye');
  expect(suggestCountries('eng')[0]).toBe('United Kingdom');
  expect(suggestCountries('kingdom')).toContain('United Kingdom');
  expect(suggestCountries('zzzz')).toEqual([]);
  expect(suggestCountries('a').length).toBeLessThanOrEqual(6);
});

test('an empty field offers the visitor\'s own country, then the common ones', () => {
  expect(suggestCountries('', { localeCode: 'PL' })).toEqual(['Poland', 'Türkiye', 'Germany', 'United Kingdom', 'United States', 'France']);
  expect(suggestCountries('')[0]).toBe('Türkiye');
  expect(localeCountryCode(['en-GB', 'tr'])).toBe('GB');
  expect(localeCountryCode(['tr'])).toBeNull();
});

test('every country resolves by its own name and names are unique', () => {
  const names = COUNTRIES.map((c) => c.name);
  expect(new Set(names).size).toBe(names.length);
  for (const name of names) expect(resolveCountry(name)).toBe(name);
  expect(normalizeCountry('  Côte d’Ivoire ')).toBe('cote d ivoire');
});
