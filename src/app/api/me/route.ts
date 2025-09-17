import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getUsuarioPorId from "@/repository/usuario/getUsuarioPorIdService";

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
  });

  return response;
}
