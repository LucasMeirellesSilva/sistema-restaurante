import { prisma } from "@/lib/prisma";

export default async function deleteUsuario(id: number) {
  try {
    const usuario = await prisma.usuario.update({
      where: { id: id },
      data: {
        deletado_em: new Date(),
      },
    });

    return usuario;
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new Error("Usuário não encontrado.");
    }
    throw err;
  }
}
