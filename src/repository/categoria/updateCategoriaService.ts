import { prisma } from "@/lib/prisma";

import { CategoriaFormType } from "@/schemas/categoriaSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type CategoriaUpdate = Partial<CategoriaFormType>

export default async function updateCategoria(id: number, { nome }: CategoriaUpdate) {
  try {
    const result = await prisma.categoria.update({
      where: { id: id },
      data: {
        nome: nome,
      }
    });

    return { result };
  } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new Error("Erro: Nome de categoria em uso.");
        }
        
        if (err.code === "P2025") {
          throw new Error("Erro: Categoria não encontrada.");
        }
      }
    }
}