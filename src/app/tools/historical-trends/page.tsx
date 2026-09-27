import type { Metadata } from "next";
import { HistoricalChart } from "@/components/HistoricalChart";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Historical Tax Trends — 2024 vs 2025 Comparison",
  description:
    "Compare your tax burden year-over-year. See how bracket changes, inflation indexing, and policy updates shifted what you actually pay.",
};

export const dynamic = "force-dynamic";

export default function HistoricalTrendsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Historical Tax Trends</h1>
        <p className="mt-2 text-slate-600">
          See how your tax burden changed from 2024 to 2025 at the same income level. Bracket
          inflation, policy updates, and threshold changes — visualised.
        </p>
      </div>

      <HistoricalChart />

      <Card>
        <CardContent className="pt-6 text-sm text-slate-600 space-y-2">
          <p>
            <strong>What this shows:</strong> For a given country + income, this compares the tax
            you'd pay under 2024 brackets vs 2025 brackets — holding everything else constant.
            Useful for understanding bracket creep and inflation indexing.
          </p>
          <p className="text-xs text-slate-500 pt-2">
            2024 data covers 14 countries with material bracket changes (G7 + common expat destinations).
            Countries without 2024 brackets are not shown. Excludes subnational taxes (US states, Canadian
            provinces, Swiss cantons).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}