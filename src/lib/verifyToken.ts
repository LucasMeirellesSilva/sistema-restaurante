import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SECRET: string = process.env.JWT_SECRET as string;

export default async function verifyToken(req: NextRequest) {
  const cookie = await cookies();

  const token = cookie.get("auth")?.value;

  if (!token) {
    return {
      isValid: false,
      res: NextResponse.json(
        { message: "Token não encontrado" },
        { status: 401 }
      ),
    };
  }

  try {
    const decoded = jwt.verify(token, SECRET) as {
      id: number;
      nome: string;
      role: string;
    };

    return { isValid: true, decoded };
  } catch {
    const res = NextResponse.redirect(new URL("/", req.url));

    res.cookies.set("auth", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return { isValid: false, res };
  }
}
