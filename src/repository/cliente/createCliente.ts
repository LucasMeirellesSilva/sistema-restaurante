import { prisma } from "@/lib/prisma";

import { ClienteFormType } from "@/schemas/clienteSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function createCliente({ nome, telefone }: ClienteFormType) {
  try {
    const result = await prisma.cliente.create({
      data: {
        nome: nome,
        telefone: telefone
      },
    });
    
    return result;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      throw new Error("Erro: Ocorreu um erro ao adicionar o cliente.");
    }
    throw err;
  }
}