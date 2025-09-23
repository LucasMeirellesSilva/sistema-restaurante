import { prisma } from "@/lib/prisma";
import formatPedidoService from "./formatPedidoService";

export default async function getPedidosPendentes() {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { criado_em: "desc" },
      where: { status_id: 1 },
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
    });

    const pedidosPendentesFormatados = formatPedidoService(pedidos);

  return pedidosPendentesFormatados;
}