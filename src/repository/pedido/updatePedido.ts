import { Prisma } from "@prisma/client";

import { PedidoUpdateType } from "@/schemas/pedidoSchema";

export default async function updatePedido(tx: Prisma.TransactionClient, { pedidoId, clienteId, mesaId, observacao }: PedidoUpdateType) {
  try {
    const data: Prisma.PedidoUpdateInput = {
      mesa: mesaId
        ? { connect: { id: mesaId } }
        : { disconnect: true },
      cliente: clienteId 
        ? { connect: { id: clienteId } }
        : { disconnect: true },
      observacao,
    };

    const pedido = await tx.pedido.update({
      where: { id: pedidoId },
      data,
    });

    return pedido;
  } catch (err: any) {
      if (err.code === "P2003") {
        const campos = Array.isArray(err.meta?.target) ? err.meta.target : [err.meta?.target].filter(Boolean);
        throw new Error(`Ocorreu um erro em ${campos?.join(", ")}`);
      }

      if (err.code === "P2025") {
        throw new Error("Pedido não encontrado.");
      }
    throw err;
  }
}