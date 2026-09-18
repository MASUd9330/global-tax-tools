import { NextRequest, NextResponse } from "next/server";
import { listStatesForCountry } from "@/lib/data/state";

/** GET /api/states?country=US — list all states for a country */
export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get("country");
  if (!country) {
    return NextResponse.json({ error: "Missing ?country=XX" }, { status: 400 });
  }
  const states = await listStatesForCountry(country);
  return NextResponse.json({ states });
}