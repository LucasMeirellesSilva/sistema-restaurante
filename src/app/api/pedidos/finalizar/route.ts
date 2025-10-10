import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import checkPermission from "@/lib/checkPermission";
import { PagamentoFormType } from "@/schemas/pagamentoSchema";
import { prisma } from "@/lib/prisma";
import createPagamento from "@/repository/pagamento/createPagamentoService";
import getPedidoPorId from "@/repository/pedido/getPedidoPorIdService";
import setPedidoFinalizado from "@/repository/pedido/setPedidoFinalizadoService";

export async function POST(req: NextRequest) {
  const { isValid, decoded, res} = await verifyToken(req);
  
  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(decoded!.role, "finalizarPedido");
  
  if (!allowed) return notAllowedRes;

  const { pedidoId, formas }: PagamentoFormType = await req.json();

  // Caso haja duas formas de pagamento com mesmo id, retorna um erro.
  const ids = formas.map(i => i.formaPagamentoId);
  const repetido = ids.length !== new Set(ids).size;

  if (repetido) {
    return NextResponse.json({error: "Não é permitido criar um pagamento com formas de pagamento repetidas."}, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const pagamento = await createPagamento(tx, { pedidoId, formas });

      const total = pagamento.formas.reduce((acc, forma) => acc + Number(forma.valor), 0);

      const pedido = await getPedidoPorId(pedidoId);

      if (total !== pedido?.valorTotal) throw new Error("O valor do pagamento não condiz com o valor total do pedido.")

      if (pedido?.status !== "Pendente") return NextResponse.json({error: "Não é possível finalizar um pedido que não esteja pendente."}, { status: 400 });

      const result = await setPedidoFinalizado(pedidoId);

      return result;
    })

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }  
}