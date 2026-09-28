/**
 * Currency conversion + formatting utilities.
 *
 * Exchange rates are static 2025-Q2 mid-rates against USD.
 * For production accuracy, replace with a live FX API
 * (e.g. exchangerate.host, Open Exchange Rates).
 *
 * Used by TaxCalculator for multi-currency input support.
 */

export interface CurrencyInfo {
  code: string;        // ISO 4217
  symbol: string;      // display symbol
  name: string;
  perUsd: number;      // how many of this currency = 1 USD
  decimals: number;    // display decimals (0 for most, 2 for some)
  flag: string;        // emoji
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$",    name: "US Dollar",          perUsd: 1,        decimals: 0, flag: "🇺🇸" },
  EUR: { code: "EUR", symbol: "€",    name: "Euro",               perUsd: 0.92,     decimals: 0, flag: "🇪🇺" },
  GBP: { code: "GBP", symbol: "£",    name: "British Pound",      perUsd: 0.79,     decimals: 0, flag: "🇬🇧" },
  JPY: { code: "JPY", symbol: "¥",    name: "Japanese Yen",       perUsd: 157,      decimals: 0, flag: "🇯🇵" },
  CNY: { code: "CNY", symbol: "¥",    name: "Chinese Yuan",       perUsd: 7.25,     decimals: 0, flag: "🇨🇳" },
  INR: { code: "INR", symbol: "₹",    name: "Indian Rupee",       perUsd: 83.5,     decimals: 0, flag: "🇮🇳" },
  CAD: { code: "CAD", symbol: "C$",   name: "Canadian Dollar",    perUsd: 1.37,     decimals: 0, flag: "🇨🇦" },
  AUD: { code: "AUD", symbol: "A$",   name: "Australian Dollar",  perUsd: 1.51,     decimals: 0, flag: "🇦🇺" },
  SGD: { code: "SGD", symbol: "S$",   name: "Singapore Dollar",   perUsd: 1.35,     decimals: 0, flag: "🇸🇬" },
  HKD: { code: "HKD", symbol: "HK$",  name: "Hong Kong Dollar",   perUsd: 7.82,     decimals: 0, flag: "🇭🇰" },
  KRW: { code: "KRW", symbol: "₩",    name: "Korean Won",         perUsd: 1370,     decimals: 0, flag: "🇰🇷" },
  CHF: { code: "CHF", symbol: "CHF",  name: "Swiss Franc",        perUsd: 0.90,     decimals: 0, flag: "🇨🇭" },
  AED: { code: "AED", symbol: "د.إ", name: "UAE Dirham",         perUsd: 3.67,     decimals: 0, flag: "🇦🇪" },
  BRL: { code: "BRL", symbol: "R$",   name: "Brazilian Real",     perUsd: 5.10,     decimals: 0, flag: "🇧🇷" },
  MXN: { code: "MXN", symbol: "Mex$", name: "Mexican Peso",       perUsd: 17.0,     decimals: 0, flag: "🇲🇽" },
  ZAR: { code: "ZAR", symbol: "R",    name: "South African Rand", perUsd: 18.5,     decimals: 0, flag: "🇿🇦" },
  SEK: { code: "SEK", symbol: "kr",   name: "Swedish Krona",      perUsd: 10.7,     decimals: 0, flag: "🇸🇪" },
  NOK: { code: "NOK", symbol: "kr",   name: "Norwegian Krone",    perUsd: 10.8,     decimals: 0, flag: "🇳🇴" },
  DKK: { code: "DKK", symbol: "kr",   name: "Danish Krone",       perUsd: 6.87,     decimals: 0, flag: "🇩🇰" },
  PLN: { code: "PLN", symbol: "zł",   name: "Polish Zloty",       perUsd: 4.00,     decimals: 0, flag: "🇵🇱" },
  THB: { code: "THB", symbol: "฿",    name: "Thai Baht",          perUsd: 36.5,     decimals: 0, flag: "🇹🇭" },
  IDR: { code: "IDR", symbol: "Rp",   name: "Indonesian Rupiah",  perUsd: 16100,    decimals: 0, flag: "🇮🇩" },
  PHP: { code: "PHP", symbol: "₱",    name: "Philippine Peso",    perUsd: 56.5,     decimals: 0, flag: "🇵🇭" },
  MYR: { code: "MYR", symbol: "RM",   name: "Malaysian Ringgit",  perUsd: 4.72,     decimals: 0, flag: "🇲🇾" },
  VND: { code: "VND", symbol: "₫",    name: "Vietnamese Dong",    perUsd: 25400,    decimals: 0, flag: "🇻🇳" },
  TWD: { code: "TWD", symbol: "NT$",  name: "Taiwan Dollar",      perUsd: 32.4,     decimals: 0, flag: "🇹🇼" },
  NZD: { code: "NZD", symbol: "NZ$",  name: "New Zealand Dollar", perUsd: 1.65,     decimals: 0, flag: "🇳🇿" },
  RUB: { code: "RUB", symbol: "₽",    name: "Russian Ruble",      perUsd: 90.0,     decimals: 0, flag: "🇷🇺" },
  TRY: { code: "TRY", symbol: "₺",    name: "Turkish Lira",       perUsd: 32.0,     decimals: 0, flag: "🇹🇷" },
};

export const CURRENCY_LIST: CurrencyInfo[] = Object.values(CURRENCIES);

/**
 * Convert an amount from one currency to another.
 * All rates are USD-anchored — `perUsd[code]` = how many of `code` = 1 USD.
 * So `amount_in_to = amount_in_from × (perUsd_to / perUsd_from)`.
 *
 * Example: 100 USD → EUR.
 *   USD.perUsd = 1 (1 USD = 1 USD)
 *   EUR.perUsd = 0.92 (0.92 EUR = 1 USD)
 *   100 USD × (0.92 / 1) = 92 EUR ✓
 */
export function convertCurrency(amount: number, from: string, to: string): number {
  const f = CURRENCIES[from];
  const t = CURRENCIES[to];
  if (!f || !t) return amount;
  return amount * (t.perUsd / f.perUsd);
}

/**
 * Format amount in given currency using locale.
 */
export function formatMoney(amount: number, currency: string, locale = "en-US"): string {
  const c = CURRENCIES[currency];
  const decimals = c?.decimals ?? 0;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: decimals,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${c?.symbol ?? ""}${Math.round(amount).toLocaleString()}`;
  }
}

/**
 * Compact format for big numbers: 1.2M, 15K, etc.
 */
export function formatMoneyCompact(amount: number, currency: string): string {
  const c = CURRENCIES[currency];
  const abs = Math.abs(amount);
  let compact: string;
  if (abs >= 1_000_000) compact = `${c?.symbol ?? ""}${(amount / 1_000_000).toFixed(1)}M`;
  else if (abs >= 1_000) compact = `${c?.symbol ?? ""}${Math.round(amount / 1_000)}K`;
  else compact = `${c?.symbol ?? ""}${Math.round(amount)}`;
  return compact;
}

/**
 * Parse "1,234.56" or "1.234,56" (European) to number.
 */
export function parseAmount(input: string): number {
  if (!input) return 0;
  // Detect European format (1.234,56)
  if (input.includes(".") && input.includes(",")) {
    if (input.lastIndexOf(",") > input.lastIndexOf(".")) {
      return parseFloat(input.replace(/\./g, "").replace(",", "."));
    }
    return parseFloat(input.replace(/,/g, ""));
  }
  // Single decimal separator
  return parseFloat(input.replace(/,/g, ""));
}