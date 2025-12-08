import { prisma } from "@/lib/prisma";

export default async function getUsuariosPorRole(role: string) {
  const result = await prisma.usuario.findMany({
    where: {
      deletado_em: null,
      tipo: {
        descricao: role,
      },
    },
    include: {
      tipo: {
        select: { descricao: true },
      },
    },
  });

  return result;
}