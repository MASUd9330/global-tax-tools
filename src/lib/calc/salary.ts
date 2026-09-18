/**
 * Salary calculation: gross -> net (with income tax + employee social contributions).
 * Uses tax engine for income tax, plus SalaryConfig for social.
 */

import {
  calculateProgressiveTax,
  type TaxBracket,
  type TaxDeduction,
} from "./tax";

export interface SalaryInputs {
  grossIncome: number; // annual
  brackets: TaxBracket[];
  deductions?: TaxDeduction[];
  // Social contributions
  employeeSocialRate: number; // e.g. 0.0765 US Social Security
  socialCap?: number | null; // max salary subject to social (e.g. 176100)
  healthcareRate?: number | null; // additional healthcare %
  healthcareCap?: number | null;
}

export interface SalaryResult {
  gross: number;
  incomeTax: number;
  taxableIncome: number;
  employeeSocial: number;
  healthcare: number;
  totalEmployeeDeductions: number;
  netAnnual: number;
  netMonthly: number;
  effectiveTaxRate: number; // total deductions / gross
  takeHomeRate: number; // net / gross
}

export function calculateSalary(input: SalaryInputs): SalaryResult {
  const {
    grossIncome,
    brackets,
    deductions = [],
    employeeSocialRate,
    socialCap = null,
    healthcareRate = 0,
    healthcareCap = null,
  } = input;

  // 1. Income tax (progressive)
  const taxResult = calculateProgressiveTax(grossIncome, brackets, deductions);

  // 2. Employee social contributions (capped)
  let socialBase = grossIncome;
  if (socialCap && socialCap > 0) {
    socialBase = Math.min(grossIncome, socialCap);
  }
  const employeeSocial = socialBase * employeeSocialRate;

  // 3. Healthcare (often separate)
  let healthcareBase = grossIncome;
  if (healthcareCap && healthcareCap > 0) {
    healthcareBase = Math.min(grossIncome, healthcareCap);
  }
  const healthcare = (healthcareRate || 0) * healthcareBase;

  const totalEmployeeDeductions = taxResult.totalTax + employeeSocial + healthcare;
  const netAnnual = Math.max(0, grossIncome - totalEmployeeDeductions);
  const netMonthly = netAnnual / 12;

  const effectiveTaxRate = grossIncome > 0 ? totalEmployeeDeductions / grossIncome : 0;
  const takeHomeRate = grossIncome > 0 ? netAnnual / grossIncome : 0;

  return {
    gross: grossIncome,
    incomeTax: taxResult.totalTax,
    taxableIncome: taxResult.taxableIncome,
    employeeSocial,
    healthcare,
    totalEmployeeDeductions,
    netAnnual,
    netMonthly,
    effectiveTaxRate,
    takeHomeRate,
  };
}

/**
 * Currency-formatted summary.
 */
export function summarizeSalary(result: SalaryResult, currency = "USD"): string {
  return `${currency} ${result.netAnnual.toFixed(0)}/yr (${(result.takeHomeRate * 100).toFixed(1)}% take-home)`;
}