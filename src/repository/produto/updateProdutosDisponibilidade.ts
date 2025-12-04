import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function updateProdutoDisponibilidade(produtosId: number[]) {
  try {
    const rowsAffected = await prisma.$executeRaw`
    UPDATE produto
    SET disponivel = NOT disponivel
    WHERE id IN (${Prisma.join(produtosId)});
    `;

    return !!rowsAffected;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new Error("Nenhum produto encontrado.");
      }

      if (err.code === "P2010") {
        throw new Error("Erro ao atualizar disponibilidade.");
      }
    }
    throw err;
  }
}
