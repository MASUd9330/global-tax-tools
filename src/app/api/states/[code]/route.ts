import { NextRequest, NextResponse } from "next/server";
import { getState, getStateTaxData } from "@/lib/data/state";

/** GET /api/states/[code]?country=US — get one state */
export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const country = req.nextUrl.searchParams.get("country") || "US";
  const state = await getState(country, params.code);
  if (!state) {
    return NextResponse.json({ error: "State not found" }, { status: 404 });
  }
  const taxData = await getStateTaxData(country, params.code);
  return NextResponse.json({
    state,
    brackets: taxData?.brackets ?? [],
    standardDeduction: taxData?.standardDeduction ?? 0,
  });
}