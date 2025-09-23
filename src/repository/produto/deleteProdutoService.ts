import { prisma } from "@/lib/prisma";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function deleteProduto(id: number) {
  try {
    const produto = await prisma.produto.delete({
      where: { id: id }
    });

    return { produto };
  } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new Error("Erro: Produto não encontrado.");
        }
      }
    }
}