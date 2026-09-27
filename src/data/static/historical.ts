/**
 * Historical tax brackets — 2024 snapshot for top countries.
 * Used by Historical Trend Charts (2024 vs 2025 comparison).
 *
 * Sources: each country's official 2024 tax bracket publication.
 * Only countries with material bracket changes are included; identical
 * 2024/2025 brackets would clutter the chart without adding insight.
 */

import type { StaticTaxBracket, StaticDeduction } from "./countries";

export interface HistoricalTaxYear {
  countryCode: string;
  year: number;
  taxSystem: string;
  brackets: StaticTaxBracket[];
  deductions: StaticDeduction[];
}

export const HISTORICAL_2024: HistoricalTaxYear[] = [
  {
    countryCode: "US",
    year: 2024,
    taxSystem: "progressive",
    brackets: [
      { lowerBound: 0, upperBound: 11600, rate: 0.10 },
      { lowerBound: 11600, upperBound: 47150, rate: 0.12 },
      { lowerBound: 47150, upperBound: 100525, rate: 0.22 },
      { lowerBound: 100525, upperBound: 191950, rate: 0.24 },
      { lowerBound: 191950, upperBound: 243725, rate: 0.32 },
      { lowerBound: 243725, upperBound: 609350, rate: 0.35 },
      { lowerBound: 609350, upperBound: null, rate: 0.37 },
    ],
    deductions: [{ name: "Standard Deduction (Single)", type: "standard", amount: 14600 }],
  },
  {
    countryCode: "GB",
    year: 2024,
    taxSystem: "progressive",
    brackets: [
      { lowerBound: 0, upperBound: 12570, rate: 0 },
      { lowerBound: 12570, upperBound: 50270, rate: 0.20 },
      { lowerBound: 50270, upperBound: 125140, rate: 0.40 },
      { lowerBound: 125140, upperBound: null, rate: 0.45 },
    ],
    deductions: [{ name: "Personal Allowance", type: "personal", amount: 12570 }],
  },
  {
    countryCode: "DE",
    year: 2024,
    taxSystem: "german_formula",
    brackets: [
      { lowerBound: 0, upperBound: 10908, rate: 0 },
      { lowerBound: 10908, upperBound: 62809, rate: 0.20, fixedAmount: 0 },
      { lowerBound: 62809, upperBound: 277825, rate: 0.42, fixedAmount: 9548 },
      { lowerBound: 277825, upperBound: null, rate: 0.45, fixedAmount: 17170 },
    ],
    deductions: [{ name: "Grundfreibetrag (Basic Allowance)", type: "personal", amount: 10908 }],
  },
  {
    countryCode: "FR",
    year: 2024,
    taxSystem: "progressive",
    brackets: [
      { lowerBound: 0, upperBound: 10777, rate: 0 },
      { lowerBound: 10777, upperBound: 27478, rate: 0.11 },
      { lowerBound: 27478, upperBound: 78570, rate: 0.30 },
      { lowerBound: 78570, upperBound: 168994, rate: 0.41 },
      { lowerBound: 168994, upperBound: null, rate: 0.45 },
    ],
    deductions: [{ name: "Abattement Personnel", type: "personal", amount: 10777 }],
  },
  {
    countryCode: "CA",
    year: 2024,
    taxSystem: "progressive",
    brackets: [
      { lowerBound: 0, upperBound: 55867, rate: 0.15 },
      { lowerBound: 55867, upperBound: 111733, rate: 0.205 },
      { lowerBound: 111733, upperBound: 173205, rate: 0.26 },
      { lowerBound: 173205, upperBound: 246752, rate: 0.29 },
      { lowerBound: 246752, upperBound: null, rate: 0.33 },
    ],
    deductions: [{ name: "Basic Personal Amount (2024 indexed)", type: "personal", amount: 15705 }],
  },
  {
    countryCode: "AU",
    year: 2024,
    taxSystem: "progressive",
    brackets: [
      { lowerBound: 0, upperBound: 18200, rate: 0 },
      { lowerBound: 18200, upperBound: 45000, rate: 0.16 },
      { lowerBound: 45000, upperBound: 135000, rate: 0.30 },
      { lowerBound: 135000, upperBound: 190000, rate: 0.37 },
      { lowerBound: 190000, upperBound: null, rate: 0.45 },
    ],
    deductions: [{ name: "Tax-free Threshold", type: "personal", amount: 18200 }],
  },
  {
    countryCode: "JP",
    year: 2024,
    taxSystem: "progressive",
    brackets: [
      { lowerBound: 0, upperBound: 1950000, rate: 0.05 },
      { lowerBound: 1950000, upperBound: 3300000, rate: 0.10 },
      { lowerBound: 3300000, upperBound: 6950000, rate: 0.20 },
      { lowerBound: 6950000, upperBound: 9000000, rate: 0.23 },
      { lowerBound: 9000000, upperBound: 18000000, rate: 0.33 },
      { lowerBound: 18000000, upperBound: 40000000, rate: 0.40 },
      { lowerBound: 40000000, upperBound: null, rate: 0.45 },
    ],
    deductions: [{ name: "Basic Deduction", type: "personal", amount: 480000 }],
  },
  {
    countryCode: "IT",
    year: 2024,
    taxSystem: "progressive",
    brackets: [
      { lowerBound: 0, upperBound: 28000, rate: 0.23 },
      { lowerBound: 28000, upperBound: 50000, rate: 0.35 },
      { lowerBound: 50000, upperBound: null, rate: 0.43 },
    ],
    deductions: [{ name: "No-Tax Area (Reddito)", type: "personal", amount: 0 }],
  },
  {
    countryCode: "ES",
    year: 2024,
    taxSystem: "progressive",
    brackets: [
      { lowerBound: 0, upperBound: 12450, rate: 0.19 },
      { lowerBound: 12450, upperBound: 20200, rate: 0.24 },
      { lowerBound: 20200, upperBound: 35200, rate: 0.30 },
      { lowerBound: 35200, upperBound: 60000, rate: 0.37 },
      { lowerBound: 60000, upperBound: 300000, rate: 0.45 },
      { lowerBound: 300000, upperBound: null, rate: 0.47 },
    ],
    deductions: [{ name: "Mínimo Personal", type: "personal", amount: 5550 }],
  },
  {
    countryCode: "NL",
    year: 2024,
    taxSystem: "progressive",
    brackets: [
      { lowerBound: 0, upperBound: 75518, rate: 0.370 },
      { lowerBound: 75518, upperBound: null, rate: 0.495 },
    ],
    deductions: [],
  },
  {
    countryCode: "IE",
    year: 2024,
    taxSystem: "progressive",
    brackets: [
      { lowerBound: 0, upperBound: 42000, rate: 0.20 },
      { lowerBound: 42000, upperBound: null, rate: 0.40 },
    ],
    deductions: [{ name: "Personal Tax Credit (2024)", type: "personal", amount: 18750 }],
  },
  {
    countryCode: "CH",
    year: 2024,
    taxSystem: "progressive",
    brackets: [
      { lowerBound: 0, upperBound: 14500, rate: 0 },
      { lowerBound: 14500, upperBound: 31600, rate: 0.0077 },
      { lowerBound: 31600, upperBound: 41400, rate: 0.0088 },
      { lowerBound: 41400, upperBound: 55200, rate: 0.0264 },
      { lowerBound: 55200, upperBound: 73200, rate: 0.0297 },
      { lowerBound: 73200, upperBound: 78100, rate: 0.046 },
      { lowerBound: 78100, upperBound: 103600, rate: 0.0596 },
      { lowerBound: 103600, upperBound: 134600, rate: 0.0778 },
      { lowerBound: 134600, upperBound: 176200, rate: 0.0884 },
      { lowerBound: 176200, upperBound: 211700, rate: 0.099 },
      { lowerBound: 211700, upperBound: 243400, rate: 0.10 },
      { lowerBound: 243400, upperBound: 921500, rate: 0.111 },
      { lowerBound: 921500, upperBound: null, rate: 0.115 },
    ],
    deductions: [],
  },
  {
    countryCode: "PT",
    year: 2024,
    taxSystem: "progressive",
    brackets: [
      { lowerBound: 0, upperBound: 8200, rate: 0.145 },
      { lowerBound: 8200, upperBound: 12300, rate: 0.21 },
      { lowerBound: 12300, upperBound: 17600, rate: 0.265 },
      { lowerBound: 17600, upperBound: 32600, rate: 0.285 },
      { lowerBound: 32600, upperBound: 53100, rate: 0.35 },
      { lowerBound: 53100, upperBound: 81100, rate: 0.37 },
      { lowerBound: 81100, upperBound: null, rate: 0.48 },
    ],
    deductions: [],
  },
  {
    countryCode: "SG",
    year: 2024,
    taxSystem: "progressive",
    brackets: [
      { lowerBound: 0, upperBound: 20000, rate: 0 },
      { lowerBound: 20000, upperBound: 30000, rate: 0.02 },
      { lowerBound: 30000, upperBound: 40000, rate: 0.035 },
      { lowerBound: 40000, upperBound: 80000, rate: 0.07 },
      { lowerBound: 80000, upperBound: 120000, rate: 0.115 },
      { lowerBound: 120000, upperBound: 160000, rate: 0.15 },
      { lowerBound: 160000, upperBound: 200000, rate: 0.18 },
      { lowerBound: 200000, upperBound: 240000, rate: 0.19 },
      { lowerBound: 240000, upperBound: 280000, rate: 0.195 },
      { lowerBound: 280000, upperBound: 320000, rate: 0.20 },
      { lowerBound: 320000, upperBound: 500000, rate: 0.22 },
      { lowerBound: 500000, upperBound: 1000000, rate: 0.23 },
      { lowerBound: 1000000, upperBound: null, rate: 0.24 },
    ],
    deductions: [],
  },
];

export function getHistoricalForCountry(countryCode: string, year: number): HistoricalTaxYear | null {
  return HISTORICAL_2024.find((h) => h.countryCode === countryCode && h.year === year) ?? null;
}