import { prisma } from "@/lib/prisma";
import formatarProdutos from "./formatProdutoService";
import separarProdutos from "./separarProdutoService";

export default async function getProdutosPorCategoria(categoriaId: number) {
  const produtos = await prisma.produto.findMany({
    where: { categoria_id: categoriaId }
  });

  const produtosFormatados = formatarProdutos(produtos);

  return separarProdutos(produtosFormatados);
}
