import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedExact = ["/dashboard", "/settings", "/admin", "/projects/new"];
const protectedPrefixes = ["/dashboard/", "/settings/", "/admin/", "/projects/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLesson = pathname.includes("/courses/") && pathname.includes("/lessons/");
  const isProtected =
    isLesson ||
    protectedExact.includes(pathname) ||
    protectedPrefixes.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const session = request.cookies.get("tenth_project_session")?.value;
    const loggedIn = Boolean(session && session !== "");
    if (!loggedIn) {
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
    "/projects/:path*",
    "/settings",
    "/settings/:path*",
    "/admin",
    "/admin/:path*",
    "/courses/:path*",
  ],
};
