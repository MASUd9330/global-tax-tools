import type { Metadata } from "next";
import { TaxCalculator } from "@/components/TaxCalculator";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Salary Calculator — Take-Home Pay",
  description:
    "Calculate your take-home salary after income tax and social contributions. USA, UK, Germany, France, Canada.",
};

export default function SalaryCalculatorPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Salary Calculator</h1>
        <p className="mt-2 text-slate-600">
          Estimate your take-home pay after income tax and employee social contributions.
        </p>
      </div>

      <TaxCalculator />

      <Card>
        <CardContent className="pt-6 text-sm text-slate-600 space-y-2">
          <p>
            The calculator above returns federal income tax. The full salary breakdown (with employee social
            contributions like National Insurance, Sozialversicherung, or Social Security + Medicare) is
            available via the API at <code className="rounded bg-slate-100 px-1">POST /api/calculate/salary</code>.
          </p>
          <p className="text-xs text-slate-500">
            UI integration of the full salary breakdown is coming in Phase 1.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}