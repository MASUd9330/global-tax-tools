"use client";

import { useState, useMemo } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountrySelector } from "@/components/CountrySelector";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";

interface TaxApiResult {
  input: { country: { code: string; name: string; defaultCurrency: string }; year: number; income: number };
  meta: { sourceUrl: string | null; lastUpdated: string; currency: string };
  result: {
    grossIncome: number;
    taxableIncome: number;
    totalTax: number;
    effectiveRate: number;
    marginalRate: number;
    breakdown: Array<{ lower: number; upper: number | null; rate: number; amountInBracket: number; taxInBracket: number }>;
    deductionsApplied: Array<{ name: string; amount: number }>;
  };
}

interface Props {
  initialCountry?: string;
  initialIncome?: number;
}

export function TaxCalculator({ initialCountry = "US", initialIncome = 75000 }: Props) {
  const [country, setCountry] = useState(initialCountry);
  const [income, setIncome] = useState(initialIncome.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TaxApiResult | null>(null);

  const incomeNum = useMemo(() => {
    const n = parseFloat(income);
    return isFinite(n) && n >= 0 ? n : 0;
  }, [income]);

  const calculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calculate/tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, income: incomeNum }),
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
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="country">Country</Label>
              <CountrySelector value={country} onChange={setCountry} className="mt-1.5" />
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
                <span className="text-sm font-normal text-slate-500">— {data.input.year}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <Stat label="Gross Income" value={formatCurrency(data.result.grossIncome, currency)} />
                <Stat label="Taxable Income" value={formatCurrency(data.result.taxableIncome, currency)} />
                <Stat label="Total Tax" value={formatCurrency(data.result.totalTax, currency)} accent />
                <Stat label="Net Income" value={formatCurrency(data.result.grossIncome - data.result.totalTax, currency)} highlight />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 border-t border-slate-100 pt-4">
                <Stat label="Effective Rate" value={formatPercent(data.result.effectiveRate, 2)} />
                <Stat label="Marginal Rate" value={formatPercent(data.result.marginalRate, 0)} />
              </div>
            </CardContent>
          </Card>

          {data.result.deductionsApplied.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Deductions Applied</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-slate-100">
                  {data.result.deductionsApplied.map((d, i) => (
                    <li key={i} className="flex justify-between py-2 text-sm">
                      <span>{d.name}</span>
                      <span className="font-medium text-slate-700">
                        − {formatCurrency(d.amount, currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tax Bracket Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
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
                    {data.result.breakdown.map((b, i) => (
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
            </CardContent>
          </Card>

          <p className="text-xs text-slate-500">
            Source:{" "}
            {data.meta.sourceUrl ? (
              <a className="text-blue-600 hover:underline" href={data.meta.sourceUrl} target="_blank" rel="noopener noreferrer">
                official tax authority
              </a>
            ) : (
              "official tax authority"
            )}
            {" "}— last updated {new Date(data.meta.lastUpdated).toLocaleDateString()}.
            Estimate only — consult a tax professional for binding calculations.
          </p>
        </>
      )}
    </div>
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