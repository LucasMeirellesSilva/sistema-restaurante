import { prisma } from "@/lib/prisma";

import { PagamentoFormType } from "@/schemas/pagamentoSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type PagamentoUpdate = Partial<PagamentoFormType> & { pagamentoId: number }

export default async function updatePagamento({ pagamentoId, formaPagamentoId, pedidoId, valor }: PagamentoUpdate) {
  try {
    const result = await prisma.pagamento.update({
      where: { id: pagamentoId },
      data: {
        forma_pagamento_id: formaPagamentoId,
        pedido_id: pedidoId,
        valor: valor
      }
    });

    return result;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        const campos = Array.isArray(err.meta?.target) ? err.meta.target : [err.meta?.target].filter(Boolean);
        throw new Error(`Erro: Relacionamento inválido em ${campos?.join(", ")}`);
      }

      if (err.code === "P2025") {
        throw new Error("Erro: Pagamento não encontrado.");
      }
    }
    throw err;
  }
}