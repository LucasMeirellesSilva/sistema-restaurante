import { prisma } from "@/lib/prisma";

export default async function getProdutosPorCategoria(categoriaId: number) {
  const produtos = await prisma.produto.findMany({
    where: { categoria_id: categoriaId }
  });

  return produtos;
}
