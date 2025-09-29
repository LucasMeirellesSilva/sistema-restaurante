import { NextRequest, NextResponse } from "next/server";
import getUsuarioPorId from "@/repository/usuario/getUsuarioPorIdService";
import verifyToken from "@/lib/verifyToken";

export async function GET(req: NextRequest) {
  const { isValid, decoded, res} = await verifyToken(req);

  if (!isValid) return res;

  const userRole = await getUsuarioPorId(decoded!.id);

  if (!userRole) {
    return NextResponse.json(
      { message: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  const response = NextResponse.json({
    role: userRole?.tipo.descricao,
  });

  return response;
}
