import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import checkPermission from "@/lib/checkPermission";
import getPedidoPorId from "@/repository/pedido/getPedidoPorIdService";
import setPedidoFinalizado from "@/repository/pedido/setPedidoFinalizadoService";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res} = await verifyToken(req);
  
  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(decoded!.role, "finalizarPedido");
  
  if (!allowed) return notAllowedRes;

  const { id } = await req.json();

  try {
    const pedido = await getPedidoPorId(id);

    if (pedido?.status.descricao !== "Pendente") return NextResponse.json({error: "Não é possível finalizar um pedido que não esteja pendente."}, { status: 400 });

    const result = await setPedidoFinalizado(id);

    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }  
}