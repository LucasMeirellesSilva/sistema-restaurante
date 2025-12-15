import { prisma } from "@/lib/prisma";

import { ClienteFormType } from "@/schemas/clienteSchema";


export default async function updateCliente({ id, nome, telefone }: ClienteFormType) {
  try {
    const result = await prisma.cliente.update({
      where: { id: id },
      data: {
        nome: nome,
        telefone: telefone,
      },
    });

    return result;
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new Error("Cliente não encontrado.");
    }
    throw err;
  }
}
