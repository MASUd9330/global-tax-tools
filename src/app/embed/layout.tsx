// Minimal embed layout — strips header/footer for iframe-friendly rendering.
// Uses CSS [data-embed] flag set by client pages to hide chrome from root layout.
import "../globals.css";

export const metadata = {
  title: "TaxRank Embed",
  robots: { index: false, follow: false },
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}