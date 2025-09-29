import { prisma } from "@/lib/prisma";

export default async function getPedidoPorId(id: number) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: id },
    select: {
      status: {
        select: {
          descricao: true,
        },
      },
      usuario_id: true,
    },
  });

  return pedido;
}
