import { suggestEmailFix } from './emailTypos';

test('suggests the intended provider for common typos, keeping the name part as typed', () => {
  expect(suggestEmailFix('Ayse.K@gmial.com')).toBe('Ayse.K@gmail.com');
  expect(suggestEmailFix('eng@gmai.com')).toBe('eng@gmail.com');
  expect(suggestEmailFix('eng@gmail.co')).toBe('eng@gmail.com');
  expect(suggestEmailFix('eng@hotmial.com')).toBe('eng@hotmail.com');
  expect(suggestEmailFix('eng@outlok.com')).toBe('eng@outlook.com');
  expect(suggestEmailFix(' eng@yahooo.com ')).toBe('eng@yahoo.com');
});

test('never touches correct addresses or company domains', () => {
  expect(suggestEmailFix('eng@gmail.com')).toBeNull();
  expect(suggestEmailFix('eng@plotune.net')).toBeNull();
  expect(suggestEmailFix('eng@bosch.com')).toBeNull();
  expect(suggestEmailFix('eng@avl.com')).toBeNull();
  expect(suggestEmailFix('eng@mail.com')).toBeNull();
  expect(suggestEmailFix('eng@gmx.com')).toBeNull();
  expect(suggestEmailFix('eng@hotmail.co.uk')).toBeNull();
  expect(suggestEmailFix('eng@ymail.com')).toBeNull();
});

test('ignores incomplete input', () => {
  expect(suggestEmailFix('')).toBeNull();
  expect(suggestEmailFix('eng')).toBeNull();
  expect(suggestEmailFix('@gmial.com')).toBeNull();
  expect(suggestEmailFix('eng@')).toBeNull();
});
