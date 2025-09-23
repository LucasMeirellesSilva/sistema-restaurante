import { prisma } from "@/lib/prisma";

export default async function getPagamentosPorPedido(pedidoId: number) {
  const pagamentos = await prisma.pagamento.findMany({
    where: { id: pedidoId },
    include: {
      formaPagamento: {
        select: {
          descricao: true,
        },
      },
    },
  });

  return pagamentos;
}