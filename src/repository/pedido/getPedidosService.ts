import { prisma } from "@/lib/prisma";
import formatPedidoService from "./formatPedidoService";

export type PedidosProps = {
  limit: number;
  skip: number;
};

export default async function getPedidos({ limit, skip }: PedidosProps) {
  const [pedidos, total] = await Promise.all([
    prisma.pedido.findMany({
      skip,
      take: limit,
      orderBy: { criado_em: "desc" },
      include: {
        itens: {
          where: { pertence_a_id: null },
          include: {
            produto: {
              select: {
                nome: true,
                id: true,
              },
            },
            adicionais: {
              include: {
                produto: {
                  select: {
                    nome: true,
                    id: true,
                  }
                }
              }
            }
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
        mesa: {
          select: {
            numero: true,
          },
        },
        status: {
          select: {
            descricao: true,
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
