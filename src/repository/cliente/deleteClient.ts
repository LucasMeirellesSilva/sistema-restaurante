import { prisma } from "@/lib/prisma";

export default async function deleteCliente(id: number) {
  try {
    const result = await prisma.cliente.update({
      where: { id: id },
      data: {
        deletado_em: new Date(),
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
