import { prisma } from "@/lib/prisma";
import formatPedidoService from "../../lib/formatPedido";

import { performance } from "perf_hooks";

export type PedidosProps = {
  limit: number;
  skip: number;
};

export default async function getPedidos({ limit, skip }: PedidosProps) {
  const start = performance.now();

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

  const end = performance.now();

  console.log(`⏱️ Tempo total da rota pedidos pendentes: ${(end - start).toFixed(2)}ms`);

  const totalPages = Math.ceil(total / limit);

  return {
    pedidosFormatados,
    totalPages,
    total,
  };
}
