import { prisma } from "@/lib/prisma";

import { CategoriaFormType } from "@/schemas/categoriaSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export type CategoriaUpdateType = Partial<CategoriaFormType> & { categoriaId: number}

export default async function updateCategoria({ categoriaId, nome }: CategoriaUpdateType) {
  try {
    const result = await prisma.categoria.update({
      where: { id: categoriaId },
      data: {
        nome: nome,
      }
    });

    return result;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        throw new Error("Erro: Nome de categoria em uso.");
      }
      
      if (err.code === "P2025") {
        throw new Error("Erro: Categoria não encontrada.");
      }
    }
    throw err;
  }
}