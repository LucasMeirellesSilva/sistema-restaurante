import { prisma } from "@/lib/prisma";

import { PagamentoFormType } from "@/schemas/pagamentoSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";

function parseValorToDecimal(valor: string) {
  const numero = valor.replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
  return new Prisma.Decimal(numero);
}

export default async function createPagamento({ pedidoId, formas }: PagamentoFormType) {
  try {
    const result = await prisma.pagamento.create({
      data: {
        pedido_id: pedidoId,
        formas: {
          create: formas.map((f) => ({
            valor: parseValorToDecimal(f.valor),
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
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        const campos = Array.isArray(err.meta?.target) ? err.meta.target : [err.meta?.target].filter(Boolean);
        throw new Error(`Erro: Relacionamento inválido em ${campos?.join(", ")}`);
      }
    }
    throw err;
  }
}
