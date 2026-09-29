import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProvince, getProvinceTaxData } from "@/lib/data/province";
import { getCountry } from "@/lib/data/country";
import { TaxCalculator } from "@/components/TaxCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { JsonLd, breadcrumbLd, softwareApplicationLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { province: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const province = getProvince(params.province);
  if (!province) return { title: "Province not found" };
  return {
    title: `${province.name} Provincial Tax Calculator 2025`,
    description: province.description ?? `${province.name} provincial income tax brackets + federal calculation.`,
  };
}

export default async function ProvinceHubPage({ params }: PageProps) {
  const province = getProvince(params.province);
  if (!province) notFound();
  const taxData = getProvinceTaxData(params.province);
  if (!taxData) notFound();

  const country = getCountry("CA");
  if (!country) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${base}/canada/${province.slug}`;

  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: base },
          { name: "Canada", url: `${base}/countries/canada` },
          { name: province.name, url },
        ])}
      />
      <JsonLd
        data={softwareApplicationLd({
          name: `${province.name} Provincial Tax Calculator 2025`,
          description: `Calculate ${province.name} provincial + Canada federal tax combined.`,
          url,
        })}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/countries/canada" className="hover:text-slate-700">Canada</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">{province.name}</span>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-red-50/30 to-white p-6 md:p-8">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-red-100/40 blur-3xl" />
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white text-xl font-bold shadow-md">
              {province.code}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{province.name} Provincial Tax Calculator</h1>
              <p className="mt-1 text-sm text-slate-600">
                Canada · {province.taxType === "flat" ? "Flat-rate" : "Progressive"} provincial tax
                {province.topMarginalRate !== null && ` · top marginal ${formatPercent(province.topMarginalRate, 2)}`}
              </p>
              {province.description && (
                <p className="mt-3 max-w-3xl text-slate-700 leading-relaxed">{province.description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {province.hasIncomeTax ? (
                  <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-amber-700 font-medium">
                    Stacks on federal tax
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700 font-medium">
                    ✓ No provincial income tax
                  </span>
                )}
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 font-medium">
                  Basic personal amount {formatCurrency(province.standardDeduction, "CAD")}
                </span>
                {taxData.hasQuebecAbatement && (
                  <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-purple-700 font-medium">
                    Includes 16.5% Quebec abatement
                  </span>
                )}
                {taxData.sourceUrl && (
                  <a
                    href={taxData.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 font-medium hover:bg-slate-200"
                  >
                    {taxData.organization} ↗
                  </a>
                )}
                <Link
                  href={`/embed/CA?state=${province.slug}&income=75000`}
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
      <TaxCalculator initialCountry="CA" initialState={province.code} initialIncome={75000} />

      {/* Provincial brackets */}
      {taxData.brackets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {province.name} 2025 Provincial Tax Brackets
              <span className="ml-2 text-xs font-normal text-slate-500">
                stacked on federal brackets
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 font-medium">Income range (CAD)</th>
                    <th className="py-2 font-medium">Provincial rate</th>
                  </tr>
                </thead>
                <tbody>
                  {taxData.brackets.map((b, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-2">
                        {formatCurrency(b.lowerBound, "CAD")} – {b.upperBound === null ? "∞" : formatCurrency(b.upperBound, "CAD")}
                      </td>
                      <td className="py-2 font-medium">{formatPercent(b.rate, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Note: this shows provincial portion only. Combined federal + provincial rates stack — for example,
              a $100K earner in {province.name} pays federal tax (15-26%) + provincial tax ({" "}
              {taxData.brackets[0]?.rate ? formatPercent(taxData.brackets[0].rate, 2) : "see brackets"}
              {" "}) on the same income. Use the calculator above for the combined total.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Other provinces */}
      <OtherProvinces currentSlug={province.slug} />
    </div>
  );
}

async function OtherProvinces({ currentSlug }: { currentSlug: string }) {
  const { listProvinces } = await import("@/lib/data/province");
  const all = listProvinces();
  const others = all.filter((p) => p.slug !== currentSlug).slice(0, 8);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Other Canadian provinces</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {others.map((p) => (
            <Link
              key={p.code}
              href={`/canada/${p.slug}`}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-slate-900">{p.name}</div>
              <div className="text-xs text-slate-500">
                {p.hasIncomeTax
                  ? p.taxType === "flat"
                    ? `flat ${(p.topMarginalRate! * 100).toFixed(2)}%`
                    : `top ${(p.topMarginalRate! * 100).toFixed(1)}%`
                  : "no provincial tax"}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}