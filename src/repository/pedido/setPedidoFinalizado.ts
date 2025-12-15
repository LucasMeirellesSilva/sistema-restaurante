import { Prisma } from "@prisma/client";

export default async function setPedidoFinalizado(
  tx: Prisma.TransactionClient,
  pedidoId: number
) {
  try {
    const pedido = await tx.pedido.update({
      where: { id: pedidoId },
      data: {
        status_id: 3,
      },
    });

    return pedido;
  } catch (err: any) {
    if (err.code === "P2003") {
      const campos = Array.isArray(err.meta?.target)
        ? err.meta.target
        : [err.meta?.target].filter(Boolean);
      throw new Error(`Ocorreu um erro em ${campos?.join(", ")}`);
    }

    if (err.code === "P2025") {
      throw new Error("Pedido não encontrado.");
    }
    throw err;
  }
}
