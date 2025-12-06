import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getPedidoPorId from "@/repository/pedido/getPedidoPorId";
import setPedidoCancelado from "@/repository/pedido/setPedidoCancelado";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  const { id }: { id: number } = await req.json();

  try {
    const pedido = await getPedidoPorId(id);

    if (pedido?.status !== "Pendente")
      return NextResponse.json(
        { error: "Não é possível cancelar um pedido que não esteja pendente." },
        { status: 400 }
      );

    if (pedido?.autorId !== decoded!.id && decoded!.role !== "Admin")
      return NextResponse.json(
        { error: "Não é possível cancelar um pedido feito por outro usuário." },
        { status: 400 }
      );

    const result = await setPedidoCancelado(id);

    const forwardedHost = req.headers.get("x-forwarded-host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";

    const baseUrl = `${protocol}://${forwardedHost}`;

    if (result) {
      fetch(`${baseUrl}/api/invalidate-pedidos`);
      fetch(`${baseUrl}/api/imprimir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: result.id }),
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
