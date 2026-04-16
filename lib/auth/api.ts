import "server-only";

import { NextResponse } from "next/server";

import { getOptionalSession } from "@/lib/auth/server";

export async function requireApiSession() {
  return getOptionalSession();
}

export function unauthorizedApiResponse() {
  return NextResponse.json({ error: "Authentication required." }, { status: 401 });
}
