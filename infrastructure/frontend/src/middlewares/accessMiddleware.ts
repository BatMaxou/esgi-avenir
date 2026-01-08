import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { MiddlewareFactory } from "./stackHandler";

const publicRoutes = ["/", "/login", "/register", "/confirm"];

const roleBasedRoutes = {
  "/admin": ["director"],
  "/advisor": ["advisor", "director"],
};

export const accessMiddleware: MiddlewareFactory = () => (request: NextRequest) => {
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

