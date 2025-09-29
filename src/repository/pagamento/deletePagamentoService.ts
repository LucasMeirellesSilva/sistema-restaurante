import { prisma } from "@/lib/prisma";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function deletePagamento(id: number) {
  try {
    const result = await prisma.pagamento.delete({
      where: { id: id }
    });

    return result;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new Error("Erro: Pagamento não encontrado.");
      }
    }
    throw err;
  }
}