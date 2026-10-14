// Plotune Nexus offer: the one place the public prices and rental terms live. The /nexus offer
// section, its cost calculator and the order-request payload all read from here, so a price change
// is a change to this file only (bump OFFER_VERSION so requests in the sheet show which terms the
// visitor saw).
//
// All amounts are USD, excluding VAT / sales tax, shipping and any import duties: those depend on
// the destination country and are quoted personally before payment.
export const OFFER_VERSION = '2026-10-launch';

// "Launch price" is limited to the first LAUNCH_CUSTOMERS customers, which is what makes the
// struck-through standard price an honest reference rather than an invented "was" price.
export const LAUNCH_CUSTOMERS = 10;

export const RENT = { monthly: 350, standardMonthly: 570, minimumMonths: 1 };
export const BUY = { price: 3500, standardPrice: 6000, supportYearly: 350 };

// Refundable rental deposit: covers the device's hardware cost, and shrinks for longer rentals.
export const DEPOSIT = { base: 700, over6Months: 350, over12Months: 175 };

export const MIN_MONTHS = 1;
export const MAX_MONTHS = 24;

export const clampMonths = (value) => {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return MIN_MONTHS;
  return Math.min(MAX_MONTHS, Math.max(MIN_MONTHS, n));
};

export const depositFor = (months) => {
  const m = clampMonths(months);
  if (m > 12) return DEPOSIT.over12Months;
  if (m > 6) return DEPOSIT.over6Months;
  return DEPOSIT.base;
};

// What each option costs over `months`, before tax and shipping. The deposit is shown separately:
// it comes back when the device is returned, so it is not part of the rental's cost.
export const quote = (months) => {
  const m = clampMonths(months);
  const rentTotal = RENT.monthly * m;
  return {
    months: m,
    rentTotal,
    deposit: depositFor(m),
    buyTotal: BUY.price,
    cheaper: rentTotal < BUY.price ? 'rent' : rentTotal > BUY.price ? 'buy' : 'same',
  };
};

// First rental length at which renting costs more than buying (11 months at $350 vs $3,500).
export const BUY_PAYS_OFF_AFTER_MONTHS = Math.floor(BUY.price / RENT.monthly) + 1;

export const usd = (amount) => `$${Number(amount).toLocaleString('en-US')}`;
