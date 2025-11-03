import { prisma } from "@/lib/prisma";

import { EstabelecimentoFormType } from "@/schemas/estabelecimentoSchema";
import { MesaModelType } from "@/schemas/mesaSchema";
import bcrypt from "bcryptjs";

import createMesas from "../mesa/createMesasService";

export type EstabelecimentoUpdateType = Partial<EstabelecimentoFormType>

export default async function updateEstabelecimento({ nome, cnpj, numeroMesas, perguntaSeguranca, respostaSeguranca }: EstabelecimentoUpdateType) {
  const respostaHash = respostaSeguranca ? await bcrypt.hash(respostaSeguranca, 10) : undefined

  try {
    const result = await prisma.estabelecimento.update({
      where: { id: 1 },
      data: {
        nome: nome,
        cnpj: cnpj,
        numero_mesas: numeroMesas,
        pergunta_seguranca: perguntaSeguranca,
        resposta_seguranca: respostaHash
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

      await createMesas(mesas);
    }

    return result;
  } catch (err) {
    throw err;
  }
}