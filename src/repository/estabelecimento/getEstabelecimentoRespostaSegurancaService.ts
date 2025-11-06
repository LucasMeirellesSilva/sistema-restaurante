import { prisma } from "@/lib/prisma";

export default async function getEstabelecimentoRespostaSeguranca() {
  const estabelecimento = await prisma.estabelecimento.findUnique({
    where: { id: 1 },
    select: { 
      resposta_seguranca: true,
    }
  });

  if (!estabelecimento) return null

  return {
    respostaSeguranca: estabelecimento?.resposta_seguranca,
  };
}