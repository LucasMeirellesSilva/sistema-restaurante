import { prisma } from "@/lib/prisma";

import { ProdutoFormType } from "@/schemas/produtoSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function createProduto({ categoriaId, nome, valor, adicional, descricao }: ProdutoFormType) {
  try {
    const produto = await prisma.produto.create({
      data: {
        categoria_id: categoriaId,
        nome: nome,
        valor: valor,
        descricao: descricao,
        adicional: adicional
      },
    });

    return produto;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new Error("Erro: Categoria não encontrada.");
      }
    }
    throw err;
  }
}
