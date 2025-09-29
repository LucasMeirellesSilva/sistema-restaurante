import { prisma } from "@/lib/prisma";

export default async function getValorProdutos(produtoIds: number[]) {
  const produtos = await prisma.produto.findMany({
    where: { id: { in: produtoIds } },
    select: { id: true, valor: true },
  });

  return produtos;
}
