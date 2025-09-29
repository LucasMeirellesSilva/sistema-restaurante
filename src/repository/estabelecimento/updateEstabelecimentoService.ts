import { prisma } from "@/lib/prisma";

import { EstabelecimentoFormType } from "@/schemas/estabelecimentoSchema";
import bcrypt from "bcryptjs";

type EstabelecimentoUpdate = Partial<EstabelecimentoFormType>

export default async function updateUsuario({ nome, cnpj, numeroMesas, perguntaSeguranca, respostaSeguranca }: EstabelecimentoUpdate) {
  const respostaHash = respostaSeguranca ? bcrypt.hash(respostaSeguranca, 10) : "";

  try {
    const result = await prisma.estabelecimento.update({
      where: { id: 1 },
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