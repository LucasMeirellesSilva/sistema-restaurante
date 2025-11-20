import { prisma } from "@/lib/prisma";
import formatPedidoService from "./formatPedidoService";

import { performance } from "node:perf_hooks";

export default async function getPedidosPendentes() {
  const start = performance.now();

  const pedidos = await prisma.pedido.findMany({
    orderBy: { criado_em: "desc" },
    where: { status_id: 1 },
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
  });
  
  const end = performance.now();

  console.log(`⏱️ Tempo total da rota pedidos pendentes: ${(end - start).toFixed(2)}ms`);

  const pedidosPendentesFormatados = formatPedidoService(pedidos);

  return pedidosPendentesFormatados;
}