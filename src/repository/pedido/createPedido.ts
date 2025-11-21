import { Prisma } from "@prisma/client";

import { PedidoFormType } from "@/schemas/pedidoSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type PedidoCreate = Omit<PedidoFormType, "itens"> & { autorId: number };

export default async function createPedido(tx: Prisma.TransactionClient ,{ autorId, clienteId, mesaId, observacao }: PedidoCreate) {
  try {
    const result = await tx.pedido.create({
      data: {
        usuario_id: autorId,
        cliente_id: clienteId,
        mesa_id: mesaId,
        observacao: observacao
      },
    });
    
    return result;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        const campos = Array.isArray(err.meta?.target) ? err.meta.target : [err.meta?.target].filter(Boolean);
        throw new Error(`Erro: Relacionamento inválido em ${campos?.join(", ")}`);
      }
    }
    throw err;
  }
}
