"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CURRENCY_LIST, type CurrencyInfo } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface Props {
  value: string; // currency code
  onChange: (code: string) => void;
  className?: string;
}

export function CurrencySelector({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const selected: CurrencyInfo | undefined = CURRENCY_LIST.find((c) => c.code === value);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 text-sm hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="flex items-center gap-2">
          {selected ? (
            <>
              <span className="text-base">{selected.flag}</span>
              <span className="font-medium">{selected.code}</span>
              <span className="text-slate-500 text-xs">{selected.symbol}</span>
            </>
          ) : (
            "Select currency"
          )}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            {CURRENCY_LIST.map((c) => (
              <li
                key={c.code}
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-blue-50",
                  c.code === value && "bg-blue-50 font-medium"
                )}
              >
                <span className="text-base">{c.flag}</span>
                <span className="font-medium">{c.code}</span>
                <span className="text-slate-600 truncate">{c.name}</span>
                <span className="ml-auto text-xs text-slate-500">{c.symbol}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}