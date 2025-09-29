import { Prisma } from "@prisma/client";

import { ItemFormType } from "@/schemas/itemSchema";
import { Decimal, PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export type ItemCreate = ItemFormType & { pedidoId: number, valorUnitario: Decimal }

export default async function createItem(tx: Prisma.TransactionClient, { pedidoId, produtoId, quantidade, pertenceId, valorUnitario }: ItemCreate) {
  try {
    const result = await tx.item.create({
      data: {
        produto_id: produtoId,
        pedido_id: pedidoId,
        valor_unitario: valorUnitario,
        quantidade: quantidade,
        pertence_a_id: pertenceId
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
