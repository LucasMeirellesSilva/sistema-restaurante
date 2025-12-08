import { NextRequest, NextResponse } from "next/server";
import getUsuarioPorId from "@/repository/usuario/getUsuarioPorId";
import verifyToken from "@/lib/verifyToken";

export async function GET(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  if (!isValid) return res;

  const user = await getUsuarioPorId(decoded!.id);

  if (!user) {
    return NextResponse.json(
      { message: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  const response = NextResponse.json({
    role: user.tipo.descricao,
    id: user.id,
  });

  return response;
}
