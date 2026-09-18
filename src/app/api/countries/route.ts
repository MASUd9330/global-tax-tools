import { NextResponse } from "next/server";
import { listCountries } from "@/lib/data/country";

export async function GET() {
  const countries = await listCountries();
  return NextResponse.json({ countries });
}