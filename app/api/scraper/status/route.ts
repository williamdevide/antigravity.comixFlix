import { NextResponse } from "next/server";
import { getScraperMetadata } from "@/lib/scrapers/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const metadata = getScraperMetadata();
    return NextResponse.json({
      ...metadata,
      environmentSchedule: {
        scheduleTime: process.env.SCRAPER_SCHEDULE_TIME || "03:00",
        intervalHours: parseInt(process.env.SCRAPER_INTERVAL_HOURS || "24", 10),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
