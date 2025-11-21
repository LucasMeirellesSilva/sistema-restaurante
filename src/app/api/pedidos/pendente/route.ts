import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getPedidosPendentes from "@/repository/pedido/getPedidosPendentes";

export async function GET(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  if (!isValid) return res;

  const pedidosPendentes = await getPedidosPendentes();

  return NextResponse.json(pedidosPendentes);
}
