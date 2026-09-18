import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCountry, getLatestTaxYear } from "@/lib/data/country";
import { TaxCalculator } from "@/components/TaxCalculator";

interface PageProps {
  params: { code: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const country = await getCountry(params.code);
  if (!country) return { title: "Country not found" };
  const year = (await getLatestTaxYear(params.code)) ?? new Date().getFullYear();
  return {
    title: `${country.name} Income Tax Calculator ${year}`,
    description: `Calculate ${country.name} federal income tax for ${year}. Brackets, deductions, and take-home pay.`,
  };
}

export default async function CountryTaxPage({ params }: PageProps) {
  const country = await getCountry(params.code);
  if (!country) notFound();
  const year = (await getLatestTaxYear(params.code)) ?? new Date().getFullYear();

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/countries/${country.slug}/`} className="hover:text-slate-700">
          {country.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">Tax calculator</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {country.flagEmoji} {country.name} Tax Calculator {year}
        </h1>
        <p className="mt-2 text-slate-600">
          Federal/national income tax only. See country hub for state/provincial breakdowns (Phase 1+).
        </p>
      </div>

      <TaxCalculator initialCountry={country.code} initialIncome={75000} />
    </div>
  );
}