import { Prisma } from "@prisma/client";

type DeleteItemsType = {
  tx: Prisma.TransactionClient;
  pedidoId: number;
};

export default async function deleteItems({ tx, pedidoId }: DeleteItemsType) {
  try {
    const result = await tx.item.deleteMany({
      where: { pedido_id: pedidoId },
    });

    return result;
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new Error("Erro: Item não encontrado");
    }
    throw err;
  }
}
