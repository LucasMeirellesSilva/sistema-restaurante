import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getPedidoPorId from "@/repository/pedido/getPedidoPorIdService";
import imprimirPedido from "@/lib/printOrder";

export async function POST(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  const { id }: { id: number } = await req.json();

  try {
    if (!id) throw new Error("Pedido não encontrado.");

    const pedido = await getPedidoPorId(id);

    if (!pedido) throw new Error("Pedido não encontrado.");

    imprimirPedido(pedido);

    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
