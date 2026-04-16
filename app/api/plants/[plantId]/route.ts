import { NextResponse } from "next/server";

import { requireApiSession, unauthorizedApiResponse } from "@/lib/auth/api";
import { getPlantDetail } from "@/lib/mock-data";
import { coerceTimeRange } from "@/lib/time-range";

export async function GET(
  request: Request,
  context: { params: Promise<{ plantId: string }> },
) {
  if (!(await requireApiSession())) {
    return unauthorizedApiResponse();
  }

  const { plantId } = await context.params;
  const { searchParams } = new URL(request.url);
  const range = coerceTimeRange(searchParams.get("range"));
  const detail = getPlantDetail(plantId, range);

  if (!detail) {
    return NextResponse.json({ error: "Plant not found." }, { status: 404 });
  }

  return NextResponse.json(detail);
}
