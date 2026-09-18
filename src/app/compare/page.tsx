import Link from "next/link";
import type { Metadata } from "next";
import { getPopularComparisons } from "@/lib/data/compare";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Compare Income Tax Across Countries & States",
  description: "Side-by-side income tax comparisons between countries and US states. Find the lower-tax option at any salary.",
};

export default async function CompareIndexPage() {
  const popular = await getPopularComparisons();

  // Group by type
  const usStatePairs = popular.filter((p) => {
    const [a, b] = p.split("-vs-");
    const stateSlugs = ["california", "new-york", "texas", "florida", "illinois", "pennsylvania", "ohio", "georgia", "north-carolina", "michigan", "new-jersey", "virginia", "washington", "arizona", "massachusetts", "indiana", "maryland", "missouri", "wisconsin", "colorado", "minnesota", "south-carolina", "alabama", "louisiana", "tennessee", "alaska", "nevada", "south-dakota", "wyoming"];
    return stateSlugs.includes(a) && stateSlugs.includes(b);
  });
  const countryPairs = popular.filter((p) => {
    const [a, b] = p.split("-vs-");
    return !usStatePairs.some((sp) => sp === p) && (!a.includes("-") || a === "united-states");
  });
  const mixedPairs = popular.filter((p) => !usStatePairs.includes(p) && !countryPairs.includes(p));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Compare Income Tax</h1>
        <p className="mt-2 text-slate-600">
          Side-by-side tax comparisons. Find which location keeps more of your income.
        </p>
      </div>

      {countryPairs.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Country vs Country</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {countryPairs.map((p) => (
              <CompareCard key={p} pair={p} />
            ))}
          </div>
        </section>
      )}

      {usStatePairs.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-slate-900">US State vs State</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {usStatePairs.map((p) => (
              <CompareCard key={p} pair={p} />
            ))}
          </div>
        </section>
      )}

      {mixedPairs.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Country vs State</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mixedPairs.map((p) => (
              <CompareCard key={p} pair={p} />
            ))}
          </div>
        </section>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Want more comparisons?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Just visit any <code className="rounded bg-slate-100 px-1">/compare/[a]-vs-[b]/</code> URL — works for any country, US state, or country-vs-state combo.
            Try: <Link href="/compare/usa-vs-uae" className="text-blue-600 hover:underline">/compare/usa-vs-uae</Link>,{" "}
            <Link href="/compare/california-vs-uk" className="text-blue-600 hover:underline">/compare/california-vs-uk</Link>,{" "}
            <Link href="/compare/germany-vs-canada" className="text-blue-600 hover:underline">/compare/germany-vs-canada</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function CompareCard({ pair }: { pair: string }) {
  const [a, b] = pair.split("-vs-");
  return (
    <Link
      href={`/compare/${pair}`}
      className="rounded-lg border border-slate-200 px-4 py-3 text-sm hover:border-blue-400 hover:bg-blue-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="font-medium text-slate-900 capitalize">{a.replace(/-/g, " ")}</span>
        <span className="text-slate-400 text-xs">vs</span>
        <span className="font-medium text-slate-900 capitalize">{b.replace(/-/g, " ")}</span>
      </div>
      <div className="mt-1 text-xs text-slate-500">Side-by-side comparison →</div>
    </Link>
  );
}