import { prisma } from "@/lib/prisma";

export default async function updateMesas(quantidade: number) {
  try {
    const result = await prisma.mesa.updateMany({
      where: { id: { gt: quantidade } },
      data: { disponivel: false },
    });

    return { result };
  } catch (err) {
    throw new Error("Erro: Não foi possível atualizar a disponibilidade das mesas.");
  }
}
