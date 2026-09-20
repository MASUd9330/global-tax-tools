import { NextResponse } from "next/server";
import { listCountries } from "@/lib/data/country";

// Force dynamic (DB at request time, not build time)
export const dynamic = "force-dynamic";

export async function GET() {
  const countries = await listCountries();
  return NextResponse.json({ countries });
}