import Link from "next/link";
import type { Metadata } from "next";
import { listCountries } from "@/lib/data/country";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Countries — Global Tax Calculator",
  description: "Browse income tax calculators by country.",
};

export default async function CountriesIndexPage() {
  const countries = await listCountries();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Countries</h1>
      <p className="text-slate-600">{countries.length} countries supported. Click any country to see its 2025 tax brackets and try the calculator.</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => (
          <Link key={c.code} href={`/countries/${c.slug}/`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="text-xl">{c.flagEmoji}</span> {c.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-500">
                {c.region} · {c.defaultCurrency}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}