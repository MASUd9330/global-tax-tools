import { NextRequest, NextResponse } from "next/server";
import { listStatesForCountry } from "@/lib/data/state";
import { listProvinces } from "@/lib/data/province";

// Force dynamic (DB at request time, not build time)
export const dynamic = "force-dynamic";

/** GET /api/states?country=US|CA — list US states or Canadian provinces */
export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get("country");
  if (!country) {
    return NextResponse.json({ error: "Missing ?country=XX" }, { status: 400 });
  }
  if (country === "CA") {
    const provinces = listProvinces();
    return NextResponse.json({ states: provinces, provinces });
  }
  const states = await listStatesForCountry(country);
  return NextResponse.json({ states });
}