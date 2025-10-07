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

import formatPedidoService from "./formatPedidoService";

export async function getPedidoParaImpressaoPorId(id: number) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: id },
    include: {
      itens: {
        where: { pertence_a_id: null },
        include: {
          produto: {
            select: {
              nome: true,
            },
          },
          adicionais: {
            include: {
              produto: {
                select: {
                  nome: true,
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