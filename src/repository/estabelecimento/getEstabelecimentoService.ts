import { prisma } from "@/lib/prisma";

export default async function getEstabelecimento() {
  const estabelecimento = await prisma.estabelecimento.findUnique({
    where: { id: 1 },
    select: { 
      nome: true,
      numero_mesas: true,
    }
  });

  return estabelecimento;
}