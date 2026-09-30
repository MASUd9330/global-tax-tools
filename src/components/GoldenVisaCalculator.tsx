"use client";

import { useState, useMemo } from "react";
import { Loader2, TrendingDown, Globe, Clock } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { convertCurrency, CURRENCY_LIST } from "@/lib/currency";

/**
 * UAE Golden Visa Tax Savings Calculator
 *
 * Compares 10-year tax burden if you stay in your home country vs
 * moving to UAE on Golden Visa. Shows savings + breakeven on the
 * AED 2M investment (real estate route).
 *
 * Uses simplified 2025 marginal tax assumptions for each country.
 */

interface CountryTax {
  code: string;
  name: string;
  flag: string;
  // Effective + marginal rates at given income (simplified)
  effectiveRate: number;
  marginalRate: number;
}

const COUNTRIES: CountryTax[] = [
  { code: "US-CA", name: "USA (California)", flag: "🇺🇸", effectiveRate: 0.32, marginalRate: 0.50 },
  { code: "US-NY", name: "USA (New York)", flag: "🇺🇸", effectiveRate: 0.34, marginalRate: 0.52 },
  { code: "US-TX", name: "USA (Texas)", flag: "🇺🇸", effectiveRate: 0.22, marginalRate: 0.37 },
  { code: "US-FL", name: "USA (Florida)", flag: "🇺🇸", effectiveRate: 0.22, marginalRate: 0.37 },
  { code: "UK", name: "UK (England)", flag: "🇬🇧", effectiveRate: 0.36, marginalRate: 0.45 },
  { code: "DE", name: "Germany", flag: "🇩🇪", effectiveRate: 0.35, marginalRate: 0.45 },
  { code: "FR", name: "France", flag: "🇫🇷", effectiveRate: 0.34, marginalRate: 0.45 },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", effectiveRate: 0.37, marginalRate: 0.495 },
  { code: "AU", name: "Australia", flag: "🇦🇺", effectiveRate: 0.30, marginalRate: 0.45 },
  { code: "CA", name: "Canada (Ontario)", flag: "🇨🇦", effectiveRate: 0.25, marginalRate: 0.43 },
  { code: "IN", name: "India", flag: "🇮🇳", effectiveRate: 0.30, marginalRate: 0.42 },
  { code: "SG", name: "Singapore", flag: "🇸🇬", effectiveRate: 0.10, marginalRate: 0.22 },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", effectiveRate: 0.10, marginalRate: 0.17 },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", effectiveRate: 0.25, marginalRate: 0.45 },
  { code: "JP", name: "Japan", flag: "🇯🇵", effectiveRate: 0.20, marginalRate: 0.45 },
];

