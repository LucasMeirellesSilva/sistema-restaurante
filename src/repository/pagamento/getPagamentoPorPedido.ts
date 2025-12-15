import { prisma } from "@/lib/prisma";
import formatCurrency from "@/lib/formatCurrency";
import { PagamentoModelType } from "@/schemas/pagamentoSchema";

export default async function getPagamentoPorPedido(
  pedidoId: number
): Promise<PagamentoModelType | null> {
  const pagamento = await prisma.pagamento.findUnique({
    where: { pedido_id: pedidoId },
    include: {
      formas: {
        include: {
          forma_pagamento: {
            select: {
              descricao: true,
            },
          },
        },
      },
    },
  });

  if (!pagamento) return null;

  return {
    id: pagamento.id,
    pedidoId: pagamento.pedido_id,
    dataHora: new Date(pagamento.data_hora).toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo", // Fuso horário brasileiro
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
  }),
    formas: pagamento.formas.map((forma) => ({
      formaPagamento: { descricao: forma.forma_pagamento.descricao },
      valor: formatCurrency(Number(forma.valor)),
    })),
  };
}
