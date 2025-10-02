import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

import { EstabelecimentoFormType } from "@/schemas/estabelecimentoSchema";
import { MesaModelType } from "@/schemas/mesaSchema";

import createMesas from "../mesa/createMesasService";

export default async function createEstabelecimento({ nome, cnpj, numeroMesas, perguntaSeguranca, respostaSeguranca }: EstabelecimentoFormType) {
  const respostaHash = await bcrypt.hash(respostaSeguranca, 10);
  try {
    const result = await prisma.estabelecimento.create({
      data: {
        nome: nome,
        cnpj: cnpj,
        numero_mesas: numeroMesas,
        pergunta_seguranca: perguntaSeguranca,
        resposta_seguranca: respostaHash,
      },
    });

    if (result) {
      const mesas: MesaModelType[] = [];

      for (let i = 1; i <= result.numero_mesas; i++) {
        const mesa: MesaModelType = {
          numero: i < 10 ? "0" + i : String(i)
        }
        mesas.push(mesa);
      };

      const mesasCriadas = await createMesas(mesas);
    }

    return result;
  } catch (err) {
    throw err;
  }
}
