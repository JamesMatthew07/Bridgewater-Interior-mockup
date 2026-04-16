import { NextResponse } from "next/server";

import { requireApiSession, unauthorizedApiResponse } from "@/lib/auth/api";
import { resolveOpenAiCompatibleQuery } from "@/lib/ai/openai-compatible";
import { getQueryPresets } from "@/lib/mock-data";
import { coerceTimeRange } from "@/lib/url-state";
import type { QueryRequest } from "@/lib/types";

export async function GET() {
  if (!(await requireApiSession())) {
    return unauthorizedApiResponse();
  }

  return NextResponse.json({
    presets: getQueryPresets(),
  });
}

export async function POST(request: Request) {
  if (!(await requireApiSession())) {
    return unauthorizedApiResponse();
  }

  const body = (await request.json()) as Partial<QueryRequest>;

  if (!body.question?.trim()) {
    return NextResponse.json(
      { error: "A question is required." },
      { status: 400 },
    );
  }

  const queryRequest: QueryRequest = {
    question: body.question.trim(),
    timeRange: coerceTimeRange(body.timeRange),
    plantIds: Array.isArray(body.plantIds)
      ? body.plantIds.filter((plantId): plantId is string => typeof plantId === "string")
      : undefined,
  };

  return NextResponse.json(await resolveOpenAiCompatibleQuery(queryRequest));
}
