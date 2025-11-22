import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/login", "/register", "/confirm"];

const roleBasedRoutes = {
  "/admin": ["director"],
  "/advisor": ["advisor", "director"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    const url = new URL("/", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configuration des routes à matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
