import { prisma } from "@/lib/prisma";

import { PagamentoFormType } from "@/schemas/pagamentoSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type PagamentoCreate = Partial<PagamentoFormType>

export default async function createPagamento({ formaPagamentoId, pedidoId, valor }: PagamentoCreate) {
  try {
    const result = await prisma.pagamento.create({
      data: {
        forma_pagamento_id: formaPagamentoId,
        pedido_id: pedidoId,
        valor: valor
      },
    });
    
    return { result };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        const campos = Array.isArray(err.meta?.target) ? err.meta.target : [err.meta?.target].filter(Boolean);
        throw new Error(`Erro: Relacionamento inválido em ${campos?.join(", ")}`);
      }
    }
  }
}
