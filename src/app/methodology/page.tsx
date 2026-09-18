import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How TaxRank calculates taxes.",
};

export default function MethodologyPage() {
  return (
    <article className="prose max-w-3xl mx-auto">
      <h1>Methodology</h1>
      <p>
        TaxRank uses <strong>progressive tax bracket</strong> calculation: each portion of income is taxed at the rate of the bracket it falls into.
      </p>

      <h2>1. Load rules</h2>
      <p>
        For the selected country and tax year, we load the latest published <em>TaxRule</em>: progressive brackets, deductions, and citations.
      </p>

      <h2>2. Apply deductions</h2>
      <p>
        Standard/personal deductions are subtracted first. Example: a US single filer in 2025 subtracts the $15,000 standard deduction before brackets apply.
      </p>

      <h2>3. Walk brackets</h2>
      <p>
        For each bracket, we calculate how much income falls within it and multiply by that bracket&apos;s rate. Sum across brackets = total tax.
      </p>

      <h2>4. Add social contributions (salary calc only)</h2>
      <p>
        Salary calculator adds employee-side social contributions (US Social Security + Medicare, UK National Insurance, German Sozialversicherung, etc.) with caps where applicable.
      </p>

      <h2>What we don&apos;t model (Phase 0)</h2>
      <ul>
        <li>State / provincial / city tax (US states, Canadian provinces)</li>
        <li>Capital gains, dividends, investments</li>
        <li>Self-employment / freelance taxes</li>
        <li>Quotient familial (France), Kinderfreibetrag (Germany), etc.</li>
      </ul>

      <h2>Source citations</h2>
      <p>
        Every country record in our database links to the official tax authority (IRS, HMRC, BMF, DGFiP, CRA). Rules are versioned — when 2026 brackets are published, we add a new version without breaking historical pages.
      </p>
    </article>
  );
}