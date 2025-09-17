import { prisma } from "@/lib/prisma";

export default async function getPedidosPendentesComValorTotal() {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { criado_em: "desc" },
      where: { status_id: 1 },
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
      },
    });

    const pedidosPendentesComValorTotal = pedidos.map((pedido) => {
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

  return pedidosPendentesComValorTotal;
}