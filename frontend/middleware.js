import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("refreshToken");

  const isPrivateRoute = req.nextUrl.pathname.startsWith("/dashboard");

  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}