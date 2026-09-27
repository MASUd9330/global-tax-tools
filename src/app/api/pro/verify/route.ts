import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getProKey } from "@/lib/api/rate-limit";
import { PLAN_LIMITS, type Plan } from "@/lib/api/pro-keys";

/**
 * Verify a Pro/Team API key.
 * Returns the plan + rate limits if valid, otherwise 401.
 *
 * Use this client-side to confirm a key is still active.
 */
export async function GET(req: NextRequest) {
  const pro = getProKey(req);
  if (!pro) {
    return NextResponse.json(
      {
        valid: false,
        error: "Invalid or missing API key",
        hint: "Pass via 'Authorization: Bearer tr_xxx' or 'X-API-Key: tr_xxx' header. Get a key at /pro",
      },
      { status: 401 }
    );
  }

  const limits = PLAN_LIMITS[pro.plan];
  return NextResponse.json({
    valid: true,
    plan: pro.plan,
    ownerEmail: pro.ownerEmail,
    ownerLabel: pro.ownerLabel ?? null,
    expiresAt: pro.expiresAt,
    limits,
  });
}

// POST also supported for symmetry (some clients prefer POST for "verify" actions)
export const POST = GET;