"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { CountrySelector } from "@/components/CountrySelector";

interface HistoricalResponse {
  country: { code: string; name: string; currency: string };
  income: number;
  year2024: { tax: number; effectiveRate: number; marginalRate: number; available: boolean };
  year2025: { tax: number; effectiveRate: number; marginalRate: number; bracketCount: number };
  delta: { tax: number; effectiveRatePp: number; direction: "up" | "down" | "flat" };
  summary: string;
}

const COUNTRY_OPTIONS = ["US", "GB", "DE", "FR", "CA", "AU", "JP", "IT", "ES", "NL", "IE", "CH", "PT", "SG"];

export function HistoricalChart() {
  const [country, setCountry] = useState("US");
  const [income, setIncome] = useState("100000");
  const [data, setData] = useState<HistoricalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const n = parseFloat(income);
      if (!isFinite(n) || n < 0) throw new Error("Income must be positive");
      const r = await fetch("/api/historical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, income: n }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
      setData(j);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Auto-load on first mount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DirectionIcon = data?.delta.direction === "up" ? TrendingUp : data?.delta.direction === "down" ? TrendingDown : Minus;
  const directionColor = data?.delta.direction === "up" ? "text-rose-600" : data?.delta.direction === "down" ? "text-emerald-600" : "text-slate-500";
  const directionBg = data?.delta.direction === "up" ? "bg-rose-50" : data?.delta.direction === "down" ? "bg-emerald-50" : "bg-slate-50";

  // Bar chart math: max bar = max(2024, 2025), normalize to 100%
  const maxTax = data ? Math.max(data.year2024.tax, data.year2025.tax, 1) : 0;
  const w2024 = data ? (data.year2024.tax / maxTax) * 100 : 0;
  const w2025 = data ? (data.year2025.tax / maxTax) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>2024 vs 2025 Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="hist-country">Country</Label>
              <CountrySelector value={country} onChange={setCountry} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="hist-income">Annual Income (USD)</Label>
              <Input
                id="hist-income"
                type="number"
                min={0}
                step={5000}
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchData} disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Compare"}
              </Button>
            </div>
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
              <CardTitle className="text-base">
                {data.country.name} — at {data.country.currency} {Math.round(data.income).toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!data.year2024.available ? (
                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-600">
                  2024 historical data not available for this country. Only 2025 shown.
                </div>
              ) : (
                <>
                  {/* Direction summary */}
                  <div className={`${directionBg} rounded-lg p-4 flex items-start gap-3`}>
                    <DirectionIcon className={`h-5 w-5 mt-0.5 ${directionColor}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{data.summary}</p>
                    </div>
                  </div>

                  {/* Bar chart */}
                  <div className="space-y-3">
                    <Bar
                      year={2024}
                      tax={data.year2024.tax}
                      effectiveRate={data.year2024.effectiveRate}
                      marginalRate={data.year2024.marginalRate}
                      width={w2024}
                      currency={data.country.currency}
                      color="bg-slate-400"
                    />
                    <Bar
                      year={2025}
                      tax={data.year2025.tax}
                      effectiveRate={data.year2025.effectiveRate}
                      marginalRate={data.year2025.marginalRate}
                      width={w2025}
                      currency={data.country.currency}
                      color={data.delta.direction === "up" ? "bg-rose-500" : data.delta.direction === "down" ? "bg-emerald-500" : "bg-slate-500"}
                    />
                  </div>

                  {/* Detail table */}
                  <div className="overflow-x-auto border-t border-slate-100 pt-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                          <th className="py-2">Year</th>
                          <th className="py-2 text-right">Tax</th>
                          <th className="py-2 text-right">Effective</th>
                          <th className="py-2 text-right">Marginal</th>
                          <th className="py-2 text-right">Δ vs prior</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="py-2 font-medium">2024</td>
                          <td className="py-2 text-right tabular-nums">{data.country.currency} {Math.round(data.year2024.tax).toLocaleString()}</td>
                          <td className="py-2 text-right tabular-nums">{(data.year2024.effectiveRate * 100).toFixed(2)}%</td>
                          <td className="py-2 text-right tabular-nums">{(data.year2024.marginalRate * 100).toFixed(1)}%</td>
                          <td className="py-2 text-right text-slate-400">—</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">2025</td>
                          <td className="py-2 text-right tabular-nums font-medium">{data.country.currency} {Math.round(data.year2025.tax).toLocaleString()}</td>
                          <td className="py-2 text-right tabular-nums">{(data.year2025.effectiveRate * 100).toFixed(2)}%</td>
                          <td className="py-2 text-right tabular-nums">{(data.year2025.marginalRate * 100).toFixed(1)}%</td>
                          <td className={`py-2 text-right tabular-nums font-medium ${directionColor}`}>
                            {data.delta.direction === "flat" ? "—" : `${data.delta.direction === "up" ? "+" : "−"}${data.country.currency} ${Math.abs(Math.round(data.delta.tax)).toLocaleString()}`}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Why this changed</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 space-y-2">
              <p>
                Most countries index brackets annually for inflation. When brackets rise faster than wages,
                marginal rates effectively fall. When inflation is high and brackets lag, taxpayers get{" "}
                <em>bracket creep</em> — higher real rates without any rate hike.
              </p>
              <p className="text-xs text-slate-500 pt-2">
                2024 brackets sourced from each country's official 2024 tax bracket publication. Estimate only — verify with current source.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function Bar({
  year,
  tax,
  effectiveRate,
  marginalRate,
  width,
  currency,
  color,
}: {
  year: number;
  tax: number;
  effectiveRate: number;
  marginalRate: number;
  width: number;
  currency: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5 text-sm">
        <span className="font-medium text-slate-700">{year}</span>
        <span className="text-slate-600 tabular-nums">
          {currency} {Math.round(tax).toLocaleString()}{" "}
          <span className="text-xs text-slate-500">
            ({(effectiveRate * 100).toFixed(2)}% eff · {(marginalRate * 100).toFixed(0)}% marg)
          </span>
        </span>
      </div>
      <div className="h-8 bg-slate-100 rounded relative overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500 rounded`}
          style={{ width: `${Math.max(width, 2)}%` }}
        />
      </div>
    </div>
  );
}