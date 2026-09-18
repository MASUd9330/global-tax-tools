"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CountryOption {
  code: string;
  slug: string;
  name: string;
  region: string;
  defaultCurrency: string;
  flagEmoji: string | null;
}

interface CountrySelectorProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export function CountrySelector({ value, onChange, className }: CountrySelectorProps) {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/countries")
      .then((r) => r.json())
      .then((d) => {
        setCountries(d.countries ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selected = countries.find((c) => c.code === value);

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
            "Loading…"
          ) : selected ? (
            <>
              <span className="text-base">{selected.flagEmoji}</span>
              <span className="font-medium">{selected.name}</span>
              <span className="text-slate-500 text-xs">({selected.defaultCurrency})</span>
            </>
          ) : (
            "Select country"
          )}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            {countries.map((c) => (
              <li
                key={c.code}
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50",
                  c.code === value && "bg-blue-50 font-medium"
                )}
              >
                <span className="text-base">{c.flagEmoji}</span>
                <span>{c.name}</span>
                <span className="ml-auto text-xs text-slate-500">{c.region}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}