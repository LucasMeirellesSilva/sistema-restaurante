import { Prisma } from "@prisma/client";

import { PedidoUpdateType } from "@/schemas/pedidoSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function updatePedido(tx: Prisma.TransactionClient, { pedidoId, clienteId, mesaId, observacao }: PedidoUpdateType) {
  try {
    const pedido = await tx.pedido.update({
      where: { id: pedidoId },
      data: {
        cliente_id: clienteId,
        mesa_id: mesaId,
        observacao: observacao
      }
    });

    return pedido;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        const campos = Array.isArray(err.meta?.target) ? err.meta.target : [err.meta?.target].filter(Boolean);
        throw new Error(`Erro: Relacionamento inválido em ${campos?.join(", ")}`);
      }

      if (err.code === "P2025") {
        throw new Error("Erro: Pedido não encontrado.");
      }
    }
    throw err;
  }
}