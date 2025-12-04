import { prisma } from "@/lib/prisma";
import formatarProdutos from "./formatProduto";

export type GetProdutosProps = {
  limit: number;
  skip: number;
  adicional: boolean;
};

export default async function getProdutos({ limit, skip, adicional }: GetProdutosProps) {
  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({
      skip,
      take: limit,
      where: { adicional: adicional },
      include: {
        categoria: true
      }
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
