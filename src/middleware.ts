import { NextRequest, NextResponse, type MiddlewareConfig } from "next/server";

const publicRoutes = [{ path: "/", whenAuthenticated: "redirect" }, { path: "/recuperar-acesso", whenAuthenticated: "redirect" }] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);

  if (path.startsWith("/_next/image") || path.startsWith("/images")) {
    return NextResponse.next();
  }

  const authToken = request.headers.get("cookie")?.match(/auth=([^;]+)/)?.[1];

  if (!authToken && publicRoute) return NextResponse.next();

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && publicRoute && publicRoute.whenAuthenticated === "redirect") {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/central-pedidos";

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
      Ignora:
        - /
        - /api/*
        - /_next/*
        - /favicon.ico
        - /api/login
    */
    "/((?!_next|favicon.ico|api/login).*)",
  ],
};
