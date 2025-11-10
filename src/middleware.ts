import { NextRequest, NextResponse, type MiddlewareConfig } from "next/server";
import { jwtVerify } from "jose";

import { forbiddenRoutes } from "./lib/forbiddenRoutes";

const publicRoutes = [
  { path: "/", whenAuthenticated: "redirect" },
  { path: "/recuperar-acesso", whenAuthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/";

const REDIRECT_WHEN_FORBIDDEN_ROUTE = "/central-pedidos"

export async function middleware(request: NextRequest) {
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

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/central-pedidos";
    return NextResponse.redirect(redirectUrl);
  }

  if (!authToken) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  try {
    // Decodifica e valida o token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(authToken, secret);
    const role = payload.role as string | undefined;

    // Bloqueia o acesso conforme o cargo
    if (role && forbiddenRoutes[role]) {
      const restricted = forbiddenRoutes[role].some((route) =>
        path.startsWith(route)
      );

      if (restricted) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = REDIRECT_WHEN_FORBIDDEN_ROUTE;
        return NextResponse.redirect(redirectUrl);
      }
    }
  } catch {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
      Ignora:
        - /
        - /_next/*
        - /favicon.ico
        - /api/login
        - /api/estabelecimento/*
        - /api/recuperar-acesso
    */
    "/((?!_next|favicon.ico|api/login|api/estabelecimento/*|api/recuperar-acesso).*)",
  ],
};
