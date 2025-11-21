import { prisma } from "@/lib/prisma";

import formatPedidoService from "./formatPedido";

export default async function getPedidoPorId(id: number) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: id },
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
    }
  });

  if (!pedido) return null;

  const pedidosFormatados = formatPedidoService([pedido])

  return pedidosFormatados[0];
}