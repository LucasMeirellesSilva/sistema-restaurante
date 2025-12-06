import { prisma } from "@/lib/prisma";
import formatarProdutos from "./formatProduto";

export type FilteredProdutosType = {
  nome?: string;
  categoriaId?: number;
};

export type GetProdutosProps = {
  limit: number;
  skip: number;
  adicional: boolean;
  filter: FilteredProdutosType;
};

export default async function getProdutos({
  limit,
  skip,
  adicional,
  filter,
}: GetProdutosProps) {
  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({
      skip,
      take: limit,
      where: {
        adicional: adicional,
        ...(filter.categoriaId && { categoria_id: filter.categoriaId }),
        ...(filter.nome && {
          nome: {
            contains: filter.nome,
          },
        }),
      },
      include: {
        categoria: true,
      },
    }),
    prisma.produto.count({
      where: {
        adicional,
      ...(filter.categoriaId && { categoria_id: filter.categoriaId }),
      ...(filter.nome && {
        nome: {
          contains: filter.nome,
        },
      }),
    }
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const produtosFormatados = formatarProdutos(produtos);

  return {
    produtosFormatados,
    totalPages,
    total,
  };
}
