import { prisma } from "@/lib/prisma";
import formatPedidoService from "./formatPedidoService";

export type pedidosProps = {
  limit: number;
  skip: number;
};

export default async function getPedidos({ limit, skip }: pedidosProps) {
  const [pedidos, total] = await Promise.all([
    prisma.pedido.findMany({
      skip,
      take: limit,
      orderBy: { criado_em: "desc" },
      include: {
        itens: {
          include: {
            produto: {
              select: {
                nome: true,
              },
            },
          },
        },
        usuario: {
          select: {
            nome: true,
          },
        },
        cliente: {
          select: {
            nome: true,
          },
        },
      },
    }),
    prisma.pedido.count(),
  ]);

  const pedidosFormatados = formatPedidoService(pedidos);

  const totalPages = Math.ceil(total / limit);

  return {
    pedidosFormatados,
    totalPages,
    total,
  };
}
