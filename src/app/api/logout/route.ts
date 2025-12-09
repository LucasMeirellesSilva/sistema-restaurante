import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({ ok: true });

  res.cookies.set("auth", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: false,
    sameSite: "lax",
  });

  return res;
}