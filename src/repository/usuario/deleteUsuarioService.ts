import { prisma } from "@/lib/prisma";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function deleteUsuario(id: number) {
  try {
    const usuario = await prisma.usuario.delete({
      where: { id: id }
    });

    return { usuario };
  } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new Error("Erro: Usuário não encontrado.");
        }
      }
    }
}