import { prisma } from "@/lib/prisma";

export type produtosProps = {
  limit: number;
  skip: number;
};

export default async function getProdutos({ limit, skip }: produtosProps) {
  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({
      skip,
      take: limit,
    }),
    prisma.produto.count(),
  ]);


  const totalPages = Math.ceil(total / limit);

  return {
    produtos,
    totalPages,
    total,
  };
}
