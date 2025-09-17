import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import getUsuarioPorNome from "@/repository/usuario/getUsuarioPorNomeService";

const SECRET: string = process.env.JWT_SECRET as string;

export type LoginRequest = {
  username: string,
  password: string
}

export async function POST(req: NextRequest) {
  const { username, password }: LoginRequest  = await req.json();

  const user = await getUsuarioPorNome(username);

  if (!user) {
    return NextResponse.json(
      { message: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  const isValid = await bcrypt.compare(password, user.senha);

  if (!isValid) {
    return NextResponse.json({ message: "Senha inválida" }, { status: 401 });
  }

  const token = jwt.sign({ id: user?.id, nome: user?.nome, role: user?.tipo.descricao }, SECRET, {
    expiresIn: "12h",
  });

  const response = NextResponse.json({
    message: "Login realizado",
    role: user.tipo.descricao,
  });

  response.cookies.set("auth", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 12,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return response;
}