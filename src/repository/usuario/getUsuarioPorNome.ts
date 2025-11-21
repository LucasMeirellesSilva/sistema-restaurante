import { prisma } from "@/lib/prisma";

export default async function getUsuarioPorNome(username: string) {
  const result = await prisma.usuario.findUnique({
    where: { nome: username },
    include: {
      tipo: {
        select: { descricao: true },
      },
    },
  });

  return result;
}
