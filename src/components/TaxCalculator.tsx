"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountrySelector } from "@/components/CountrySelector";
import { StateSelector } from "@/components/StateSelector";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";

interface TaxBreakdownItem {
  lower: number;
  upper: number | null;
  rate: number;
  amountInBracket: number;
  taxInBracket: number;
}

interface TaxResult {
  grossIncome: number;
  taxableIncome: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  breakdown: TaxBreakdownItem[];
  deductionsApplied: Array<{ name: string; amount: number }>;
}

interface TaxApiResult {
  input: {
    country: { code: string; name: string; defaultCurrency: string };
    state: { code: string; name: string; taxType: string } | null;
    year: number;
    income: number;
  };
  meta: {
    sourceUrl: string | null;
    stateSourceUrl: string | null;
    lastUpdated: string;
    currency: string;
  };
  result: {
    federal: TaxResult;
    state: TaxResult | null;
    grossIncome: number;
    totalTax: number;
    effectiveRate: number;
    netIncome: number;
  };
}

interface Props {
  initialCountry?: string;
  initialState?: string;
  initialIncome?: number;
}

export function TaxCalculator({ initialCountry = "US", initialState = "CA", initialIncome = 75000 }: Props) {
  const [country, setCountry] = useState(initialCountry);
  const [state, setState] = useState(initialState);
  const [income, setIncome] = useState(initialIncome.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TaxApiResult | null>(null);

  // Reset state when country changes
  useEffect(() => {
    if (country !== "US") setState("");
  }, [country]);

  const incomeNum = useMemo(() => {
    const n = parseFloat(income);
    return isFinite(n) && n >= 0 ? n : 0;
  }, [income]);

  const calculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { country, income: incomeNum };
      if (state && country === "US") body.state = state;
      const res = await fetch("/api/calculate/tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Calculation failed");
      }
      const j = await res.json();
      setData(j);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const currency = data?.meta.currency ?? "USD";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Income Tax Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="country">Country</Label>
              <CountrySelector value={country} onChange={setCountry} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="state">State / Region</Label>
              <StateSelector countryCode={country} value={state} onChange={setState} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="income">Annual Income</Label>
              <Input
                id="income"
                type="number"
                min={0}
                step={1000}
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="75000"
                className="mt-1.5"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Filing: single. Latest published tax year used.
            </p>
            <Button onClick={calculate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Calculating…
                </>
              ) : (
                <>
                  Calculate <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-sm text-red-700">{error}</CardContent>
        </Card>
      )}

      {data && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{data.input.country.name}</span>
                {data.input.state && (
                  <span className="text-slate-500">/ {data.input.state.name}</span>
                )}
                <span className="text-sm font-normal text-slate-500">— {data.input.year}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <Stat label="Gross Income" value={formatCurrency(data.result.grossIncome, currency)} />
                <Stat label="Total Tax" value={formatCurrency(data.result.totalTax, currency)} accent />
                <Stat label="Net Income" value={formatCurrency(data.result.netIncome, currency)} highlight />
                <Stat label="Effective Rate" value={formatPercent(data.result.effectiveRate, 2)} />
              </div>
              {data.result.state && data.input.state && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Stat label="Federal Tax" value={formatCurrency(data.result.federal.totalTax, currency)} />
                    <Stat label={`${data.input.state.name} Tax`} value={formatCurrency(data.result.state.totalTax, currency)} />
                    <Stat label="Combined Effective" value={formatPercent(data.result.effectiveRate, 2)} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Federal breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Federal Bracket Breakdown
                <span className="ml-2 text-xs font-normal text-slate-500">
                  marginal {formatPercent(data.result.federal.marginalRate, 0)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BracketTable breakdown={data.result.federal.breakdown} deductions={data.result.federal.deductionsApplied} currency={currency} />
            </CardContent>
          </Card>

          {/* State breakdown */}
          {data.result.state && data.input.state && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {data.input.state.name} Bracket Breakdown
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    marginal {formatPercent(data.result.state.marginalRate, 0)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BracketTable breakdown={data.result.state.breakdown} deductions={data.result.state.deductionsApplied} currency={currency} />
              </CardContent>
            </Card>
          )}

          <p className="text-xs text-slate-500">
            Sources:{" "}
            {data.meta.sourceUrl && (
              <a className="text-blue-600 hover:underline" href={data.meta.sourceUrl} target="_blank" rel="noopener noreferrer">
                federal
              </a>
            )}
            {data.meta.stateSourceUrl && (
              <>
                {", "}
                <a className="text-blue-600 hover:underline" href={data.meta.stateSourceUrl} target="_blank" rel="noopener noreferrer">
                  {data.input.state?.name.toLowerCase()}
                </a>
              </>
            )}
            {" "}— last updated {new Date(data.meta.lastUpdated).toLocaleDateString()}.
            Estimate only — consult a tax professional for binding calculations.
          </p>
        </>
      )}
    </div>
  );
}

function BracketTable({
  breakdown,
  deductions,
  currency,
}: {
  breakdown: TaxBreakdownItem[];
  deductions: Array<{ name: string; amount: number }>;
  currency: string;
}) {
  return (
    <>
      {deductions.length > 0 && (
        <ul className="mb-3 divide-y divide-slate-100 border-b border-slate-100">
          {deductions.map((d, i) => (
            <li key={i} className="flex justify-between py-1.5 text-sm">
              <span className="text-slate-600">{d.name}</span>
              <span className="font-medium text-slate-700">− {formatCurrency(d.amount, currency)}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 font-medium">Bracket</th>
              <th className="py-2 font-medium">Rate</th>
              <th className="py-2 text-right font-medium">In Bracket</th>
              <th className="py-2 text-right font-medium">Tax</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((b, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2">
                  {formatCurrency(b.lower, currency)} – {b.upper === null ? "∞" : formatCurrency(b.upper, currency)}
                </td>
                <td className="py-2">{formatPercent(b.rate, 0)}</td>
                <td className="py-2 text-right tabular-nums">{formatNumber(b.amountInBracket)}</td>
                <td className="py-2 text-right font-medium tabular-nums">
                  {formatCurrency(b.taxInBracket, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Stat({ label, value, accent, highlight }: { label: string; value: string; accent?: boolean; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-3 ${highlight ? "bg-emerald-50" : accent ? "bg-rose-50" : "bg-slate-50"}`}>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-xl font-semibold ${highlight ? "text-emerald-700" : accent ? "text-rose-700" : "text-slate-900"}`}>
        {value}
      </div>
    </div>
  );
}