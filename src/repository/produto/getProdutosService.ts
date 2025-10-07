import { prisma } from "@/lib/prisma";
import formatarProdutos from "./formatProdutoService";

export type produtosProps = {
  limit: number;
  skip: number;
  adicional: boolean;
};

export default async function getProdutos({ limit, skip, adicional }: produtosProps) {
  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({
      skip,
      take: limit,
      where: { adicional: adicional }
    }),
    prisma.produto.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  const produtosFormatados = formatarProdutos(produtos);

  return {
    produtosFormatados,
    totalPages,
    total,
  };
}
