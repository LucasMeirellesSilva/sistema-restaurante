import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getPedidosComValorTotal from "@/repository/pedido/getPedidosComValorTotalService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const { isValid, decoded, res } = await verifyToken(req);

  if (!isValid) return res;

  if (decoded?.role === "Garçom") {
    const res = NextResponse.json(
      { message: "Seu perfil de usuário não possui permissão para acessar este conteúdo." },
      { status: 401 }
    );
    return res;
  }
  
  const { pedidosComValorTotal, totalPages, total } = await getPedidosComValorTotal({ limit, skip });

  const response = NextResponse.json({
    items: pedidosComValorTotal,
    page,
    totalPages,
    total,
  });

  return response;
}
