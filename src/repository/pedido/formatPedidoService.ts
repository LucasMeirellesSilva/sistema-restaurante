import { Prisma } from "@prisma/client";

type PedidoComItens = Prisma.PedidoGetPayload<{
  include: {
    itens: {
      include: {
        produto: {
          select: {
            nome: true;
          };
        };
      };
    };
    usuario: {
      select: {
        nome: true;
      };
    };
    cliente: {
      select: {
        nome: true;
      };
    };
  };
}>;

export default function formatPedidoService(pedidos: PedidoComItens[]) {
  const pedidosFormatados = pedidos.map((pedido) => {
    // Separando itens principais e adicionais para cálculo do valor total.
    const itensPrincipais = pedido.itens.filter(
      (item) => item.pertence_a_id === null
    );

    const valorTotal = itensPrincipais.reduce((acc, item) => {
      const itensAdicionais = pedido.itens.filter(
        (i) => i.pertence_a_id === item.id
      );

      const valorAdicionais = itensAdicionais.reduce(
        (subAcc, i) => subAcc + Number(i.valor_unitario) * i.quantidade,
        0
      );

      return (
        acc + (Number(item.valor_unitario) + valorAdicionais) * item.quantidade
      );
    }, 0);

    const valorTotalFormatado = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valorTotal);

    const data = new Date(pedido.criado_em);

    // Formatar a data no fuso horário brasileiro (Brasília, UTC-3)
    const horaFormatada = data.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo", // Fuso horário brasileiro
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    pedido.itens.map((item) => {
      const itemFormatado = {
        id: item.id,
        valorUnitario: item.valor_unitario,
        quantidade: item.quantidade,
        produto: item.produto.nome,
        pertenceId: item.pertence_a_id,
      };
      return itemFormatado;
    });

    return {
      ...pedido,
      autor: pedido.usuario.nome,
      cliente: pedido.cliente?.nome,
      valorTotal: valorTotalFormatado,
      criadoEm: horaFormatada,
    };
  });

  return pedidosFormatados;
}
