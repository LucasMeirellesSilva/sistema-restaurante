import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getPedidosPorCliente from "@/repository/pedido/getPedidosPorClienteService";

export async function GET(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  try {
    const { id } =  await req.json()

    if (!id) throw new Error ("O id é obrigatório.")

    const pedidos = await getPedidosPorCliente(Number(id));

    return NextResponse.json(pedidos);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }

}