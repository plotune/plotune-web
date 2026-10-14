import { BUY_PAYS_OFF_AFTER_MONTHS, clampMonths, depositFor, quote, usd } from './nexusOffer';

test('the refundable deposit halves after 6 months and again after 12', () => {
  expect([1, 6].map(depositFor)).toEqual([700, 700]);
  expect([7, 12].map(depositFor)).toEqual([350, 350]);
  expect([13, 24].map(depositFor)).toEqual([175, 175]);
});

test('quote: rent total, deposit kept apart from the cost, and which option costs less', () => {
  expect(quote(3)).toEqual({ months: 3, rentTotal: 1050, deposit: 700, buyTotal: 3500, cheaper: 'rent' });
  expect(quote(10).cheaper).toBe('same');
  expect(quote(11)).toMatchObject({ rentTotal: 3850, deposit: 350, cheaper: 'buy' });
  expect(BUY_PAYS_OFF_AFTER_MONTHS).toBe(11);
});

test('months are clamped to the calculator range; amounts are formatted as USD', () => {
  expect([0, -3, 'x', 2.6, 99].map(clampMonths)).toEqual([1, 1, 1, 3, 24]);
  expect(usd(3500)).toBe('$3,500');
});
