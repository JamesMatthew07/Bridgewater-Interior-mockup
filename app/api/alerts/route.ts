import { NextResponse } from "next/server";

import { requireApiSession, unauthorizedApiResponse } from "@/lib/auth/api";
import { getAlerts, getSeveritySummary } from "@/lib/mock-data";

export async function GET(request: Request) {
  if (!(await requireApiSession())) {
    return unauthorizedApiResponse();
  }

  const { searchParams } = new URL(request.url);
  const plantId = searchParams.get("plantId") ?? undefined;

  return NextResponse.json({
    summary: getSeveritySummary({ plantId }),
    alerts: getAlerts({ plantId }),
  });
}
