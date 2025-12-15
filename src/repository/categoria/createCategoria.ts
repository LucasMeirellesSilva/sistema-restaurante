import { prisma } from "@/lib/prisma";

import { CategoriaFormType } from "@/schemas/categoriaSchema";

export default async function createCategoria({ nome }: CategoriaFormType) {
  try {
    const result = await prisma.categoria.create({
      data: {
        nome: nome,
      },
    });

    return result;
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new Error("Nome de categoria em uso.");
    }
  }
}
