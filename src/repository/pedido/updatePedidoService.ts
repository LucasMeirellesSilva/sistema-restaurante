import { prisma } from "@/lib/prisma";

import { PedidoFormType } from "@/schemas/pedidoSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type PedidoUpdate = Partial<PedidoFormType>

export default async function updatePedido(id: number, { autorId, clienteId, mesaId, observacao }: PedidoUpdate) {
  try {
    const pedido = await prisma.pedido.update({
      where: { id: id },
      data: {
        usuario_id: autorId,
        cliente_id: clienteId,
        mesa_id: mesaId,
        observacao: observacao
      }
    });

    return { pedido };
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
  }
}