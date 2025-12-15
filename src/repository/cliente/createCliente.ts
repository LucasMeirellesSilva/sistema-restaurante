import { prisma } from "@/lib/prisma";

import { ClienteFormType } from "@/schemas/clienteSchema";

export default async function createCliente({
  nome,
  telefone,
}: ClienteFormType) {
  try {
    const result = await prisma.cliente.create({
      data: {
        nome: nome,
        telefone: telefone,
      },
    });

    return result;
    /* eslint-disable @typescript-eslint/no-unused-vars  */
  } catch (err) {
    throw new Error("Ocorreu um erro ao adicionar o cliente.");
  }
}
