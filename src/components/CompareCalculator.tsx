"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";

interface SideResult {
  side: { type: string; slug: string; name: string };
  grossIncome: number;
  taxableIncome: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  brackets: Array<{ lower: number; upper: number | null; rate: number }>;
  currency: string;
  noTax: boolean;
}

interface Props {
  leftName: string;
  rightName: string;
  leftHref: string;
  rightHref: string;
  initialResult: {
    income: number;
    left: SideResult;
    right: SideResult;
  };
}

export function CompareCalculator({ leftName, rightName, leftHref, rightHref, initialResult }: Props) {
  const [income, setIncome] = useState(initialResult.income.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(initialResult);

  const incomeNum = useMemo(() => {
    const n = parseFloat(income);
    return isFinite(n) && n >= 0 ? n : 0;
  }, [income]);

  const calculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pair: `${initialResult.left.side.slug}-vs-${initialResult.right.side.slug}`, income: incomeNum }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Comparison failed");
      }
      const j = await res.json();
      setData(j);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const left = data.left;
  const right = data.right;
  const leftWins = left.totalTax < right.totalTax;
  const rightWins = right.totalTax < left.totalTax;
  const tie = left.totalTax === right.totalTax;
  const currency = left.currency; // assume same currency for comparison

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compare income tax at any salary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Label htmlFor="income">Annual Income ({currency})</Label>
              <Input
                id="income"
                type="number"
                min={0}
                step={1000}
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="100000"
                className="mt-1.5"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={calculate} disabled={loading} className="w-full">
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Calculating…</>
                ) : (
                  <>Compare <ArrowRight className="h-4 w-4" /></>
                )}
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

      {/* Winner banner */}
      <Card className={tie ? "bg-slate-50" : leftWins ? "bg-emerald-50 border-emerald-200" : "bg-emerald-50 border-emerald-200"}>
        <CardContent className="pt-6">
          {tie ? (
            <p className="text-center text-slate-700">
              <strong>Tie!</strong> Both {leftName} and {rightName} have the same total tax at {currency} {incomeNum.toLocaleString()}.
            </p>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Trophy className="h-6 w-6 text-emerald-600" />
              <p className="text-center text-emerald-900">
                <strong>{leftWins ? leftName : rightName}</strong> wins at this income — saves{" "}
                <strong>{currency} {Math.abs(left.totalTax - right.totalTax).toFixed(0)}</strong>{" "}
                ({((Math.abs(left.effectiveRate - right.effectiveRate)) * 100).toFixed(2)}pp lower effective rate).
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Side-by-side stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <SideCard name={leftName} href={leftHref} result={left} accent="blue" />
        <SideCard name={rightName} href={rightHref} result={right} accent="blue" />
      </div>

      {/* Visual comparison bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Effective Tax Rate Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Bar label={leftName} value={left.effectiveRate} maxValue={Math.max(left.effectiveRate, right.effectiveRate, 0.01)} color={leftWins ? "bg-emerald-500" : "bg-blue-500"} />
            <Bar label={rightName} value={right.effectiveRate} maxValue={Math.max(left.effectiveRate, right.effectiveRate, 0.01)} color={rightWins ? "bg-emerald-500" : "bg-blue-500"} />
          </div>
        </CardContent>
      </Card>

      {/* Brackets side-by-side */}
      <div className="grid gap-4 md:grid-cols-2">
        <BracketCard name={leftName} brackets={left.brackets} noTax={left.noTax} currency={currency} />
        <BracketCard name={rightName} brackets={right.brackets} noTax={right.noTax} currency={currency} />
      </div>
    </div>
  );
}

function SideCard({ name, href, result, accent }: { name: string; href: string; result: SideResult; accent: "blue" | "green" }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Link href={href} className="text-base hover:underline">{name}</Link>
          {result.noTax && <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">NO TAX</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Total Tax" value={formatCurrency(result.totalTax, result.currency)} accent="rose" />
          <Stat label="Net Income" value={formatCurrency(result.grossIncome - result.totalTax, result.currency)} accent="emerald" />
          <Stat label="Effective Rate" value={formatPercent(result.effectiveRate, 2)} />
          <Stat label="Marginal Rate" value={formatPercent(result.marginalRate, 0)} />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: "rose" | "emerald" }) {
  const color = accent === "rose" ? "text-rose-700" : accent === "emerald" ? "text-emerald-700" : "text-slate-900";
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function Bar({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
  const pct = (value / maxValue) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-600">{(value * 100).toFixed(2)}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-3 rounded-full transition-all ${color}`} style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
    </div>
  );
}

function BracketCard({ name, brackets, noTax, currency }: { name: string; brackets: Array<{ lower: number; upper: number | null; rate: number }>; noTax: boolean; currency: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{name} Brackets</CardTitle>
      </CardHeader>
      <CardContent>
        {noTax ? (
          <div className="text-sm text-slate-600 bg-emerald-50 border border-emerald-200 rounded p-3">
            ✓ {name} has no state/regional income tax.
          </div>
        ) : brackets.length === 0 ? (
          <p className="text-sm text-slate-500">No bracket data available.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-1 font-medium">Bracket</th>
                <th className="py-1 text-right font-medium">Rate</th>
              </tr>
            </thead>
            <tbody>
              {brackets.map((b, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-1.5 tabular-nums">
                    {formatCurrency(b.lower, currency)} – {b.upper === null ? "∞" : formatCurrency(b.upper, currency)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums font-medium">{formatPercent(b.rate, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}