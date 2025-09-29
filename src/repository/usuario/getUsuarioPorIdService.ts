import { prisma } from "@/lib/prisma";

export default async function getUsuarioPorId(id: number) {
  const result = await prisma.usuario.findUnique({
    where: { id: id },
    select: {
      tipo: {
        select: {
          descricao: true,
        },
      },
    },
  });

  return result;
}
