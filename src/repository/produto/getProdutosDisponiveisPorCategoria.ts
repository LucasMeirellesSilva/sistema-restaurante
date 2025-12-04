import { prisma } from "@/lib/prisma";
import formatarProdutos from "./formatProduto";
import separarProdutos from "./separarProduto";

export default async function getProdutosDisponiveisPorCategoria(
  categoriaId: number
) {
  const produtos = await prisma.produto.findMany({
    where: {
      categoria_id: categoriaId,
      disponivel: true,
      // categoria: { desabilitado: false },
    },
    orderBy: { nome: "asc" },
    include: { categoria: true },
  });

  const produtosFormatados = formatarProdutos(produtos);

  return separarProdutos(produtosFormatados);
}
