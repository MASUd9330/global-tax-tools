import type { Metadata } from "next";
import { TaxCalculator } from "@/components/TaxCalculator";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Income Tax Calculator — USA, UK, Germany, France, Canada",
  description:
    "Free progressive income tax calculator. Pick a country, enter your annual income, get an instant estimate with bracket breakdown and deductions.",
};

export default function TaxCalculatorPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Income Tax Calculator</h1>
        <p className="mt-2 text-slate-600">
          Estimate federal income tax across {`the world's`} biggest economies.
          Source-cited. Updated for 2025.
        </p>
      </div>

      <TaxCalculator />

      <Card>
        <CardContent className="pt-6 text-sm text-slate-600 space-y-2">
          <p>
            <strong>How it works:</strong> We apply your country&apos;s published tax brackets to your annual
            income, then subtract any standard deduction (e.g. UK Personal Allowance, US Standard Deduction).
          </p>
          <p>
            <strong>What this does NOT include:</strong> state/provincial tax (US states, Canadian provinces),
            capital gains, dividend tax, self-employment taxes, investment income. These are coming in later phases.
          </p>
          <p className="text-xs text-slate-500">
            Always confirm with a local tax professional — especially before filing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}