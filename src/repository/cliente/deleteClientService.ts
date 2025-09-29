import { prisma } from "@/lib/prisma";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function deleteCliente(id: number) {
  try {
    const result = await prisma.cliente.delete({
      where: { id: id }
    });

    return result;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new Error("Erro: Cliente não encontrado.");
      }
    }
    throw err;
  }
}