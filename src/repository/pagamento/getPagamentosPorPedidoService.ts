import { prisma } from "@/lib/prisma";

export default async function getPagamentosPorPedido(pedidoId: number) {
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

  return pagamento;
}
