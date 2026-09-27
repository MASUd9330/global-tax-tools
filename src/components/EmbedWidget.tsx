"use client";

import { useEffect, useState, useMemo } from "react";
import { Loader2, ExternalLink, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EmbedCalcResult {
  result?: {
    totalTax?: number;
    federal?: { totalTax: number; marginalRate: number };
    state?: { totalTax: number; marginalRate: number } | null;
    effectiveRate: number;
  };
  meta?: {
    currency: string;
    noTax?: boolean;
  };
  error?: string;
}

interface Props {
  country: string; // ISO code, e.g. "US", "GB"
  state?: string;
  income?: number;
  theme?: "light" | "dark";
}

export function EmbedWidget({ country, state, income = 75000, theme = "light" }: Props) {
  const [incomeVal, setIncomeVal] = useState(income.toString());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EmbedCalcResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mark body as embed mode so root layout chrome (header/footer) hides via CSS.
  useEffect(() => {
    document.body.dataset.embed = "true";
    return () => {
      delete document.body.dataset.embed;
    };
  }, []);

  // Auto-postMessage to parent iframe for height sync (optional enhancement).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.self === window.top) return; // not in iframe
    const send = () => {
      const h = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: "taxrank-embed-height", height: h }, "*");
    };
    send();
    const ro = new ResizeObserver(send);
    ro.observe(document.body);
    const t = window.setInterval(send, 500);
    return () => {
      ro.disconnect();
      window.clearInterval(t);
    };
  }, [data]);

  const calc = async () => {
    setLoading(true);
    setError(null);
    try {
      const n = parseFloat(incomeVal);
      if (!isFinite(n) || n < 0) {
        throw new Error("Income must be a positive number");
      }
      const r = await fetch("/api/calculate/tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, state, income: n }),
      });
      const j = (await r.json()) as EmbedCalcResult;
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
      setData(j);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const numIncome = useMemo(() => {
    const n = parseFloat(incomeVal);
    return isFinite(n) && n >= 0 ? n : 0;
  }, [incomeVal]);

  const totalTax = (data?.result?.federal?.totalTax ?? 0) + (data?.result?.state?.totalTax ?? 0);
  const currency = data?.meta?.currency ?? "USD";
  const noTax = data?.meta?.noTax ?? totalTax === 0;

  const themeClass = theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900";

  return (
    <div className={`${themeClass} font-sans text-sm`}>
      <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          <span className="font-semibold text-sm">
            Tax Estimate — {country}{state ? ` (${state})` : ""}
          </span>
          <a
            href={`https://global-tax-tools.vercel.app/countries/${country.toLowerCase()}/tax/`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-blue-100 hover:text-white inline-flex items-center gap-1"
            title="View full breakdown on TaxRank"
          >
            Full breakdown <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <Label htmlFor="embed-income" className="text-xs uppercase tracking-wide text-slate-500">
              Annual Income
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="embed-income"
                type="number"
                min={0}
                step={5000}
                value={incomeVal}
                onChange={(e) => setIncomeVal(e.target.value)}
                className="flex-1"
              />
              <Button onClick={calc} disabled={loading} size="sm">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calculate"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">{error}</div>
          )}

          {data && !error && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {noTax ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-sm">
                  ✓ <strong>No income tax</strong> in this jurisdiction
                </div>
              ) : (
                <>
                  <Row label="Total Tax" value={`${currency} ${Math.round(totalTax).toLocaleString()}`} accent="rose" />
                  <Row label="Take-home" value={`${currency} ${Math.round(numIncome - totalTax).toLocaleString()}`} accent="emerald" />
                  <Row
                    label="Effective Rate"
                    value={`${((data.result?.effectiveRate ?? 0) * 100).toFixed(2)}%`}
                  />
                </>
              )}
              <p className="text-[10px] text-slate-500 pt-1">
                Estimate only. 2025 brackets.{" "}
                <a
                  href={`https://global-tax-tools.vercel.app/countries/${country.toLowerCase()}/tax/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-slate-700"
                >
                  View source data
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: "rose" | "emerald" }) {
  const color = accent === "rose" ? "text-rose-700" : accent === "emerald" ? "text-emerald-700" : "text-slate-900";
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
      <span className={`text-base font-semibold ${color}`}>{value}</span>
    </div>
  );
}