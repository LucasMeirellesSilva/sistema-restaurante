import { prisma } from "@/lib/prisma";

export type FilteredCategoriasType = {
  nome?: string;
};

export type GetCategoriasPaginadoProps = {
  limit: number;
  skip: number;
  filter: FilteredCategoriasType;
};

export default async function getCategoriasPaginado({
  limit,
  skip,
  filter,
}: GetCategoriasPaginadoProps) {
  const [categorias, total] = await Promise.all([
    prisma.categoria.findMany({
      skip,
      take: limit,
      where: {
        deletado_em: null,
        ...(filter.nome && {
          nome: {
            contains: filter.nome,
          },
        }),
      },
      orderBy: {
        id: "desc",
      },
      include: {
        _count: {
          select: {
            produtos: {
              where: {
                deletado_em: null,
              },
            },
          },
        },
      },
    }),
    prisma.categoria.count({
      where: {
        deletado_em: null,
        ...(filter.nome && {
          nome: {
            contains: filter.nome,
          },
        }),
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const categoriasFormatadas = categorias.map((categoria) => ({
    id: categoria.id,
    nome: categoria.nome,
    contagemProdutos: categoria._count.produtos,
  }));

  return {
    categoriasFormatadas,
    totalPages,
    total,
  };
}
