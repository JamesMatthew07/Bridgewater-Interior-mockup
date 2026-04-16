import { NextResponse } from "next/server";

import { requireApiSession, unauthorizedApiResponse } from "@/lib/auth/api";
import { getOverviewData } from "@/lib/mock-data";
import { coerceTimeRange } from "@/lib/time-range";

export async function GET(request: Request) {
  if (!(await requireApiSession())) {
    return unauthorizedApiResponse();
  }

  const { searchParams } = new URL(request.url);
  const range = coerceTimeRange(searchParams.get("range"));

  return NextResponse.json(getOverviewData(range));
}
