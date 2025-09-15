import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const response = NextResponse.redirect(new URL("/", req.url));

  response.cookies.set("auth", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return response;
}