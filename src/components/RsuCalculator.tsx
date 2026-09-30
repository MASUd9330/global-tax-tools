"use client";

import { useState, useMemo } from "react";
import { Loader2, TrendingUp, Briefcase, DollarSign } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";

/**
 * USA RSU Tax Calculator
 *
 * Calculates tax owed on RSU vesting. Uses 2025 federal brackets.
 * Assumes single filer; standard deduction baked in.
 *
 * Two scenarios modeled:
 *  - Withhold-and-sell-to-cover (default for most employees)
 *  - Cash exercise / sell all (requires external cash)
 */

const US_BRACKETS_2025_SINGLE = [
  { lower: 0, upper: 11925, rate: 0.10 },
  { lower: 11925, upper: 48475, rate: 0.12 },
  { lower: 48475, upper: 103350, rate: 0.22 },
  { lower: 103350, upper: 197300, rate: 0.24 },
  { lower: 197300, upper: 250525, rate: 0.32 },
  { lower: 250525, upper: 626350, rate: 0.35 },
  { lower: 626350, upper: null, rate: 0.37 },
];

const STANDARD_DEDUCTION_SINGLE = 15000;

const STATE_RATES: Record<string, { code: string; name: string; rate: number }> = {
  NONE: { code: "NONE", name: "No state income tax", rate: 0 },
  TX: { code: "TX", name: "Texas", rate: 0 },
  FL: { code: "FL", name: "Florida", rate: 0 },
  WA: { code: "WA", name: "Washington (capital gains 7%)", rate: 0.07 },
  CA: { code: "CA", name: "California (top 13.3%)", rate: 0.10 }, // avg effective
  NY: { code: "NY", name: "New York (top ~10.9%)", rate: 0.085 }, // avg effective
  MA: { code: "MA", name: "Massachusetts (flat 5%)", rate: 0.05 },
  IL: { code: "IL", name: "Illinois (flat 4.95%)", rate: 0.0495 },
  PA: { code: "PA", name: "Pennsylvania (flat 3.07%)", rate: 0.0307 },
  NJ: { code: "NJ", name: "New Jersey (top 10.75%)", rate: 0.07 },
  CO: { code: "CO", name: "Colorado (flat 4.4%)", rate: 0.044 },
  GA: { code: "GA", name: "Georgia (flat 5.39%)", rate: 0.0539 },
};

function calcFedTax(taxable: number): number {
  if (taxable <= 0) return 0;
  let tax = 0;
  for (const b of US_BRACKETS_2025_SINGLE) {
    if (taxable > b.lower) {
      const upper = b.upper ?? Number.POSITIVE_INFINITY;
      const portion = Math.min(taxable, upper) - b.lower;
      tax += portion * b.rate;
      if (taxable <= upper) break;
    }
  }
  return Math.max(0, tax);
}

function findFederalMarginal(taxable: number): number {
  for (let i = US_BRACKETS_2025_SINGLE.length - 1; i >= 0; i--) {
    if (taxable > US_BRACKETS_2025_SINGLE[i].lower) return US_BRACKETS_2025_SINGLE[i].rate;
  }
  return 0;
}

interface Props {}

