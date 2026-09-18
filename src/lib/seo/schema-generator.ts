/**
 * Schema Generator.
 * Auto-generates JSON-LD structured data based on page type and content.
 */
type JsonLdData = Record<string, unknown> | JsonLdData[];

interface SchemaInput {
  pageType: "home" | "country-hub" | "state-hub" | "tools" | "comparison";
  url: string;
  title: string;
  description: string;
  // Optional: country / state / breadcrumb for context
  countryName?: string;
  stateName?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faq?: Array<{ question: string; answer: string }>;
}

export function generateSchema(input: SchemaInput): JsonLdData[] {
  const schemas: JsonLdData[] = [];
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // 1. WebApplication / SoftwareApplication (always)
  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.title,
    description: input.description,
    url: input.url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  });

  // 2. BreadcrumbList (if breadcrumbs provided)
  if (input.breadcrumbs && input.breadcrumbs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: input.breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    });
  }

  // 3. FAQPage (if FAQ provided)
  if (input.faq && input.faq.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: input.faq.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.answer },
      })),
    });
  }

  // 4. Place (for country/state pages — geographic context)
  if (input.pageType === "country-hub" && input.countryName) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Place",
      name: input.countryName,
      url: input.url,
      containedInPlace: { "@type": "Country", name: input.countryName },
    });
  }
  if (input.pageType === "state-hub" && input.stateName) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "AdministrativeArea",
      name: input.stateName,
      url: input.url,
    });
  }

  // 5. Organization (homepage only)
  if (input.pageType === "home") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "TaxRank",
      url: base,
      logo: `${base}/icon.png`,
    });
  }

  return schemas;
}