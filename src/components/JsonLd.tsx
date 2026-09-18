type JsonLdData = Record<string, unknown> | JsonLdData[];

interface JsonLdProps {
  data: JsonLdData;
}

/**
 * Inline JSON-LD structured data for SEO.
 * Renders a <script type="application/ld+json"> tag.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll("</", "<\\/"),
      }}
    />
  );
}

/** SoftwareApplication schema for calculator pages */
export function softwareApplicationLd(opts: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    applicationCategory: opts.applicationCategory ?? "FinanceApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

/** FAQ schema for FAQ sections */
export function faqLd(questions: Array<{ question: string; answer: string }>): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

/** BreadcrumbList schema */
export function breadcrumbLd(items: Array<{ name: string; url: string }>): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** Organization schema for the site (homepage) */
export function organizationLd(): JsonLdData {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TaxRank",
    url: base,
    logo: `${base}/icon.png`,
    sameAs: [],
  };
}