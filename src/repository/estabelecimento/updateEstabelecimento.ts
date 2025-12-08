import { prisma } from "@/lib/prisma";

import { EstabelecimentoUpdateType } from "@/schemas/estabelecimentoSchema";
import { MesaModelType } from "@/schemas/mesaSchema";

import createMesas from "../mesa/createMesas";

export default async function updateEstabelecimento({
  nome,
  numeroMesas,
}: EstabelecimentoUpdateType) {
  try {
    const result = await prisma.estabelecimento.update({
      where: { id: 1 },
      data: {
        nome: nome,
        numero_mesas: numeroMesas,
      },
    });

    if (result) {
      const mesas: MesaModelType[] = [];

      for (let i = 1; i <= result.numero_mesas; i++) {
        const mesa: MesaModelType = {
          numero: i < 10 ? "0" + i : String(i),
        };
        mesas.push(mesa);
      }

      await createMesas(mesas);

      return true;
    }

    return true;
  } catch (err) {
    throw err;
  }
}
