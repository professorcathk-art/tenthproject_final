import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedExact = ["/dashboard", "/projects", "/learning", "/mcp", "/vault", "/settings", "/admin"];
const protectedPrefixes = ["/dashboard/", "/learning/", "/mcp/", "/vault/", "/settings/", "/admin/", "/projects/"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected =
    protectedExact.includes(pathname) || protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isProtected) {
    const session = request.cookies.get("tenth_project_session")?.value;
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/projects",
    "/projects/:path*",
    "/learning",
    "/learning/:path*",
    "/mcp",
    "/mcp/:path*",
    "/vault",
    "/vault/:path*",
    "/settings",
    "/settings/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