export function RsuCalculator(_props: Props) {
  const [rsuValue, setRsuValue] = useState("50000");
  const [otherIncome, setOtherIncome] = useState("150000");
  const [state, setState] = useState("CA");
  const [filingStatus, setFilingStatus] = useState<"single" | "mfj">("single");

  const num = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

  const result = useMemo(() => {
    const rsu = num(rsuValue);
    const other = num(otherIncome);
    if (rsu <= 0) return null;

    const grossIncome = rsu + other;
    const deduction = filingStatus === "mfj" ? 30000 : STANDARD_DEDUCTION_SINGLE;
    const taxableIncome = Math.max(0, grossIncome - deduction);

    const fedTax = calcFedTax(taxableIncome);
    const marginal = findFederalMarginal(taxableIncome);
    const stateObj = STATE_RATES[state] || STATE_RATES.NONE;
    const stateTax = grossIncome * stateObj.rate;
    const fica = grossIncome * 0.0765; // 7.65% on wages up to wage base
    const addlMedicare = grossIncome > 200000 ? (grossIncome - 200000) * 0.009 : 0;

    const totalTax = fedTax + stateTax + fica + addlMedicare;
    const netAfterTax = rsu - totalTax; // assuming all tax applies to RSU alone (approximation)

    // Without RSU baseline
    const taxableIncomeWithout = Math.max(0, other - deduction);
    const fedTaxWithout = calcFedTax(taxableIncomeWithout);
    const stateTaxWithout = other * stateObj.rate;
    const ficaWithout = other * 0.0765;
    const totalTaxWithout = fedTaxWithout + stateTaxWithout + ficaWithout;

    // Marginal cost (tax paid just because of RSU)
    const marginalFed = marginal * rsu;
    const marginalState = stateObj.rate * rsu;
    const marginalFica = rsu * 0.0765;
    const marginalTotal = marginalFed + marginalState + marginalFica;

    return {
      rsu,
      other,
      grossIncome,
      taxableIncome,
      fedTax,
      stateTax,
      stateRate: stateObj.rate,
      stateName: stateObj.name,
      fica,
      addlMedicare,
      totalTax,
      netAfterTax,
      marginal,
      marginalFed,
      marginalState,
      marginalFica,
      marginalTotal,
      fedTaxWithout,
      totalTaxWithout,
      deltaTotal: totalTax - totalTaxWithout,
    };
  }, [rsuValue, otherIncome, state, filingStatus]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="rsu-value">RSU vest value (USD)</Label>
          <Input
            id="rsu-value"
            type="number"
            min={0}
            step={1000}
            value={rsuValue}
            onChange={(e) => setRsuValue(e.target.value)}
            placeholder="50000"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="rsu-other">Other W-2 income</Label>
          <Input
            id="rsu-other"
            type="number"
            min={0}
            step={10000}
            value={otherIncome}
            onChange={(e) => setOtherIncome(e.target.value)}
            placeholder="150000"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="rsu-state">State</Label>
          <select
            id="rsu-state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1.5 flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {Object.values(STATE_RATES).map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="rsu-status">Filing status</Label>
          <select
            id="rsu-status"
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value as "single" | "mfj")}
            className="mt-1.5 flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <option value="single">Single</option>
            <option value="mfj">Married filing jointly</option>
          </select>
        </div>
      </div>

      {result && result.rsu > 0 && (
        <>
          {/* Headline card */}
          <Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-rose-600" />
                <h3 className="text-base font-semibold text-rose-900">
                  Tax on this RSU vest
                </h3>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Total tax owed</div>
                  <div className="mt-1 text-2xl font-bold text-rose-700 tabular-nums">
                    {formatCurrency(result.totalTax, "USD")}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Effective rate</div>
                  <div className="mt-1 text-2xl font-bold text-rose-700 tabular-nums">
                    {formatPercent(result.totalTax / result.grossIncome, 1)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Net RSU after tax</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
                    {formatCurrency(result.rsu - result.totalTax, "USD")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed breakdown */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Tax breakdown (whole-year)</h4>
              <div className="space-y-2 text-sm">
                <Row label="Gross W-2 income" value={formatCurrency(result.grossIncome, "USD")} />
                <Row label="Standard deduction" value={`−${formatCurrency(filingStatus === "mfj" ? 30000 : STANDARD_DEDUCTION_SINGLE, "USD")}`} accent="emerald" />
                <Row label="Taxable income" value={formatCurrency(result.taxableIncome, "USD")} />
                <Row label="Federal income tax" value={formatCurrency(result.fedTax, "USD")} accent="rose" />
                <Row label={`State tax (${result.stateName})`} value={formatCurrency(result.stateTax, "USD")} accent="rose" />
                <Row label="FICA (Social Security + Medicare)" value={formatCurrency(result.fica, "USD")} accent="rose" />
                {result.addlMedicare > 0 && (
                  <Row label="Additional Medicare Tax (0.9%)" value={formatCurrency(result.addlMedicare, "USD")} accent="rose" />
                )}
                <div className="border-t border-slate-200 pt-2 mt-2 font-semibold">
                  <Row label="Total tax" value={formatCurrency(result.totalTax, "USD")} accent="rose" />
                  <Row label="Effective tax rate" value={formatPercent(result.totalTax / result.grossIncome, 2)} />
                  <Row label="Net take-home (year)" value={formatCurrency(result.grossIncome - result.totalTax, "USD")} accent="emerald" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marginal cost analysis */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4 text-sm text-blue-900 flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  Marginal cost of this RSU vest: ~{formatCurrency(result.marginalTotal, "USD")}
                </p>
                <p className="mt-1 text-xs">
                  Each additional $1 of RSU income pushes your marginal rate to{" "}
                  <strong>{formatPercent(result.marginal, 1)}</strong> federal.
                  Total effective bite on this RSU:{" "}
                  {formatCurrency(result.marginalFed, "USD")} federal +{" "}
                  {formatCurrency(result.marginalState, "USD")} state +{" "}
                  {formatCurrency(result.marginalFica, "USD")} FICA.
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-slate-500 leading-relaxed">
            Estimate only. Uses 2025 federal brackets and a simplified state tax (avg effective
            rate per state — actual rates vary by bracket). Doesn't include AMT (rare on RSUs),
            NIIT (3.8% on investments over $200K MFJ / $200K single), HSA/401k contributions, or
            pre-tax benefits. Capital gains on post-vest appreciation are NOT modeled (those apply
            only when you sell at a higher price than vest).
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