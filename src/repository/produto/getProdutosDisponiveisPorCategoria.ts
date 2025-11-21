import { prisma } from "@/lib/prisma";
import formatarProdutos from "./formatProduto";
import separarProdutos from "./separarProduto";

export default async function getProdutosDisponiveisPorCategoria(categoriaId: number) {
  const produtos = await prisma.produto.findMany({
    where: { categoria_id: categoriaId, disponivel: true },
    orderBy: { nome: "asc" }
  });

  const produtosFormatados = formatarProdutos(produtos);

  return separarProdutos(produtosFormatados);
}
