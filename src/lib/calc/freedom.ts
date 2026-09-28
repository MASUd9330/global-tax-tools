/**
 * Tax Freedom Day — the calendar date by which you've earned enough
 * to pay all your annual taxes. After this date, you're effectively
 * "working for yourself".
 *
 * Formula:
 *   daysWorkedForGovt = (totalTax / annualIncome) * 365
 *   calendarDate = Jan 1 + daysWorkedForGovt
 *
 * For example:
 *   USA $100k, $13.6k tax → 13.6% → 49.6 days → ~Feb 18
 *   France $100k, $40k tax → 40% → 146 days → ~May 27
 *   UAE $100k → 0% → never (Tax Freedom Day = Dec 31 never reached)
 *
 * Pure function, no API needed.
 */

export interface FreedomDayResult {
  daysWorkedForGovt: number;        // 0..365
  totalTax: number;
  annualIncome: number;
  effectiveRate: number;            // 0..1
  freedomDayDate: Date | null;      // null if no tax (or very low tax)
  freedomDayOrdinal: number | null; // day of year (1..365)
  percentOfYear: number;            // 0..1
  year: number;
}

/**
 * Compute Tax Freedom Day for a calendar year.
 *
 * @param annualIncome  gross annual income (any positive number)
 * @param totalTax      total tax owed for the year
 * @param year          calendar year for the calculation (default: current)
 */
export function calcTaxFreedomDay(
  annualIncome: number,
  totalTax: number,
  year: number = new Date().getFullYear()
): FreedomDayResult {
  if (annualIncome <= 0) {
    return {
      daysWorkedForGovt: 0,
      totalTax: 0,
      annualIncome: 0,
      effectiveRate: 0,
      freedomDayDate: null,
      freedomDayOrdinal: null,
      percentOfYear: 0,
      year,
    };
  }

  const effectiveRate = totalTax / annualIncome;
  const daysWorkedForGovt = Math.min(365, Math.round(effectiveRate * 365));
  const ordinal = Math.round(effectiveRate * 365);
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInYear = isLeap ? 366 : 365;

  if (totalTax <= 0 || ordinal <= 0) {
    return {
      daysWorkedForGovt: 0,
      totalTax,
      annualIncome,
      effectiveRate,
      freedomDayDate: null,
      freedomDayOrdinal: null,
      percentOfYear: 0,
      year,
    };
  }

  const freedomDayDate = new Date(year, 0, 1);
  freedomDayDate.setDate(freedomDayDate.getDate() + ordinal - 1);

  return {
    daysWorkedForGovt,
    totalTax,
    annualIncome,
    effectiveRate,
    freedomDayDate,
    freedomDayOrdinal: ordinal,
    percentOfYear: ordinal / daysInYear,
    year,
  };
}

/**
 * Format a Tax Freedom Day result as a human-readable string.
 */
export function formatFreedomDay(result: FreedomDayResult, currency = "USD"): string {
  if (result.freedomDayOrdinal === null) {
    return `${result.year} — you never "work for the government" — Tax Freedom Day is Jan 1, ${result.year + 1}`;
  }
  const d = result.freedomDayDate!;
  const month = d.toLocaleString("en-US", { month: "long" });
  return `${result.year} Tax Freedom Day: ${month} ${d.getDate()}`;
}