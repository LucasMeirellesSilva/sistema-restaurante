import { prisma } from "@/lib/prisma";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function setPedidoFinalizado( pedidoId: number ) {
  try {
    const pedido = await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        status_id: 3,
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