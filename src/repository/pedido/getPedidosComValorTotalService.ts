import { prisma } from "@/lib/prisma";

export type pedidosComValorTotalProps = {
    limit: number,
    skip: number
}

export default async function getPedidosComValorTotal({ limit, skip } : pedidosComValorTotalProps) {
    const [pedidos, total] = await Promise.all([
    prisma.pedido.findMany({
      skip,
      take: limit,
      orderBy: { criado_em: "desc" },
      include: {
        itens: {
          include: {
            produto: {
              select: {
                nome: true,
              },
            },
          },
        },
        usuario: {
          select: {
            nome: true,
          }
        }
      },
    }),
    prisma.pedido.count(),
  ]);

  const pedidosComValorTotal = pedidos.map((pedido) => {
    const itensPrincipais = pedido.itens.filter((item) => item.pertence_a_id === null);

    const valorTotal = itensPrincipais.reduce((acc, item) => {
      const itensAdicionais = pedido.itens.filter((i) => i.pertence_a_id === item.id);

      const valorAdicionais = itensAdicionais.reduce(
        (subAcc, i) => subAcc + Number(i.valor_unitario) * i.quantidade
      , 0);

      return acc + ((Number(item.valor_unitario) + valorAdicionais) * item.quantidade) ;
    }, 0);

    const valorTotalFormatado = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(valorTotal);  
    
        return { ...pedido, valor_total: valorTotalFormatado };
      });

  const totalPages = Math.ceil(total / limit);

  return {
    pedidosComValorTotal,
    totalPages,
    total,
  }
}