import { NextRequest, NextResponse } from "next/server";
import verifyToken from "@/lib/verifyToken";
import checkPermission from "@/lib/checkPermission";
import { validatePagamentosForm } from "@/schemas/pagamentoSchema";
import { prisma } from "@/lib/prisma";
import createPagamento from "@/repository/pagamento/createPagamento";
import getPedidoPorId from "@/repository/pedido/getPedidoPorId";
import setPedidoFinalizado from "@/repository/pedido/setPedidoFinalizado";

import getPagamentoPorPedido from "@/repository/pagamento/getPagamentoPorPedido";

export async function GET(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(
    decoded!.role,
    "verHistorico"
  );

  if (!allowed) return notAllowedRes;

  try {
    const id = Number(req.nextUrl.searchParams.get("id"));

    if (!id || isNaN(id)) throw new Error("O id é obrigatório e deve ser um número.");

    const pagamento = await getPagamentoPorPedido(id);

    return NextResponse.json(pagamento);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { isValid, decoded, res } = await verifyToken(req);

  // Token inválido, retorna e reseta token.
  if (!isValid) return res;

  // Bloqueio de rotas baseado nos roles.
  const { allowed, res: notAllowedRes } = checkPermission(
    decoded!.role,
    "finalizarPedido"
  );

  if (!allowed) return notAllowedRes;

  try {
    const pagamentos = validatePagamentosForm(await req.json());
    await prisma.$transaction(async (tx) => {
      for (const p of pagamentos) {
        const ids = p.formas.map((f) => f.formaPagamentoId);
        if (ids.length !== new Set(ids).size) {
          throw new Error("Formas de pagamento repetidas.");
        }

        const pedido = await getPedidoPorId(p.pedidoId);
        const totalPagamento = p.formas.reduce((acc, f) => acc + f.valor, 0);

        if (!pedido) {
          throw new Error("Pedido não encontrado.");
        }

        if (Math.abs(totalPagamento - pedido.valorTotal) > 0.01)
          throw new Error("Valor de pagamento incorreto.");

        if (pedido.status !== "Pendente")
          throw new Error("Pedido não está pendente.");

        await createPagamento(tx, p);
        await setPedidoFinalizado(tx, pedido.id);
      }
    });

    return NextResponse.json({
      message: "Pagamentos finalizados com sucesso.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
