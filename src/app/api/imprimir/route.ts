import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import { getPedidoParaImpressaoPorId } from "@/repository/pedido/getPedidoPorIdService";

export async function POST(req: NextRequest) {
  const { isValid, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  const { id }: { id: number } = await req.json();

  try {
    const pedido = await getPedidoParaImpressaoPorId(id);

    const result = await fetch("http://localhost:9999/print", {
      method: "POST",
      body: JSON.stringify({ pedido }),
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
