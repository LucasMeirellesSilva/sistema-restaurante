import { prisma } from "@/lib/prisma";

import { CategoriaFormType } from "@/schemas/categoriaSchema";

export type CategoriaUpdateType = Partial<CategoriaFormType>;

export default async function updateCategoria({
  id,
  nome,
}: CategoriaUpdateType) {
  try {
    const result = await prisma.categoria.update({
      where: { id: id },
      data: {
        nome: nome,
      },
    });

    return result;
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new Error("Erro: Nome de categoria em uso.");
    }

    if (err.code === "P2025") {
      throw new Error("Erro: Categoria não encontrada.");
    }
  }
}
