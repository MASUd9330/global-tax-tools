/**
 * Internal Link Graph analyzer.
 * Maps every page's outbound links based on template + data.
 * Identifies orphans (no inbound), hubs (most outbound), and link opportunities.
 */
import { prisma } from "@/lib/db";

export interface PageNode {
  url: string;
  type: string; // "home" | "country" | "state" | "tools" | "info"
  title: string;
  outbound: string[]; // URLs this page links to
  inbound: number; // count of pages linking to this
}

export interface LinkGraph {
  nodes: PageNode[];
  orphans: string[]; // pages with 0 inbound
  hubs: Array<{ url: string; outboundCount: number }>;
  totalPages: number;
  totalEdges: number;
  avgInbound: number;
}

export async function getInternalLinkGraph(): Promise<LinkGraph> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const countries = await prisma.country.findMany({ orderBy: { name: "asc" } });
  const states = await prisma.state.findMany({ orderBy: { name: "asc" } });

  const nodes: PageNode[] = [];
  const inboundCount = new Map<string, number>();

  // 1. Homepage
  const homeOut: string[] = [
    `${base}/tools/tax-calculator`,
    `${base}/countries`,
    ...countries.map((c) => `${base}/countries/${c.slug}`),
    `${base}/about`,
    `${base}/methodology`,
  ];
  nodes.push({ url: `${base}/`, type: "home", title: "Home", outbound: homeOut, inbound: 0 });

  // 2. Tools page
  const toolsOut: string[] = [
    `${base}/`,
    `${base}/countries`,
    `${base}/about`,
  ];
  nodes.push({ url: `${base}/tools/tax-calculator`, type: "tools", title: "Tax Calculator", outbound: toolsOut, inbound: 0 });

  // 3. Countries index
  const countriesIndexOut: string[] = [
    `${base}/`,
    ...countries.map((c) => `${base}/countries/${c.slug}`),
  ];
  nodes.push({ url: `${base}/countries`, type: "info", title: "Countries", outbound: countriesIndexOut, inbound: 0 });

  // 4. Country hubs
  for (const c of countries) {
    const out: string[] = [
      `${base}/`,
      `${base}/countries`,
      `${base}/countries/${c.slug}/tax`,
      `${base}/tools/tax-calculator`,
      `${base}/about`,
      `${base}/methodology`,
    ];
    if (c.code === "US") {
      for (const s of states) out.push(`${base}/us-state/${s.slug}`);
    }
    nodes.push({
      url: `${base}/countries/${c.slug}`,
      type: "country",
      title: c.name,
      outbound: out,
      inbound: 0,
    });

    // Country tax page
    nodes.push({
      url: `${base}/countries/${c.slug}/tax`,
      type: "country",
      title: `${c.name} tax`,
      outbound: [
        `${base}/`,
        `${base}/countries/${c.slug}`,
        `${base}/tools/tax-calculator`,
      ],
      inbound: 0,
    });
  }

  // 5. State hubs (US only)
  for (const s of states) {
    const others = states.filter((x) => x.slug !== s.slug).slice(0, 8);
    const out: string[] = [
      `${base}/`,
      `${base}/countries/usa`,
      `${base}/tools/tax-calculator`,
      ...others.map((o) => `${base}/us-state/${o.slug}`),
    ];
    nodes.push({
      url: `${base}/us-state/${s.slug}`,
      type: "state",
      title: s.name,
      outbound: out,
      inbound: 0,
    });
  }

  // 6. Info pages
  for (const p of [
    { url: `${base}/about`, title: "About", out: [`${base}/`, `${base}/methodology`] },
    { url: `${base}/methodology`, title: "Methodology", out: [`${base}/`, `${base}/about`] },
  ]) {
    nodes.push({ url: p.url, type: "info", title: p.title, outbound: p.out, inbound: 0 });
  }

  // Count inbound for each node
  for (const node of nodes) {
    for (const link of node.outbound) {
      inboundCount.set(link, (inboundCount.get(link) ?? 0) + 1);
    }
  }
  for (const node of nodes) {
    node.inbound = inboundCount.get(node.url) ?? 0;
  }

  const orphans = nodes.filter((n) => n.inbound === 0).map((n) => n.url);
  const hubs = [...nodes]
    .sort((a, b) => b.outbound.length - a.outbound.length)
    .slice(0, 10)
    .map((n) => ({ url: n.url, outboundCount: n.outbound.length }));
  const totalEdges = nodes.reduce((sum, n) => sum + n.outbound.length, 0);
  const avgInbound = nodes.length > 0 ? totalEdges / nodes.length : 0;

  return {
    nodes,
    orphans,
    hubs,
    totalPages: nodes.length,
    totalEdges,
    avgInbound: Math.round(avgInbound * 10) / 10,
  };
}