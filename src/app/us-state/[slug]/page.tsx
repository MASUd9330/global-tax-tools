import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getState, getStateTaxData, listStatesForCountry } from "@/lib/data/state";
import { getCountry } from "@/lib/data/country";
import { TaxCalculator } from "@/components/TaxCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { JsonLd, breadcrumbLd, softwareApplicationLd } from "@/components/JsonLd";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const states = await listStatesForCountry("US");
  return states.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const state = await getState("US", params.slug);
  if (!state) return { title: "State not found" };
  return {
    title: `${state.name} Income Tax Calculator ${new Date().getFullYear()}`,
    description: state.description ?? `${state.name} state income tax brackets and calculator.`,
  };
}

export default async function StateHubPage({ params }: PageProps) {
  const state = await getState("US", params.slug);
  if (!state) notFound();
  const country = await getCountry("US");
  if (!country) notFound();
  const taxData = await getStateTaxData("US", params.slug);
  if (!taxData) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${base}/us-state/${state.slug}`;

  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: base },
          { name: "USA", url: `${base}/countries/usa` },
          { name: state.name, url },
        ])}
      />
      <JsonLd
        data={softwareApplicationLd({
          name: `${state.name} Income Tax Calculator`,
          description: `Calculate ${state.name} state income tax (combined with federal).`,
          url,
        })}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/countries/usa" className="hover:text-slate-700">USA</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">{state.name}</span>
      </nav>

      {/* Hero */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {state.name} Income Tax Calculator
        </h1>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <Badge>{state.code}</Badge>
          <Badge>{state.taxType === "none" ? "No state income tax" : state.taxType}</Badge>
          {state.topMarginalRate !== null && (
            <Badge>top {formatPercent(state.topMarginalRate, 1)}</Badge>
          )}
          <Badge>combined with federal</Badge>
        </div>
        {state.description && (
          <p className="mt-4 max-w-3xl text-slate-600">{state.description}</p>
        )}
      </div>

      {/* Calculator */}
      <TaxCalculator initialCountry="US" initialState={state.code} initialIncome={75000} />

      {/* State brackets */}
      {taxData.brackets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{state.name} {new Date().getFullYear()} Tax Brackets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 font-medium">Income range</th>
                    <th className="py-2 font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {taxData.brackets.map((b, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-2">
                        {formatCurrency(b.lowerBound, country.defaultCurrency)} –{" "}
                        {b.upperBound === null ? "∞" : formatCurrency(b.upperBound, country.defaultCurrency)}
                      </td>
                      <td className="py-2 font-medium">{formatPercent(b.rate, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {taxData.standardDeduction > 0 && (
              <p className="mt-3 text-xs text-slate-500">
                {state.name} standard deduction: {formatCurrency(taxData.standardDeduction, country.defaultCurrency)}
              </p>
            )}
            {taxData.sourceUrl && (
              <p className="mt-2 text-xs text-slate-500">
                Source:{" "}
                <a className="text-blue-600 hover:underline" href={taxData.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {state.name} tax authority
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Other states */}
      <OtherStates currentSlug={state.slug} />
    </div>
  );
}

async function OtherStates({ currentSlug }: { currentSlug: string }) {
  const allStates = await listStatesForCountry("US");
  const others = allStates.filter((s) => s.slug !== currentSlug).slice(0, 8);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Compare with other states</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {others.map((s) => (
            <Link
              key={s.code}
              href={`/us-state/${s.slug}`}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-blue-400 hover:bg-blue-50"
            >
              <div className="font-medium text-slate-900">{s.name}</div>
              <div className="text-xs text-slate-500">
                {s.hasIncomeTax
                  ? s.taxType === "flat"
                    ? `flat ${(s.topMarginalRate! * 100).toFixed(2)}%`
                    : `top ${(s.topMarginalRate! * 100).toFixed(1)}%`
                  : "no state tax"}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}