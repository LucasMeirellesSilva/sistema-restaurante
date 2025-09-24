import { prisma } from "@/lib/prisma";

import { ItemFormType } from "@/schemas/itemSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function createItem(pedidoId: number, { produtoId, quantidade, pertenceId }: ItemFormType) {
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
      select: {
        valor: true
      }
    });

    if(!produto) throw new Error("Erro: Produto não encontrado")

    const result = await prisma.item.create({
      data: {
        produto_id: produtoId,
        pedido_id: pedidoId,
        valor_unitario: produto.valor,
        quantidade: quantidade,
        pertence_a_id: pertenceId
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
