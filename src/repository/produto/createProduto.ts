import { prisma } from "@/lib/prisma";

import { ProdutoFormType } from "@/schemas/produtoSchema";

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
  } catch (err: any) {
      if (err.code === "P2002") {
        throw new Error("Nome de produto já está em uso nessa categoria.");
      }

      if (err.code === "P2025") {
        throw new Error("Categoria não encontrada.");
      }
    throw err;
  }
}
