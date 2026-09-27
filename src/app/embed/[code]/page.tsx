import { EmbedWidget } from "@/components/EmbedWidget";

// Embed page — minimal tax estimator for iframe embedding.
// Auto-hides site chrome (CSS body[data-embed="true"]).

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { code: string } }) {
  return {
    title: `Tax Estimate ${params.code.toUpperCase()}`,
    robots: { index: false, follow: false },
  };
}

export default function EmbedPage({ params, searchParams }: {
  params: { code: string };
  searchParams: { state?: string; income?: string; theme?: "light" | "dark" };
}) {
  const code = params.code.toUpperCase();
  const state = searchParams.state;
  const income = searchParams.income ? parseFloat(searchParams.income) : 75000;
  const theme = searchParams.theme === "dark" ? "dark" : "light";

  return (
    <EmbedWidget country={code} state={state} income={isFinite(income) ? income : 75000} theme={theme} />
  );
}