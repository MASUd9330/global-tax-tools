"use client";

import { useState, useMemo } from "react";
import { ArrowRight, Loader2, Trophy, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScenarioResult {
  label: string;
  type: "country" | "state";
  countryCode: string;
  totalTax: number;
  netIncome: number;
  effectiveRate: number;
  marginalRate: number;
  noTax: boolean;
  currency: string;
}

interface Props {
  initialIncome?: number;
}

const PRESET_SCENARIOS = [
  {
    label: "US (California)",
    type: "state" as const,
    countryCode: "US",
    stateSlug: "california",
  },
  {
    label: "US (Texas, no state tax)",
    type: "state" as const,
    countryCode: "US",
    stateSlug: "texas",
  },
  {
    label: "UAE (no income tax)",
    type: "country" as const,
    countryCode: "AE",
  },
  {
    label: "Singapore (low tax)",
    type: "country" as const,
    countryCode: "SG",
  },
  {
    label: "UK",
    type: "country" as const,
    countryCode: "GB",
  },
  {
    label: "Portugal (NHR)",
    type: "country" as const,
    countryCode: "PT",
  },
  {
    label: "Germany",
    type: "country" as const,
    countryCode: "DE",
  },
];

export function ScenarioBuilder({ initialIncome = 150000 }: Props) {
  const [income, setIncome] = useState(initialIncome.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ScenarioResult[] | null>(null);

  const [selected, setSelected] = useState<string[]>(["0", "2", "3"]);

  const incomeNum = useMemo(() => {
    const n = parseFloat(income);
    return isFinite(n) && n >= 0 ? n : 0;
  }, [income]);

  const calculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const scenarios = selected.map((idx) => PRESET_SCENARIOS[parseInt(idx)]);
      const results: ScenarioResult[] = [];
      for (const s of scenarios) {
        const url = s.type === "country"
          ? "/api/calculate/tax"
          : "/api/calculate/tax";
        const body = s.type === "country"
          ? { country: s.countryCode, income: incomeNum }
          : { country: s.countryCode, state: s.stateSlug, income: incomeNum };
        const r = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!r.ok) {
          results.push({
            label: s.label, type: s.type, countryCode: s.countryCode,
            totalTax: 0, netIncome: 0, effectiveRate: 0, marginalRate: 0,
            noTax: true, currency: "USD",
          });
        } else {
          const j = await r.json();
          // Sum federal + state for total
          const fed = j.result?.federal?.totalTax ?? 0;
          const st = j.result?.state?.totalTax ?? 0;
          const total = (fed || 0) + (st || 0);
          results.push({
            label: s.label,
            type: s.type,
            countryCode: s.countryCode,
            totalTax: total,
            netIncome: incomeNum - total,
            effectiveRate: j.result?.effectiveRate ?? 0,
            marginalRate: j.result?.federal?.marginalRate ?? 0,
            noTax: total === 0,
            currency: j.meta?.currency ?? "USD",
          });
        }
      }
      setData(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const toggleScenario = (idx: string) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx].slice(0, 4)
    );
  };

  const winner = data && data.length > 0
    ? data.reduce((min, r) => (r.totalTax < min.totalTax ? r : min))
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" /> Scenario Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">
            Compare 2-4 tax scenarios at the same income level. Useful for evaluating relocations, remote work, or career moves.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="income">Annual Income (USD)</Label>
              <Input
                id="income"
                type="number"
                min={0}
                step={5000}
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="150000"
                className="mt-1.5"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={calculate} disabled={loading || selected.length < 2} className="w-full">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Calculating…</> : <>Compare {selected.length} scenarios <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Pick 2-4 scenarios:</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_SCENARIOS.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleScenario(String(i))}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    selected.includes(String(i))
                      ? "border-blue-500 bg-blue-50 text-blue-900 font-medium"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-sm text-red-700">{error}</CardContent>
        </Card>
      )}

      {data && data.length >= 2 && (
        <>
          {winner && (
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="pt-6 flex items-center gap-3">
                <Trophy className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-900">{winner.label} wins at this income</p>
                  <p className="text-sm text-emerald-700">
                    Saves up to <strong>{winner.currency} {Math.round(Math.abs(data[0].totalTax - winner.totalTax)).toLocaleString()}</strong> vs other scenarios
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
            {data.map((r, i) => {
              const isWinner = winner && r.totalTax === winner.totalTax && data.length > 1;
              return (
                <Card key={i} className={isWinner ? "border-emerald-300 bg-emerald-50/30" : ""}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      {isWinner && <Trophy className="h-4 w-4 text-emerald-600" />}
                      {r.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {r.noTax ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-sm">
                        ✓ <strong>No income tax</strong> in this jurisdiction
                      </div>
                    ) : (
                      <div className="space-y-3 text-sm">
                        <Row label="Total Tax" value={`${r.currency} ${Math.round(r.totalTax).toLocaleString()}`} accent="rose" />
                        <Row label="Take-home" value={`${r.currency} ${Math.round(r.netIncome).toLocaleString()}`} accent="emerald" />
                        <Row label="Effective Rate" value={`${(r.effectiveRate * 100).toFixed(2)}%`} />
                        <Row label="Marginal Rate" value={`${(r.marginalRate * 100).toFixed(1)}%`} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: "rose" | "emerald" }) {
  const color = accent === "rose" ? "text-rose-700" : accent === "emerald" ? "text-emerald-700" : "text-slate-900";
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}