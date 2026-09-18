"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StateOption {
  code: string;
  slug: string;
  name: string;
  hasIncomeTax: boolean;
  taxType: string;
  topMarginalRate: number | null;
}

interface StateSelectorProps {
  countryCode: string;
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export function StateSelector({ countryCode, value, onChange, className }: StateSelectorProps) {
  const [states, setStates] = useState<StateOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!countryCode) return;
    setLoading(true);
    fetch(`/api/states?country=${countryCode}`)
      .then((r) => r.json())
      .then((d) => {
        setStates(d.states ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [countryCode]);

  const selected = states.find((s) => s.code === value);

  // Don't render for non-US countries (or countries with no states)
  if (countryCode !== "US" && states.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 text-sm hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      >
        <span className="flex items-center gap-2">
          {loading ? (
            "Loading states…"
          ) : selected ? (
            <>
              <span className="font-medium">{selected.name}</span>
              {!selected.hasIncomeTax && (
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                  NO TAX
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-500">Select state (optional)</span>
          )}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            <li
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 italic"
            >
              — No state / federal only —
            </li>
            {states.map((s) => (
              <li
                key={s.code}
                onClick={() => {
                  onChange(s.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50",
                  s.code === value && "bg-blue-50 font-medium"
                )}
              >
                <span>{s.name}</span>
                {s.hasIncomeTax ? (
                  <span className="ml-auto text-xs text-slate-500">
                    {s.taxType === "flat"
                      ? `flat ${(s.topMarginalRate! * 100).toFixed(2)}%`
                      : `top ${(s.topMarginalRate! * 100).toFixed(1)}%`}
                  </span>
                ) : (
                  <span className="ml-auto rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                    NO TAX
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}