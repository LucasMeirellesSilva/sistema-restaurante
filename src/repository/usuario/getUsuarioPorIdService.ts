import { prisma } from "@/lib/prisma";

export default async function getUsuarioPorId(id: number) {
  const user = await prisma.usuario.findUnique({
    where: { id: id },
    select: {
      tipo: {
        select: {
          descricao: true,
        },
      },
    },
  });

  return user;
}
