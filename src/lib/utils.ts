import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency formatter — locale-aware
export function formatCurrency(amount: number, currency: string, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Number formatter with commas
export function formatNumber(n: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
}

// Percentage formatter
export function formatPercent(rate: number, decimals = 1): string {
  return `${(rate * 100).toFixed(decimals)}%`;
}

// Year-aware current tax year (defaults to most recent complete year)
export function getCurrentTaxYear(): number {
  const now = new Date();
  // Tax years are typically defined as the calendar year they apply to.
  // Use current year if we're past April (most countries file by then).
  // Otherwise, use previous year (last complete tax year for most jurisdictions).
  const month = now.getMonth();
  return month >= 3 ? now.getFullYear() : now.getFullYear() - 1;
}