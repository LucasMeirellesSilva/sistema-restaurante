import { prisma } from "@/lib/prisma";

import { CategoriaFormType } from "@/schemas/categoriaSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function createCategoria({ nome }: CategoriaFormType) {
  try {
    const result = await prisma.categoria.create({
      data: {
        nome: nome
      },
    });
    
    return { result };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        throw new Error("Erro: Nome de categoria em uso.");
      }
    }
  }
}