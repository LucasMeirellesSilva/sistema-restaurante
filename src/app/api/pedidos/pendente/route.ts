import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getPedidosPendentesComValorTotal from "@/repository/pedido/getPedidosPendentesComValorTotalService";

export async function GET(req: NextRequest) {

  const { isValid, res } = await verifyToken(req);

  if (!isValid) return res;

  const pedidosComValorTotal = getPedidosPendentesComValorTotal();

  const response = NextResponse.json(pedidosComValorTotal);

  return response;
}
