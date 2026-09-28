"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, PartyPopper } from "lucide-react";
import { calcTaxFreedomDay, formatFreedomDay } from "@/lib/calc/freedom";
import { formatCurrency } from "@/lib/utils";

interface Props {
  income: number;
  totalTax: number;
  displayCurrency: string;
  year?: number;
}

export function TaxFreedomDay({ income, totalTax, displayCurrency, year }: Props) {
  const result = calcTaxFreedomDay(income, totalTax, year);
  const dayOfYear = result.freedomDayOrdinal ?? 0;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Build a horizontal visualization: red bar = days worked for govt,
  // green bar = days worked for yourself
  const workedPct = result.percentOfYear * 100;
  const freePct = 100 - workedPct;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Tax Freedom Day
          <span className="ml-auto text-xs font-normal text-slate-500">
            When you stop "working for the government"
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {result.freedomDayOrdinal === null ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
            <PartyPopper className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-900">
                🎉 Tax Freedom Day is December 31, never reached
              </h4>
              <p className="mt-1 text-sm text-emerald-800">
                You keep 100% of your income. There's no "working for the government" period
                in {result.year}.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Headline */}
            <div className="text-center py-2">
              <div className="text-3xl font-bold text-slate-900">
                {formatFreedomDay(result)}
              </div>
              <p className="mt-1 text-sm text-slate-600">
                That's{" "}
                <strong>{result.daysWorkedForGovt} days</strong> of work — every year —
                just to pay taxes on income you'll earn over all 365.
              </p>
            </div>

            {/* Visualization: 365-day calendar year strip */}
            <div className="space-y-2">
              <div className="flex h-6 w-full rounded overflow-hidden border border-slate-200">
                {workedPct > 0 && (
                  <div
                    className="bg-gradient-to-r from-rose-500 to-rose-400 flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ width: `${workedPct}%` }}
                    title={`Worked for tax: ${result.daysWorkedForGovt} days`}
                  >
                    {workedPct > 12 ? `${result.daysWorkedForGovt}d` : ""}
                  </div>
                )}
                {freePct > 0 && (
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ width: `${freePct}%` }}
                    title={`Freedom: ${365 - result.daysWorkedForGovt} days`}
                  >
                    {freePct > 18 ? `${365 - result.daysWorkedForGovt}d free` : ""}
                  </div>
                )}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>Jan 1</span>
                <span>Apr 1</span>
                <span>Jul 1</span>
                <span>Oct 1</span>
                <span>Dec 31</span>
              </div>
            </div>

            {/* Comparison stats */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Effective Rate</div>
                <div className="text-lg font-bold text-rose-700 tabular-nums">
                  {(result.effectiveRate * 100).toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Tax Paid</div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">
                  {formatCurrency(result.totalTax, displayCurrency)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Year</div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">{result.year}</div>
              </div>
            </div>

            {/* Insight */}
            <p className="text-xs text-slate-500 leading-relaxed">
              Tax Freedom Day is a concept popularized by the Tax Foundation.
              It assumes you work each day to earn your income proportionally —
              so your taxes "consume" the first <strong>{result.daysWorkedForGovt}</strong> days of every year.
              See global rankings at <a href="https://taxfoundation.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">taxfoundation.org</a>.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}