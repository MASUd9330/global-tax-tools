import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getCountry, getCountryTaxData, getLatestTaxYear } from "@/lib/data/country";
import { listStatesForCountry } from "@/lib/data/state";
import { TaxCalculator } from "@/components/TaxCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { JsonLd, breadcrumbLd, softwareApplicationLd } from "@/components/JsonLd";

interface PageProps {
  params: { code: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const country = await getCountry(params.code);
  if (!country) return { title: "Country not found" };
  return {
    title: `${country.name} Tax Calculator ${new Date().getFullYear()}`,
    description: country.description ?? `${country.name} income tax brackets and take-home salary calculator.`,
  };
}

export default async function CountryHubPage({ params }: PageProps) {
  const country = await getCountry(params.code);
  if (!country) notFound();

  const year = (await getLatestTaxYear(params.code)) ?? new Date().getFullYear();
  const taxData = await getCountryTaxData(params.code, year);
  const states = country.code === "US" ? await listStatesForCountry("US") : [];
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${base}/countries/${country.slug}`;

  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: base },
          { name: "Countries", url: `${base}/countries` },
          { name: country.name, url },
        ])}
      />
      <JsonLd
        data={softwareApplicationLd({
          name: `${country.name} Tax Calculator ${year}`,
          description: `Calculate ${country.name} federal income tax for ${year}.`,
          url,
        })}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/countries/" className="hover:text-slate-700">Countries</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">{country.name}</span>
      </nav>

      {/* Hero */}
      <div>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{country.flagEmoji}</span>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{country.name} Tax Calculator</h1>
            <div className="mt-1 flex flex-wrap gap-2 text-xs">
              <Badge>{country.region}</Badge>
              <Badge>{country.defaultCurrency}</Badge>
              <Badge>{country.taxSystem} tax</Badge>
              <Badge>{year} brackets</Badge>
            </div>
          </div>
        </div>
        {country.description && (
          <p className="mt-4 max-w-3xl text-slate-600">{country.description}</p>
        )}
      </div>

      {/* Calculator */}
      <TaxCalculator initialCountry={country.code} initialIncome={75000} />

      {/* States (US only) */}
      {states.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              US States — state tax varies widely
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {states.map((s) => (
                <Link
                  key={s.code}
                  href={`/us-state/${s.slug}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-blue-400 hover:bg-blue-50"
                >
                  <span className="font-medium text-slate-900">{s.name}</span>
                  <span className="text-xs text-slate-500">
                    {s.hasIncomeTax
                      ? s.taxType === "flat"
                        ? `flat ${(s.topMarginalRate! * 100).toFixed(2)}%`
                        : `top ${(s.topMarginalRate! * 100).toFixed(1)}%`
                      : "no state tax"}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brackets preview */}
      {taxData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {country.name} {year} Income Tax Brackets
            </CardTitle>
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
                      <td className="py-2 font-medium">{formatPercent(b.rate, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Source:{" "}
              {taxData.sourceUrl ? (
                <a className="text-blue-600 hover:underline" href={taxData.sourceUrl} target="_blank" rel="noopener noreferrer">
                  official tax authority
                </a>
              ) : "official tax authority"}
              . Last updated {new Date(taxData.lastUpdated).toLocaleDateString()}.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}