export function GoldenVisaCalculator() {
  const [income, setIncome] = useState("200000");
  const [countryCode, setCountryCode] = useState("US-CA");
  const [years, setYears] = useState("10");
  const [displayCurrency, setDisplayCurrency] = useState("USD");

  const num = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

  const result = useMemo(() => {
    const inc = num(income);
    const yrs = Math.max(1, Math.min(30, num(years)));
    if (inc <= 0) return null;
    const homeCountry = COUNTRIES.find((c) => c.code === countryCode)!;

    const annualTaxHome = inc * homeCountry.effectiveRate;
    const taxOverYearsHome = annualTaxHome * yrs;

    // UAE: 0% personal income tax
    const taxOverYearsUAE = 0;

    const savings = taxOverYearsHome - taxOverYearsUAE;
    const annualSavings = annualTaxHome;

    // Investment required for Golden Visa real estate route: AED 2M ≈ $545K
    // (varies by route — talent = $0, investor = $545K, business = $545K)
    const investmentRealEstate = 545000; // USD
    const breakevenYears = annualSavings > 0 ? investmentRealEstate / annualSavings : Infinity;

    // Daily savings for "aha" visualization
    const dailySavings = annualSavings / 365;

    return {
      inc,
      yrs,
      homeCountry,
      annualTaxHome,
      taxOverYearsHome,
      taxOverYearsUAE,
      savings,
      annualSavings,
      breakevenYears,
      investmentRealEstate,
      dailySavings,
    };
  }, [income, countryCode, years]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="gv-income">Annual gross income</Label>
          <Input
            id="gv-income"
            type="number"
            min={0}
            step={10000}
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="200000"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="gv-country">Home country (current)</Label>
          <select
            id="gv-country"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="mt-1.5 flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="gv-years">Years on Golden Visa</Label>
          <Input
            id="gv-years"
            type="number"
            min={1}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="10"
            className="mt-1.5"
          />
        </div>
      </div>

      {result && (
        <>
          {/* Headline savings */}
          <Card className="border-emerald-300 bg-gradient-to-br from-emerald-50 to-white">
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Annual tax saved
                  </div>
                  <div className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
                    {formatCurrency(result.annualSavings, displayCurrency)}
                  </div>
                  <div className="text-xs text-emerald-600 mt-0.5">
                    ≈ {formatCurrency(result.dailySavings, displayCurrency)}/day
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Total {result.yrs}-year savings
                  </div>
                  <div className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
                    {formatCurrency(result.savings, displayCurrency)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Breakeven on AED 2M
                  </div>
                  <div className="mt-1 text-2xl font-bold text-emerald-700 tabular-nums">
                    {result.breakevenYears === Infinity
                      ? "∞"
                      : `${result.breakevenYears.toFixed(1)} yr`}
                  </div>
                  <div className="text-xs text-emerald-600 mt-0.5">
                    real-estate route
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Side-by-side comparison */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  {result.homeCountry.flag} Stay in {result.homeCountry.name}
                </h4>
                <div className="space-y-2 text-sm">
                  <Row label="Effective tax rate" value={`${(result.homeCountry.effectiveRate * 100).toFixed(1)}%`} />
                  <Row label="Marginal tax rate" value={`${(result.homeCountry.marginalRate * 100).toFixed(1)}%`} />
                  <Row label="Annual tax" value={formatCurrency(result.annualTaxHome, displayCurrency)} accent="rose" />
                  <Row label={`${result.yrs}-year tax`} value={formatCurrency(result.taxOverYearsHome, displayCurrency)} accent="rose" />
                  <Row label="Net take-home (1 yr)" value={formatCurrency(result.inc - result.annualTaxHome, displayCurrency)} accent="emerald" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200">
              <CardContent className="pt-6">
                <h4 className="text-sm font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                  🇦🇪 UAE (Golden Visa)
                </h4>
                <div className="space-y-2 text-sm">
                  <Row label="Effective tax rate" value="0.00%" accent="emerald" />
                  <Row label="Marginal tax rate" value="0.00%" accent="emerald" />
                  <Row label="Annual tax" value={formatCurrency(0, displayCurrency)} accent="emerald" />
                  <Row label={`${result.yrs}-year tax`} value={formatCurrency(0, displayCurrency)} accent="emerald" />
                  <Row label="Net take-home (1 yr)" value={formatCurrency(result.inc, displayCurrency)} accent="emerald" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick insights */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4 text-sm text-blue-900 space-y-2">
              <p className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-blue-700" />
                <span>
                  After {result.breakevenYears === Infinity ? "infinite" : result.breakevenYears.toFixed(1)} years
                  on Golden Visa with the real estate route (AED 2M ≈ {formatCurrency(result.investmentRealEstate, displayCurrency)}),
                  you've recovered your investment — and every year after that is pure tax-free income.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Globe className="h-4 w-4 mt-0.5 shrink-0 text-blue-700" />
                <span>
                  Talent category (salary AED 30K+/month) requires <strong>$0</strong> investment —
                  immediate breakeven. Best for skilled professionals.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <TrendingDown className="h-4 w-4 mt-0.5 shrink-0 text-blue-700" />
                <span>
                  The {result.yrs}-year tax savings vs. staying home is{" "}
                  <strong>{formatCurrency(result.savings, displayCurrency)}</strong> — enough to buy
                  multiple investment properties, fund retirement, or live at a higher standard.
                </span>
              </p>
            </CardContent>
          </Card>

          <p className="text-xs text-slate-500 leading-relaxed">
            Estimate uses <strong>effective</strong> tax rates (avg tax across your full income) for
            each home country — actual rates depend on bracket placement, deductions, state/local
            taxes (US), social contributions (EU), and treaty relief. UAE corporate tax (9% on
            businesses above AED 375K profit) NOT modeled — applies only to business income.
            5% VAT applies to purchases in UAE. Consult a UAE specialist tax advisor for accurate
            comparison (typical cost AED 2,500-7,500 for personalized modeling).
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