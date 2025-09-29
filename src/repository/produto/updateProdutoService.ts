import { prisma } from "@/lib/prisma";

import { ProdutoFormType } from "@/schemas/produtoSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export type ProdutoUpdate = ProdutoFormType & { produtoId: number }

export default async function updateProduto({ produtoId, categoriaId, nome, valor, descricao }: ProdutoUpdate) {
  try {
    const produto = await prisma.produto.update({
      where: { id: produtoId },
      data: {
        categoria_id: categoriaId,
        nome: nome,
        valor: valor,
        descricao: descricao
      }
    });

    return produto;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        throw new Error("Erro: Relacionamento inválido em categoria.");
      }

      if (err.code === "P2025") {
        throw new Error("Erro: Produto não encontrado.");
      }
    }
    throw err;
  }
}