import { Prisma } from "@prisma/client";
import { PedidoModelType, pedidoModelSchema } from "@/schemas/pedidoSchema";
import { ItemModelType } from "@/schemas/itemSchema";

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
    mesa: {
      select: {
        numero: true;
      };
    };
    status: {
      select: {
        descricao: true;
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

    const dataFormatada = data.toLocaleDateString("pt-BR");

    const itensFormatados: ItemModelType[] = pedido.itens.map((item) => ({
      id: item.id,
      valorUnitario: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(item.valor_unitario)),
      quantidade: item.quantidade,
      produto: item.produto?.nome,
      pertenceId: item.pertence_a_id,
    }));

    const pedidoFormatado: PedidoModelType = {
      id: pedido.id,
      autor: pedido.usuario.nome,
      cliente: pedido.cliente?.nome ?? null,
      mesa: pedido.mesa?.numero ?? null,
      observacao: pedido.observacao,
      status: pedido.status.descricao,
      itens: itensFormatados,
      valorTotal: valorTotalFormatado,
      criadoEmHora: horaFormatada,
      criadoEmData: dataFormatada,
    };

    const pedidoValidado = pedidoModelSchema.parse(pedidoFormatado);

    return pedidoValidado;
  });

  return pedidosFormatados;
}
