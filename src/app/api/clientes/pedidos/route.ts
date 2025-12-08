import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getPedidosPorCliente from "@/repository/pedido/getPedidosPorCliente";

export async function GET(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  try {
    const { searchParams } = new URL(req.url);

    const clienteIdParam = Number(searchParams.get("clienteId"));

    if (!clienteIdParam) throw new Error("Id não está em um formato válido.");

    const pedidos = await getPedidosPorCliente(Number(clienteIdParam));

    return NextResponse.json(pedidos);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }

}