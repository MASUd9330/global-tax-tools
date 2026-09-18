import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TaxRank",
  description: "What TaxRank is, and what it isn't.",
};

export default function AboutPage() {
  return (
    <article className="prose max-w-3xl mx-auto">
      <h1>About TaxRank</h1>
      <p>
        TaxRank is a free, source-cited global income tax and salary calculator.
        We estimate federal/national income tax for {`the world's`} biggest economies — currently USA, UK, Germany, France, and Canada — using each country&apos;s official tax authority brackets.
      </p>
      <h2>What this is</h2>
      <ul>
        <li>A fast, free estimate of your federal income tax liability</li>
        <li>Source-cited data with year tags (2025 currently)</li>
        <li>A foundation for understanding tax systems across countries</li>
      </ul>
      <h2>What this is NOT</h2>
      <ul>
        <li>A substitute for a tax professional</li>
        <li>A complete filing solution</li>
        <li>State, provincial, or city tax (Phase 1+)</li>
      </ul>
      <h2>How we make money</h2>
      <p>
        We don&apos;t — yet. TaxRank is currently an open research project. Future phases may include a paid embeddable widget for finance sites and an API tier.
      </p>
    </article>
  );
}