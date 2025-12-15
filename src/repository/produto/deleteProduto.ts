import { prisma } from "@/lib/prisma";

export default async function deleteProduto(id: number) {
  try {
    const produto = await prisma.produto.update({
      where: { id: id },
      data: {
        deletado_em: new Date(),
      },
    });

    return produto;
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new Error("Produto não encontrado.");
    }
    throw err;
  }
}
