import { NextRequest, NextResponse } from "next/server";
import { getCountry, getLatestTaxYear } from "@/lib/data/country";

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  const country = await getCountry(params.code);
  if (!country) {
    return NextResponse.json({ error: "Country not found" }, { status: 404 });
  }
  const latestYear = await getLatestTaxYear(params.code);
  return NextResponse.json({ country, latestYear });
}