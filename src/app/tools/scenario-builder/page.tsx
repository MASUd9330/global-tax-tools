import type { Metadata } from "next";
import { ScenarioBuilder } from "@/components/ScenarioBuilder";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Tax Scenario Builder — Compare 2-4 Countries/States",
  description: "Interactive scenario builder. Compare income tax across 2-4 jurisdictions at the same salary. Useful for evaluating relocations and remote work.",
};

// Dynamic: avoid build-time DB
export const dynamic = "force-dynamic";

export default function ScenarioBuilderPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Tax Scenario Builder</h1>
        <p className="mt-2 text-slate-600">
          Compare 2-4 countries or states at the same income level. See which saves the most tax.
        </p>
      </div>

      <ScenarioBuilder initialIncome={150000} />

      <Card>
        <CardContent className="pt-6 text-sm text-slate-600 space-y-2">
          <p>
            <strong>Use cases:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            <li>Evaluating relocation options (US California vs Texas vs UAE)</li>
            <li>Remote work tax planning (US vs Singapore)</li>
            <li>Comparing job offers in different countries</li>
            <li>Year-end tax planning (compare your current vs alternative setup)</li>
          </ul>
          <p className="text-xs text-slate-500 mt-3">
            Calculator uses 2025 brackets. Excludes NHR/HK/foreign income exclusions, canton/kommune taxes, and other local variations. Estimate only.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}