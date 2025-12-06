import { FilteredClientesType } from "@/lib/hooks/useClientesPaginado";
import { prisma } from "@/lib/prisma";

export type PedidosProps = {
  limit: number;
  skip: number;
  filter: FilteredClientesType;
};

export default async function getClientesPaginado({
  limit,
  skip,
  filter,
}: PedidosProps) {
  const [clientes, total] = await Promise.all([
    prisma.cliente.findMany({
      skip,
      take: limit,
      where: {
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
            pedidos: true,
          },
        },
      },
    }),
    prisma.cliente.count({
      where: {
        ...(filter.nome && {
          nome: {
            contains: filter.nome,
          },
        }),
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const clientesFormatados = clientes.map((cliente) => ({
    id: cliente.id,
    nome: cliente.nome,
    telefone: cliente.telefone,
    quantidadePedidos: cliente._count.pedidos,
  }));

  return {
    clientesFormatados,
    totalPages,
    total,
  };
}
