import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { parseComparison, buildPairSlug, getPopularComparisons, calculateForSide } from "@/lib/data/compare";
import { getLatestTaxYear } from "@/lib/data/country";
import { CompareCalculator } from "@/components/CompareCalculator";
import { JsonLd, breadcrumbLd, faqLd, softwareApplicationLd } from "@/components/JsonLd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PageProps {
  params: { pair: string };
}

export async function generateStaticParams() {
  const popular = await getPopularComparisons();
  return popular.map((p) => ({ pair: p }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await parseComparison(params.pair);
  if (!resolved) return { title: "Comparison not found" };
  const title = `${resolved.left.name} vs ${resolved.right.name} Tax Calculator 2025`;
  return {
    title,
    description: `Compare ${resolved.left.name} vs ${resolved.right.name} income tax. Side-by-side brackets, effective rates, and take-home pay at any income level.`,
  };
}

export default async function ComparePage({ params }: PageProps) {
  const resolved = await parseComparison(params.pair);
  if (!resolved) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pairSlug = buildPairSlug(resolved.left, resolved.right);
  const url = `${base}/compare/${pairSlug}`;
  const fallbackYear = new Date().getFullYear();
  const usYear = (await getLatestTaxYear("US")) ?? fallbackYear;
  const defaultIncome = 100000;

  // Resolve data year per side
  const leftYear =
    resolved.left.type === "country"
      ? (await getLatestTaxYear(resolved.left.slug)) ?? usYear
      : resolved.left.countryCode === "US"
        ? usYear
        : fallbackYear;
  const rightYear =
    resolved.right.type === "country"
      ? (await getLatestTaxYear(resolved.right.slug)) ?? usYear
      : resolved.right.countryCode === "US"
        ? usYear
        : fallbackYear;

  const [leftResult, rightResult] = await Promise.all([
    calculateForSide(resolved.left, defaultIncome, leftYear),
    calculateForSide(resolved.right, defaultIncome, rightYear),
  ]);

  if (!leftResult || !rightResult) notFound();

  const leftHref =
    resolved.left.type === "country"
      ? `/countries/${resolved.left.slug}`
      : `/us-state/${resolved.left.slug}`;
  const rightHref =
    resolved.right.type === "country"
      ? `/countries/${resolved.right.slug}`
      : `/us-state/${resolved.right.slug}`;

  // FAQ content
  const leftTotal = Math.round(leftResult.totalTax);
  const rightTotal = Math.round(rightResult.totalTax);
  const winner = leftResult.totalTax < rightResult.totalTax ? resolved.left.name : resolved.right.name;
  const loser = leftResult.totalTax < rightResult.totalTax ? resolved.right.name : resolved.left.name;
  const diff = Math.abs(leftResult.totalTax - rightResult.totalTax);

  const faq = [
    {
      question: `Who pays more tax: ${resolved.left.name} or ${resolved.right.name}?`,
      answer: `At $${defaultIncome.toLocaleString()} annual income, ${winner} has lower total tax ($${Math.min(leftTotal, rightTotal).toLocaleString()}) compared to ${loser} ($${Math.max(leftTotal, rightTotal).toLocaleString()}). Difference: $${Math.round(diff).toLocaleString()}.`,
    },
    {
      question: `What is the effective tax rate difference between ${resolved.left.name} and ${resolved.right.name}?`,
      answer: `${resolved.left.name} effective rate: ${(leftResult.effectiveRate * 100).toFixed(2)}%. ${resolved.right.name} effective rate: ${(rightResult.effectiveRate * 100).toFixed(2)}%. The difference is ${Math.abs(((leftResult.effectiveRate - rightResult.effectiveRate) * 100)).toFixed(2)} percentage points.`,
    },
    {
      question: `Is ${resolved.left.name} or ${resolved.right.name} better for high earners?`,
      answer: `Compare the marginal rates: ${resolved.left.name} ${(leftResult.marginalRate * 100).toFixed(0)}% vs ${resolved.right.name} ${(rightResult.marginalRate * 100).toFixed(0)}%. The lower marginal rate applies to your last dollar earned.`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* JSON-LD */}
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: base },
          { name: "Compare", url: `${base}/compare` },
          { name: `${resolved.left.name} vs ${resolved.right.name}`, url },
        ])}
      />
      <JsonLd
        data={softwareApplicationLd({
          name: `${resolved.left.name} vs ${resolved.right.name} Tax Calculator`,
          description: `Side-by-side comparison of ${resolved.left.name} and ${resolved.right.name} income tax at any salary.`,
          url,
        })}
      />
      <JsonLd data={faqLd(faq)} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`${leftHref}`} className="hover:text-slate-700">{resolved.left.name}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">vs {resolved.right.name}</span>
      </nav>

      {/* Hero */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {resolved.left.name} vs {resolved.right.name} Tax Calculator
        </h1>
        <p className="mt-2 text-slate-600">
          Compare income tax side-by-side at any salary. {leftYear} brackets used.
        </p>
      </div>

      {/* Calculator */}
      <CompareCalculator
        leftName={resolved.left.name}
        rightName={resolved.right.name}
        leftHref={leftHref}
        rightHref={rightHref}
        initialResult={{
          income: defaultIncome,
          left: leftResult,
          right: rightResult,
        }}
      />

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faq.map((q, i) => (
              <div key={i}>
                <h3 className="font-medium text-slate-900">{q.question}</h3>
                <p className="mt-1 text-sm text-slate-600">{q.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Other comparisons */}
      <OtherComparisons currentPair={pairSlug} leftSlug={resolved.left.slug} rightSlug={resolved.right.slug} />
    </div>
  );
}

async function OtherComparisons({ currentPair, leftSlug, rightSlug }: { currentPair: string; leftSlug: string; rightSlug: string }) {
  const popular = await getPopularComparisons();
  const others = popular.filter((p) => p !== currentPair).slice(0, 12);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Other comparisons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {others.map((pair) => {
            const [l, r] = pair.split("-vs-");
            return (
              <Link
                key={pair}
                href={`/compare/${pair}`}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-blue-400 hover:bg-blue-50"
              >
                <span className="font-medium text-slate-900 capitalize">{l.replace(/-/g, " ")}</span>
                <span className="mx-2 text-slate-400">vs</span>
                <span className="font-medium text-slate-900 capitalize">{r.replace(/-/g, " ")}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}