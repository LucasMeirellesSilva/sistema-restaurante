import { prisma } from "@/lib/prisma";

import { ClienteFormType } from "@/schemas/clienteSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export type ClienteUpdateType = Partial<ClienteFormType> & { clienteId: number }

export default async function updateCliente({ clienteId, nome, telefone }: ClienteUpdateType) {
  try {
    const result = await prisma.cliente.update({
      where: { id: clienteId },
      data: {
        nome: nome,
        telefone: telefone
      }
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