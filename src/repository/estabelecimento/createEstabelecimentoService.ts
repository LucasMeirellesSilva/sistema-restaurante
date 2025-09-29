import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

import { EstabelecimentoFormType } from "@/schemas/estabelecimentoSchema";

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

    return result;
  } catch (err) {
    throw err;
  }
}
