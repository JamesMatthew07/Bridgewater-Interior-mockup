import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  readSessionFromToken,
  sanitizeRedirectTarget,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";

function isPublicPath(pathname: string) {
  return (
    pathname === "/login" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2)$/) !== null
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const session = readSessionFromToken(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
  );

  if (session) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const nextTarget = sanitizeRedirectTarget(`${pathname}${search}`) ?? "/";
  const loginUrl = new URL("/login", request.url);

  loginUrl.searchParams.set("next", nextTarget);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
