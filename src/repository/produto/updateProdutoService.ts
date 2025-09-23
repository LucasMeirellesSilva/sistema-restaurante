import { prisma } from "@/lib/prisma";

import { ProdutoFormType } from "@/schemas/produtoSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function updateProduto(id: number, { categoriaId, nome, valor, descricao }: ProdutoFormType) {
  try {
    const produto = await prisma.produto.update({
      where: { id: id },
      data: {
        categoria_id: categoriaId,
        nome: nome,
        valor: valor,
        descricao: descricao
      }
    });

    return { produto };
  } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2003") {
          throw new Error("Erro: Relacionamento inválido em categoria.");
        }

        if (err.code === "P2025") {
          throw new Error("Erro: Produto não encontrado.");
        }
      }
    }
}