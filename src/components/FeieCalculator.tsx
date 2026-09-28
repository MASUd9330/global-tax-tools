"use client";

import { useState, useMemo } from "react";
import { Loader2, Plane, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

/**
 * USA FEIE Calculator (2026)
 *
 * Compares the tax owed:
 *  - "Normal" filing: standard US federal brackets on full foreign income
 *  - "FEIE" filing: $130,000 excluded from federal income tax (2026)
 *
 * Note: Self-employment tax (15.3%) and state tax are NOT excluded by FEIE.
 * For SE tax, user selects whether to include or exclude (default = include).
 */

const FEIE_LIMIT_2026 = 130000; // dollars per qualifying individual

const US_BRACKETS_2025 = [
  { lower: 0, upper: 11925, rate: 0.10 },
  { lower: 11925, upper: 48475, rate: 0.12 },
  { lower: 48475, upper: 103350, rate: 0.22 },
  { lower: 103350, upper: 197300, rate: 0.24 },
  { lower: 197300, upper: 250525, rate: 0.32 },
  { lower: 250525, upper: 626350, rate: 0.35 },
  { lower: 626350, upper: null, rate: 0.37 },
];
const STANDARD_DEDUCTION_SINGLE = 15000; // simplified 2025/2026

function calcFedTax(taxable: number): number {
  if (taxable <= 0) return 0;
  let tax = 0;
  for (const b of US_BRACKETS_2025) {
    if (taxable > b.lower) {
      const upper = b.upper ?? Number.POSITIVE_INFINITY;
      const portion = Math.min(taxable, upper) - b.lower;
      tax += portion * b.rate;
      if (taxable <= upper) break;
    }
  }
  return Math.max(0, tax);
}

interface Props {}

export function FeieCalculator(_props: Props) {
  const [foreignIncome, setForeignIncome] = useState("150000");
  const [isSelfEmployed, setIsSelfEmployed] = useState(false);
  const [filingStatus, setFilingStatus] = useState<"single" | "mfj">("single");

  const standardDeduction = filingStatus === "mfj" ? 30000 : STANDARD_DEDUCTION_SINGLE;
  const seRate = 0.153; // 15.3% (12.4% SS + 2.9% Medicare)
  const seDeductibleHalf = 0.5; // 50% of SE tax is income-tax-deductible

  const num = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

  const result = useMemo(() => {
    const income = num(foreignIncome);
    if (income <= 0) return null;

    // Normal filing (no FEIE)
    const taxableNormal = Math.max(0, income - standardDeduction);
    const fedTaxNormal = calcFedTax(taxableNormal);
    let seTaxNormal = 0;
    if (isSelfEmployed) {
      // SE tax = 15.3% on 92.35% of net earnings
      const seBase = income * 0.9235;
      seTaxNormal = seBase * seRate;
      // Half of SE tax is deductible from income
      // (Already excluded from taxableNormal by ignoring SE-specific deduction for simplicity)
    }
    const totalTaxNormal = fedTaxNormal + seTaxNormal;

    // FEIE filing
    const excluded = Math.min(FEIE_LIMIT_2026, income);
    const taxableFeie = Math.max(0, income - excluded - standardDeduction);
    const fedTaxFeie = calcFedTax(taxableFeie);
    // SE tax is NOT excluded by FEIE
    const seTaxFeie = seTaxNormal;
    const totalTaxFeie = fedTaxFeie + seTaxFeie;

    const fedSavings = fedTaxNormal - fedTaxFeie;
    const totalSavings = totalTaxNormal - totalTaxFeie;
    const netIncomeNormal = income - totalTaxNormal;
    const netIncomeFeie = income - totalTaxFeie;

    return {
      income,
      excluded,
      taxableNormal,
      fedTaxNormal,
      seTaxNormal,
      totalTaxNormal,
      fedTaxFeie,
      seTaxFeie,
      totalTaxFeie,
      fedSavings,
      totalSavings,
      netIncomeNormal,
      netIncomeFeie,
    };
  }, [foreignIncome, isSelfEmployed, filingStatus, standardDeduction, seRate]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="feie-income">Foreign-earned income (USD)</Label>
          <Input
            id="feie-income"
            type="number"
            min={0}
            step={5000}
            value={foreignIncome}
            onChange={(e) => setForeignIncome(e.target.value)}
            placeholder="150000"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="feie-status">Filing status</Label>
          <select
            id="feie-status"
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value as "single" | "mfj")}
            className="mt-1.5 flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <option value="single">Single</option>
            <option value="mfj">Married filing jointly</option>
          </select>
        </div>
        <div>
          <Label htmlFor="feie-se">Employment type</Label>
          <div className="mt-1.5 flex items-center gap-3 h-10">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isSelfEmployed}
                onChange={(e) => setIsSelfEmployed(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Self-employed / 1099</span>
            </label>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        <strong>2026 FEIE limit: ${FEIE_LIMIT_2026.toLocaleString()}</strong> per qualifying individual.
        Higher if both spouses qualify (each gets $130K). Assumes no state tax, no FEIT/FTC interaction.
      </p>

      {result && result.income > 0 && (
        <>
          {/* Headline savings card */}
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-emerald-900">
                  Estimated annual savings with FEIE
                </h3>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Federal income tax saved</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
                    {formatCurrency(result.fedSavings, "USD")}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    {isSelfEmployed ? "Net savings (incl. SE tax)" : "Total savings"}
                  </div>
                  <div className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
                    {formatCurrency(result.totalSavings, "USD")}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Net income boost</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
                    {formatCurrency(result.netIncomeFeie - result.netIncomeNormal, "USD")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Side-by-side comparison */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Without FEIE (normal)</h4>
                <div className="space-y-2 text-sm">
                  <Row label="Foreign income" value={formatCurrency(result.income, "USD")} />
                  <Row label="Standard deduction" value={`−${formatCurrency(standardDeduction, "USD")}`} accent="emerald" />
                  <Row label="Taxable income" value={formatCurrency(result.taxableNormal, "USD")} />
                  <Row label="Federal income tax" value={formatCurrency(result.fedTaxNormal, "USD")} accent="rose" />
                  {isSelfEmployed && (
                    <Row label="Self-employment tax (15.3%)" value={formatCurrency(result.seTaxNormal, "USD")} accent="rose" />
                  )}
                  <div className="border-t border-slate-200 pt-2 mt-2 font-semibold">
                    <Row label="Total tax" value={formatCurrency(result.totalTaxNormal, "USD")} accent="rose" />
                    <Row label="Net take-home" value={formatCurrency(result.netIncomeNormal, "USD")} accent="emerald" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200">
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold text-emerald-900 mb-3">
                  With FEIE (excluding ${result.excluded.toLocaleString()})
                </h4>
                <div className="space-y-2 text-sm">
                  <Row label="Foreign income" value={formatCurrency(result.income, "USD")} />
                  <Row label={`FEIE exclusion`} value={`−${formatCurrency(result.excluded, "USD")}`} accent="emerald" />
                  <Row label="Standard deduction" value={`−${formatCurrency(standardDeduction, "USD")}`} accent="emerald" />
                  <Row label="Taxable income" value={formatCurrency(Math.max(0, result.income - result.excluded - standardDeduction), "USD")} />
                  <Row label="Federal income tax" value={formatCurrency(result.fedTaxFeie, "USD")} accent="rose" />
                  {isSelfEmployed && (
                    <Row label="SE tax (still applies)" value={formatCurrency(result.seTaxFeie, "USD")} accent="rose" />
                  )}
                  <div className="border-t border-slate-200 pt-2 mt-2 font-semibold">
                    <Row label="Total tax" value={formatCurrency(result.totalTaxFeie, "USD")} accent="rose" />
                    <Row label="Net take-home" value={formatCurrency(result.netIncomeFeie, "USD")} accent="emerald" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4 text-sm text-blue-900 flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong>Heads up:</strong> if you're self-employed and live in a country with a
                totalization agreement (most of EU, UK, Canada, Japan, S. Korea, etc.), you can
                often <em>also</em> deduct foreign social contributions from US SE tax — taking
                your real SE-tax burden near zero. Use{" "}
                <a href="https://www.ssa.gov/international/agreements.html" className="underline" target="_blank" rel="noopener noreferrer">
                  SSA Totalization Agreement lookup
                </a> to confirm.
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-slate-500 leading-relaxed">
            Estimate only. Uses 2025 federal brackets (2026 brackets not yet published by IRS — they usually mirror 2025
            with inflation indexing). Doesn't include AMT, NIIT (3.8% on investments over $200K), child tax credits,
            deductions for foreign housing, or the Foreign Tax Credit interaction. For accurate filing, use Form 2555
            + a US-expat CPA (budget $300-1500/year).
          </p>
        </>
      )}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: "rose" | "emerald" }) {
  const color = accent === "rose" ? "text-rose-700" : accent === "emerald" ? "text-emerald-700" : "text-slate-900";
  return (
    <div className="flex items-baseline justify-between border-b border-slate-100 pb-1.5">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`tabular-nums font-medium ${color}`}>{value}</span>
    </div>
  );
}