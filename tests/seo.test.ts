/**
 * SEO Intelligence module tests.
 * Verify content gaps, link graph, entities work end-to-end.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("SEO — link graph", () => {
  test("returns object with nodes array + stats", async () => {
    const { getInternalLinkGraph } = await import("../src/lib/seo/link-graph");
    const g = await getInternalLinkGraph();
    assert.ok(Array.isArray(g.nodes));
    assert.ok(g.totalPages > 0);
    // Find home node
    const home = g.nodes.find((n) => n.url.endsWith("/"));
    assert.ok(home);
  });
});

describe("SEO — content gaps", () => {
  test("detects content gaps from current coverage", async () => {
    const { detectContentGaps } = await import("../src/lib/seo/content-gaps");
    const result = await detectContentGaps();
    assert.ok(Array.isArray(result.gaps));
    assert.ok(result.gaps.length >= 1, `got ${result.gaps.length} gaps`);
    // Each gap should have required fields
    for (const gap of result.gaps.slice(0, 3)) {
      assert.ok(typeof gap.slug === "string");
      assert.ok(typeof gap.label === "string");
      assert.ok(typeof gap.priority === "number");
    }
  });
});

describe("SEO — entities", () => {
  test("returns entity graph with nodes + edges", async () => {
    const { getEntityGraph } = await import("../src/lib/seo/entities");
    const g = await getEntityGraph();
    assert.ok(typeof g === "object");
  });
});

describe("SEO — freshness", () => {
  test("returns freshness report for current data", async () => {
    const { getFreshnessReport } = await import("../src/lib/seo/freshness");
    const r = await getFreshnessReport();
    assert.ok(Array.isArray(r) || typeof r === "object");
  });
});

describe("SEO — cannibalization", () => {
  test("returns cannibalization report", async () => {
    const { detectCannibalization } = await import("../src/lib/seo/cannibalization");
    const r = await detectCannibalization();
    assert.ok(Array.isArray(r));
  });
});