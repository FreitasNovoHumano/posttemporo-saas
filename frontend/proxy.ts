import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * =====================================================
 * 🔐 PROXY (ex-middleware)
 * =====================================================
 */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * 🔓 Rotas públicas
   */
  const publicRoutes = ["/login", "/"];

  const isPublic = publicRoutes.includes(pathname);

  /**
   * 🔐 Verifica cookie
   */
  const refreshToken = request.cookies.get("refreshToken");

  /**
   * ❌ Não autenticado
   */
  if (!refreshToken && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  /**
   * 🔁 Já logado tentando acessar login
   */
  if (refreshToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

/**
 * 🔥 Rotas protegidas
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/posts/:path*",
    "/calendar/:path*",
    "/media/:path*",
  ],
};