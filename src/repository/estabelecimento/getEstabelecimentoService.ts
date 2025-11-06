import { prisma } from "@/lib/prisma";

export default async function getEstabelecimento() {
  const estabelecimento = await prisma.estabelecimento.findUnique({
    where: { id: 1 },
    select: { 
      nome: true,
      numero_mesas: true,
      pergunta_seguranca: true
    }
  });

  if (!estabelecimento) return null
  
  return {
    nome: estabelecimento?.nome,
    numeroMesas: estabelecimento?.numero_mesas,
    perguntaSeguranca: estabelecimento?.pergunta_seguranca
  };
}