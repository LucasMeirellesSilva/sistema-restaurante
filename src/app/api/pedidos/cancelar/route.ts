import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import getPedidoPorId from "@/repository/pedido/getPedidoPorIdService";
import setPedidoCancelado from "@/repository/pedido/setPedidoCanceladoService";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res} = await verifyToken(req);
  
  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  const { id } = await req.json();

  try {
    const pedido = await getPedidoPorId(id);

    if (pedido?.status.descricao !== "Pendente") return NextResponse.json({error: "Não é possível cancelar um pedido que não esteja pendente."}, { status: 400 });

    if (pedido?.usuario_id !== decoded!.id && decoded!.role !== "Admin") return NextResponse.json({error: "Não é possível cancelar um pedido feito por outro usuário."}, { status: 400 });

    const result = await setPedidoCancelado(id);

    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }  
}