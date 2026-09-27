"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface BracketItem {
  lower: number;
  upper: number | null;
  rate: number;
  amountInBracket: number;
  taxInBracket: number;
}

interface Props {
  income: number;
  currency: string;
  breakdown: BracketItem[];
}

// Color gradient: low rates → cool blue, high rates → warm red
function rateColor(rate: number): string {
  if (rate <= 0.10) return "#60a5fa"; // blue-400
  if (rate <= 0.15) return "#3b82f6"; // blue-500
  if (rate <= 0.22) return "#6366f1"; // indigo-500
  if (rate <= 0.28) return "#8b5cf6"; // violet-500
  if (rate <= 0.35) return "#a855f7"; // purple-500
  if (rate <= 0.40) return "#ec4899"; // pink-500
  return "#ef4444"; // red-500
}

export function BracketVisualization({ income, currency, breakdown }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Filter to only brackets that received income
  const filledBrackets = breakdown.filter((b) => b.amountInBracket > 0);
  const totalTax = breakdown.reduce((s, b) => s + b.taxInBracket, 0);
  const takeHome = income - totalTax;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="h-4 w-4" />
          How your income is taxed
          <span className="ml-auto text-xs font-normal text-slate-500">
            {formatCurrency(income, currency)} gross
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stacked horizontal bar — width = gross income */}
        <div className="relative">
          <div className="flex h-10 w-full rounded-lg overflow-hidden border border-slate-200 shadow-inner">
            {filledBrackets.map((b, i) => {
              const pct = (b.amountInBracket / income) * 100;
              const isHovered = hovered === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative cursor-pointer transition-all duration-150"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: rateColor(b.rate),
                    transform: isHovered ? "scaleY(1.1)" : "scaleY(1)",
                    filter: isHovered ? "brightness(1.1)" : "none",
                  }}
                  title={`${formatCurrency(b.amountInBracket, currency)} taxed at ${formatPercent(b.rate, 0)}`}
                />
              );
            })}
            {/* Take-home slice (no tax) — neutral */}
            {takeHome > 0 && income > totalTax && (
              <div
                className="bg-emerald-100 border-l border-emerald-300 flex items-center justify-center text-xs text-emerald-800 font-medium transition-all duration-150"
                style={{
                  width: `${(takeHome / income) * 100}%`,
                  filter: hovered === -1 ? "brightness(1.05)" : "none",
                }}
                onMouseEnter={() => setHovered(-1)}
                onMouseLeave={() => setHovered(null)}
                title={`${formatCurrency(takeHome, currency)} take-home (after tax)`}
              >
                {(takeHome / income) * 100 > 8 ? `${formatPercent(takeHome / income, 0)} take-home` : ""}
              </div>
            )}
          </div>

          {/* Hover tooltip */}
          {hovered !== null && (
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-xs rounded-md px-3 py-1.5 whitespace-nowrap pointer-events-none z-10 shadow-lg">
              {hovered === -1 ? (
                <>Take-home: <strong>{formatCurrency(takeHome, currency)}</strong></>
              ) : (
                <>
                  {filledBrackets[hovered] && (
                    <>
                      Rate <strong>{formatPercent(filledBrackets[hovered].rate, 0)}</strong> on{" "}
                      <strong>{formatCurrency(filledBrackets[hovered].amountInBracket, currency)}</strong>{" "}
                      = <strong>{formatCurrency(filledBrackets[hovered].taxInBracket, currency)}</strong>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Legend — bracket chips */}
        <div className="flex flex-wrap gap-2">
          {filledBrackets.map((b, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: rateColor(b.rate) }}
              />
              <span className="font-semibold text-slate-700">{formatPercent(b.rate, 0)}</span>
              <span className="text-slate-500">
                · {formatCurrency(b.amountInBracket, currency)}
              </span>
            </div>
          ))}
        </div>

        {/* Summary footer */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Total tax</div>
            <div className="text-lg font-bold text-rose-700 tabular-nums">
              {formatCurrency(totalTax, currency)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Take-home</div>
            <div className="text-lg font-bold text-emerald-700 tabular-nums">
              {formatCurrency(takeHome, currency)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Effective rate</div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {formatPercent(totalTax / income, 2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}