"use client";

import { useState, useMemo } from "react";
import { ArrowRight, Loader2, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

/**
 * Netherlands 30% Ruling Calculator (2026)
 *
 * Computes the tax savings from the 30% ruling by:
 *   1. Calculating tax on full gross salary
 *   2. Calculating tax on (gross - 30%) — the "tax-free" portion excluded
 *   3. Showing the difference as savings
 *
 * Uses NL 2026 brackets (37% bracket on income > €75,518; 49.5% above €78,200).
 * Includes payroll credit (heffingskorting) up to €3,362 max.
 */

const NL_BRACKETS_2026 = [
  { lower: 0, upper: 75518, rate: 0.370 },
  { lower: 75518, upper: 78200, rate: 0.495 }, // 37% first + 49.5% excess = effective higher
  { lower: 78200, upper: null, rate: 0.495 },
];

const HEFFINGSKORTING_2026 = 3362; // payroll tax credit max

function calcNlTax(taxable: number, payrollCredit = HEFFINGSKORTING_2026): { tax: number; effectiveRate: number } {
  if (taxable <= 0) return { tax: 0, effectiveRate: 0 };
  let tax = 0;
  let lastLower = 0;
  for (const b of NL_BRACKETS_2026) {
    if (taxable > b.lower) {
      const upper = b.upper ?? Number.POSITIVE_INFINITY;
      const portion = Math.min(taxable, upper) - lastLower;
      tax += portion * b.rate;
      lastLower = b.lower;
      if (taxable <= upper) break;
    }
  }
  tax = Math.max(0, tax - payrollCredit);
  return { tax, effectiveRate: tax / taxable };
}

export function ThirtyPercentCalculator() {
  const [gross, setGross] = useState("80000");
  const [rulingPct, setRulingPct] = useState("30"); // 30 for 2026, 27 for 2027
  const num = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

  const result = useMemo(() => {
    const g = num(gross);
    if (g <= 0) return null;

    const pct = Math.min(70, Math.max(0, num(rulingPct)));
    const taxFree = g * (pct / 100);
    const taxable = g - taxFree;

    const fullTaxObj = calcNlTax(g);
    const ruledTaxable = taxable;
    const ruledTaxObj = calcNlTax(ruledTaxable);

    const savings = fullTaxObj.tax - ruledTaxObj.tax;
    const fiveYearSavings = savings * 5;
    const sevenYearTotal = (savings * 5) + (savings * 0.27 / 0.30) * 2; // rough 2027+ estimate

    return {
      gross: g,
      pct,
      taxFree,
      taxable,
      fullTax: fullTaxObj.tax,
      ruledTax: ruledTaxObj.tax,
      savings,
      fiveYearSavings,
      sevenYearTotal,
      effectiveRateNoRuling: fullTaxObj.effectiveRate,
      effectiveRateWithRuling: ruledTaxObj.tax / g,
    };
  }, [gross, rulingPct]);

  const formatEur = (n: number) => formatCurrency(n, "EUR");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="tpr-gross">Annual gross salary (EUR)</Label>
          <Input
            id="tpr-gross"
            type="number"
            min={0}
            step={1000}
            value={gross}
            onChange={(e) => setGross(e.target.value)}
            placeholder="80000"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="tpr-pct">Ruling %</Label>
          <select
            id="tpr-pct"
            value={rulingPct}
            onChange={(e) => setRulingPct(e.target.value)}
            className="mt-1.5 flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <option value="30">30% (2026 — last year at this rate)</option>
            <option value="27">27% (2027+ — new rate)</option>
            <option value="20">20% (custom — for partial rulings)</option>
            <option value="0">0% (no ruling)</option>
          </select>
        </div>
        <div className="flex items-end">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 leading-relaxed">
            Effective only if eligibility met: salary ≥ €48,013 (or €36,497 for under-30 with master's), 150km rule, etc.
          </div>
        </div>
      </div>

      {result && result.gross > 0 && (
        <>
          {/* Headline savings */}
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Annual savings</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
                    {formatEur(result.savings)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">5-year total</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
                    {formatEur(result.fiveYearSavings)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Effective rate reduction</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
                    {((result.effectiveRateNoRuling - result.effectiveRateWithRuling) * 100).toFixed(2)} pp
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed breakdown */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Without 30% ruling</h4>
                <div className="space-y-2 text-sm">
                  <Row label="Gross salary" value={formatEur(result.gross)} />
                  <Row label="Taxable income" value={formatEur(result.gross)} />
                  <Row label="Income tax (2026)" value={formatEur(result.fullTax)} accent="rose" />
                  <Row label="Effective rate" value={`${(result.effectiveRateNoRuling * 100).toFixed(2)}%`} />
                  <Row label="Take-home" value={formatEur(result.gross - result.fullTax)} accent="emerald" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200">
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold text-emerald-900 mb-3">
                  With {result.pct}% ruling
                </h4>
                <div className="space-y-2 text-sm">
                  <Row label="Gross salary" value={formatEur(result.gross)} />
                  <Row label={`Tax-free (${result.pct}%)`} value={formatEur(result.taxFree)} accent="emerald" />
                  <Row label="Taxable income" value={formatEur(result.taxable)} />
                  <Row label="Income tax (2026)" value={formatEur(result.ruledTax)} accent="rose" />
                  <Row label="Effective rate" value={`${(result.effectiveRateWithRuling * 100).toFixed(2)}%`} />
                  <Row label="Take-home" value={formatEur(result.gross - result.ruledTax)} accent="emerald" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4 text-sm text-blue-900 flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
              <p>
                <strong>5-year savings</strong> with the {result.pct}% ruling:{" "}
                <strong>{formatEur(result.fiveYearSavings)}</strong> in cumulative tax reduction
                (assuming salary stays constant — in practice salary growth makes the actual savings higher).
              </p>
            </CardContent>
          </Card>

          <div className="text-xs text-slate-500 leading-relaxed">
            Uses simplified NL 2026 brackets + payroll credit (max €3,362). Excludes Box 3 wealth tax
            (1.4-8.5% on deemed returns from savings/investments above €57,000), AOW/WW/WIA social
            security (~10.9% employee), and tax-free allowances for partner/spouse. For a complete
            picture consult a Dutch tax advisor (Belastingdienst or specialist firm).
          </div>
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