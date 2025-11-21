import { prisma } from "@/lib/prisma";

import { MesaModelType } from "@/schemas/mesaSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function createMesas(mesas: MesaModelType[]) {
  try {
    const result = await prisma.mesa.createMany({
      data: mesas ,
      skipDuplicates: true
    });
    
    return result;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        throw new Error("Erro: Número de mesa em uso.");
      }
    throw err;
    }
  }
}