import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getState, getStateTaxData, listStatesForCountry } from "@/lib/data/state";
import { getCountry } from "@/lib/data/country";
import { TaxCalculator } from "@/components/TaxCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { JsonLd, breadcrumbLd, softwareApplicationLd } from "@/components/JsonLd";

// Dynamic: DB queries happen at request time (avoids DATABASE_URL needed at build)
export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
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
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-emerald-50/30 to-white p-6 md:p-8">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xl font-bold shadow-md">
              {state.code}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{state.name} Income Tax Calculator</h1>
              <p className="mt-1 text-sm text-slate-600">
                United States · {state.taxType === "none" ? "No state income tax" : `${state.taxType} tax`}
                {state.topMarginalRate !== null && ` · top marginal ${formatPercent(state.topMarginalRate, 2)}`}
              </p>
              {state.description && (
                <p className="mt-3 max-w-3xl text-slate-700 leading-relaxed">{state.description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {state.taxType === "none" ? (
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700 font-medium">
                    ✓ No state income tax — keep 100% of federal take-home
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-amber-700 font-medium">
                    Adds to federal tax
                  </span>
                )}
                {taxData.standardDeduction > 0 && (
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 font-medium">
                    Standard deduction {formatCurrency(taxData.standardDeduction, country.defaultCurrency)}
                  </span>
                )}
                {taxData.sourceUrl && (
                  <a
                    href={taxData.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 font-medium hover:bg-slate-200"
                  >
                    State DOR ↗
                  </a>
                )}
                <Link
                  href={`/embed/US?state=${state.slug}&income=75000`}
                  className="inline-flex items-center rounded-md bg-blue-600 px-2.5 py-1 text-white font-medium hover:bg-blue-700"
                >
                  Embed widget
                </Link>
              </div>
            </div>
          </div>
        </div>
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