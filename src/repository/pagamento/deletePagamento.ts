import { prisma } from "@/lib/prisma";

export default async function deletePagamento(id: number) {
  try {
    const result = await prisma.pagamento.delete({
      where: { id: id },
    });

    return result;
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new Error("Pagamento não encontrado.");
    }
    throw err;
  }
}
