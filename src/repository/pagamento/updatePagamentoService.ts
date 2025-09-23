import { prisma } from "@/lib/prisma";

import { PagamentoFormType } from "@/schemas/pagamentoSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type PagamentoUpdate = Partial<PagamentoFormType>

export default async function updatePagamento(id: number, { formaPagamentoId, pedidoId, valor }: PagamentoUpdate) {
  try {
    const pagamento = await prisma.pagamento.update({
      where: { id: id },
      data: {
        forma_pagamento_id: formaPagamentoId,
        pedido_id: pedidoId,
        valor: valor
      }
    });

    return { pagamento };
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
    }
}