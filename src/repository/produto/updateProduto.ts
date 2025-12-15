import { prisma } from "@/lib/prisma";

import { ProdutoFormType } from "@/schemas/produtoSchema";

export type ProdutoUpdateType = Omit<ProdutoFormType, "adicional">;

export default async function updateProduto({
  id,
  categoriaId,
  nome,
  valor,
  descricao,
}: ProdutoUpdateType) {
  try {
    const produto = await prisma.produto.update({
      where: { id: id },
      data: {
        categoria_id: categoriaId,
        nome: nome,
        valor: valor,
        descricao: descricao,
      },
    });

    return produto;
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new Error("Nome de produto já está em uso.");
    }

    if (err.code === "P2003") {
      throw new Error("Relacionamento inválido em categoria.");
    }

    if (err.code === "P2025") {
      throw new Error("Produto não encontrado.");
    }
    throw err;
  }
}
