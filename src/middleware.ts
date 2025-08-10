import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/painel") && !pathname.startsWith("/painel/login")) {
    const isAdmin = req.cookies.get("isAdmin")?.value;
    if (isAdmin !== "true") {
      const loginUrl = new URL("/painel/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/painel/:path*"],
};
