import { Prisma } from "@prisma/client";
import { PagamentoFormType } from "@/schemas/pagamentoSchema";

export default async function createPagamento(
  tx: Prisma.TransactionClient,
  { pedidoId, formas }: PagamentoFormType
) {
  try {
    const result = await tx.pagamento.create({
      data: {
        pedido_id: pedidoId,
        formas: {
          create: formas.map((f) => ({
            valor: f.valor,
            forma_pagamento_id: f.formaPagamentoId,
          })),
        },
      },
      include: {
        formas: {
          include: { forma_pagamento: true },
        },
      },
    });

    return result;
  } catch (err: any) {
    if (err.code === "P2003") {
      const campos = Array.isArray(err.meta?.target)
        ? err.meta.target
        : [err.meta?.target].filter(Boolean);
      throw new Error(`Ocorreu um erro em ${campos?.join(", ")}`);
    }
    throw err;
  }
}
