import { NextResponse } from "next/server";
import { getConsolidatedComics } from "@/lib/scrapers/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const comics = getConsolidatedComics();
    return NextResponse.json(comics, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
