import { Prisma } from "@prisma/client";
import { PedidoModelType, pedidoModelSchema } from "@/schemas/pedidoSchema";
import { ItemModelType } from "@/schemas/itemSchema";
import formatCurrency from "@/lib/formatCurrency";

type PedidoComItens = Prisma.PedidoGetPayload<{
  include: {
    itens: {
      where: { pertence_a_id: null },
      include: {
        produto: {
          select: {
            nome: true,
            id: true,
          },
        },
        adicionais: {
          include: {
            produto: {
              select: {
                nome: true,
                id: true,
              }
            }
          }
        }
      }
    }
    usuario: {
      select: {
        nome: true;
      }
    }
    cliente: {
      select: {
        nome: true;
      }
    }
    mesa: {
      select: {
        numero: true;
      }
    }
    status: {
      select: {
        descricao: true;
      }
    }
  };
}>;

export default function formatPedidoService(pedidos: PedidoComItens[]) {
  const pedidosFormatados = pedidos.map((pedido) => {

    const valorTotal = pedido.itens.reduce((acc, item) => {
      const valorAdicionais = item.adicionais.reduce(
        (subAcc, i) => subAcc + Number(i.valor_unitario) * i.quantidade,
        0
      );

      return (
        acc + (Number(item.valor_unitario) + valorAdicionais) * item.quantidade
      );
    }, 0);

    const valorTotalFormatado = formatCurrency(valorTotal);

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
      valorUnitario: Number(item.valor_unitario),
      valorUnitarioFormatado: formatCurrency(Number(item.valor_unitario)),
      adicionais: item.adicionais.map((adicional) => ({
        id: adicional.id,
        produto: adicional.produto?.nome,
        produtoId: adicional.produto?.id,
        quantidade: adicional.quantidade,
        valorUnitario: Number(adicional.valor_unitario),
        valorUnitarioFormatado: formatCurrency(Number(adicional.valor_unitario))
      })),
      quantidade: item.quantidade,
      produto: item.produto?.nome,
      produtoId: item.produto?.id,
    }));

    const pedidoFormatado: PedidoModelType = {
      id: pedido.id,
      autor: pedido.usuario.nome,
      autorId: pedido.usuario_id,
      cliente: pedido.cliente?.nome ?? null,
      clienteId: pedido.cliente_id ?? null,
      mesa: pedido.mesa?.numero ?? null,
      observacao: pedido.observacao,
      status: pedido.status.descricao,
      itens: itensFormatados,
      valorTotalFormatado: valorTotalFormatado,
      valorTotal: valorTotal,
      criadoEmHora: horaFormatada,
      criadoEmData: dataFormatada,
    };

    const pedidoValidado = pedidoModelSchema.parse(pedidoFormatado);

    return pedidoValidado;
  });

  return pedidosFormatados;
}
