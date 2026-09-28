"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CompareRow {
  id: string;          // e.g. "usa", "uae", "us-california"
  label: string;       // display name (e.g. "United States", "California")
  flag?: string;       // emoji
  takeHome: number;    // net income after tax
  totalTax: number;
  effectiveRate: number; // 0..1
  marginalRate: number;
  currency: string;
  href?: string;       // optional link to detail page
}

type SortKey = "takeHome" | "totalTax" | "effectiveRate" | "marginalRate" | "label";
type SortDir = "asc" | "desc";

interface Props {
  rows: CompareRow[];
  title?: string;
  defaultSort?: SortKey;
  defaultDir?: SortDir;
  showMedals?: boolean;
}

const DEFAULT_MEDAL_THRESHOLD = 3;

export function SortableComparison({
  rows,
  title = "Tax comparison",
  defaultSort = "takeHome",
  defaultDir = "desc",
  showMedals = true,
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>(defaultSort);
  const [sortDir, setSortDir] = useState<SortDir>(defaultDir);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      let cmp = 0;
      if (typeof av === "string" && typeof bv === "string") {
        cmp = av.localeCompare(bv);
      } else {
        cmp = (av as number) - (bv as number);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const click = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "label" ? "asc" : "desc");
    }
  };

  const medal = (i: number) => {
    if (!showMedals) return null;
    if (i === 0) return <Trophy className="h-4 w-4 text-yellow-500 inline" />;
    if (i === 1) return <Medal className="h-4 w-4 text-slate-400 inline" />;
    if (i === 2) return <Medal className="h-4 w-4 text-amber-600 inline" />;
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          {title}
          <span className="ml-auto text-xs font-normal text-slate-500">
            Click headers to sort · {rows.length} jurisdictions
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-2 w-12">#</th>
                <th
                  className="py-2 pr-4 cursor-pointer hover:bg-slate-50"
                  onClick={() => click("label")}
                >
                  Jurisdiction {sortKey === "label" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="py-2 pr-2 text-right cursor-pointer hover:bg-slate-50"
                  onClick={() => click("takeHome")}
                >
                  Take-home {sortKey === "takeHome" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="py-2 pr-2 text-right cursor-pointer hover:bg-slate-50"
                  onClick={() => click("totalTax")}
                >
                  Total Tax {sortKey === "totalTax" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="py-2 pr-2 text-right cursor-pointer hover:bg-slate-50"
                  onClick={() => click("effectiveRate")}
                >
                  Effective % {sortKey === "effectiveRate" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="py-2 text-right cursor-pointer hover:bg-slate-50"
                  onClick={() => click("marginalRate")}
                >
                  Marginal % {sortKey === "marginalRate" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr
                  key={r.id}
                  className={cn(
                    "border-b border-slate-100 transition-colors hover:bg-slate-50",
                    i < DEFAULT_MEDAL_THRESHOLD && showMedals && "bg-amber-50/30"
                  )}
                >
                  <td className="py-2 pr-2 font-mono text-xs text-slate-400">
                    {medal(i)} <span className="ml-1">{i + 1}</span>
                  </td>
                  <td className="py-2 pr-4">
                    {r.href ? (
                      <a href={r.href} className="text-blue-700 hover:underline font-medium">
                        {r.flag} {r.label}
                      </a>
                    ) : (
                      <span className="font-medium text-slate-900">
                        {r.flag} {r.label}
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-2 text-right tabular-nums font-semibold text-emerald-700">
                    {r.currency} {Math.round(r.takeHome).toLocaleString()}
                  </td>
                  <td className="py-2 pr-2 text-right tabular-nums text-rose-700">
                    {r.currency} {Math.round(r.totalTax).toLocaleString()}
                  </td>
                  <td className="py-2 pr-2 text-right tabular-nums">
                    {(r.effectiveRate * 100).toFixed(2)}%
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {(r.marginalRate * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showMedals && rows.length >= 3 && (
          <p className="mt-3 text-xs text-slate-500 flex items-center gap-2">
            <Trophy className="h-3 w-3 text-yellow-500" />
            <Medal className="h-3 w-3 text-slate-400" />
            <Medal className="h-3 w-3 text-amber-600" />
            Top 3 by take-home (lowest tax burden wins)
          </p>
        )}
      </CardContent>
    </Card>
  );
}