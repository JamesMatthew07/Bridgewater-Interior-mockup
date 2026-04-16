import { NextResponse } from "next/server";

import { requireApiSession, unauthorizedApiResponse } from "@/lib/auth/api";
import { getPlants } from "@/lib/mock-data";

export async function GET() {
  if (!(await requireApiSession())) {
    return unauthorizedApiResponse();
  }

  return NextResponse.json({
    plants: getPlants(),
  });
}
