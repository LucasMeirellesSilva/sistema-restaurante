import { prisma } from "@/lib/prisma";

export type GetCategoriasPaginadoProps = {
  limit: number;
  skip: number;
};

export default async function getCategoriasPaginado({
  limit,
  skip,
}: GetCategoriasPaginadoProps) {
  const [categorias, total] = await Promise.all([
    prisma.categoria.findMany({
      skip,
      take: limit,
      orderBy: {
        id: "desc",
      },
      include: {
        _count: {
          select: {
            produtos: true,
          },
        },
      },
    }),
    prisma.categoria.count(),
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
