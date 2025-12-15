import { prisma } from "@/lib/prisma";

import { MesaModelType } from "@/schemas/mesaSchema";

export default async function createMesas(mesas: MesaModelType[]) {
  try {
    const result = await prisma.mesa.createMany({
      data: mesas,
      skipDuplicates: true,
    });

    return result;
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new Error("Número de mesa em uso.");
    }
    throw err;
  }
}
