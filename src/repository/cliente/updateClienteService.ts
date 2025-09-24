import { prisma } from "@/lib/prisma";

import { ClienteFormType } from "@/schemas/clienteSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type ClienteUpdate = Partial<ClienteFormType>

export default async function updateCliente(id: number, { nome, telefone }: ClienteUpdate) {
  try {
    const result = await prisma.cliente.update({
      where: { id: id },
      data: {
        nome: nome,
        telefone: telefone
      }
    });

    return { result };
  } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new Error("Erro: Cliente não encontrado.");
        }
      }
    }
}