"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { SelectedType } from "@/app/(private)/ponto-venda/page";
import { PedidoModelType } from "@/schemas/pedidoSchema";
import { FormaPagamentoFormType } from "@/schemas/formaPagamentoSchema";
import { PagamentoFormType } from "@/schemas/pagamentoSchema";

import formatCurrency from "@/lib/formatCurrency";

import { Pedido } from "./seletorPedidos";
import { Button } from "./button";
import PagamentoValores from "./pagamentoValores";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import ErrorMessage from "./errorMessage";

type PagamentoProps = {
  selected: SelectedType;
  setSelected: Dispatch<SetStateAction<SelectedType>>;
};

export type PagamentoPedidoType = Partial<FormaPagamentoFormType>;

function Pagamento({ selected, setSelected }: PagamentoProps) {
  const [formasPagamento, setFormasPagamento] = useState<PagamentoPedidoType[]>(
    [
      {
        formaPagamentoId: 1,
        valor: 0,
      },
    ]
  );
  const [error, setError] = useState("");

  const finalizarPedido = useMutation({
    mutationFn: async (pagamento: PagamentoFormType[]) => {
      const res = await fetch("/api/pedidos/pagamento", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(pagamento),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidosPendentes", "pagamentos"] });
      setSelected(null);
    },
  });

  if (!selected) return;

  function handleRemoverPedido(pedido: PedidoModelType) {
    // Se já for o selecionado remove
    if (selected?.tipo === "pedido" && selected.pedido.id === pedido.id) {
      setSelected(null);
      return;
    }
  }

  function handleSubmit() {
    setError("");

    const valorPagamentos = formasPagamento.reduce(
      (acc, forma) => (forma.valor ?? 0) + acc,
      0
    );

    const totalPedidos =
      selected!.tipo === "mesa"
        ? selected!.pedidosSelecionados.reduce(
            (acc, p) => acc + p.valorTotal,
            0
          )
        : selected!.pedido.valorTotal;

    const pagamentosInvalidos = formasPagamento.some(
      (f) => !f.formaPagamentoId || !f.valor
    );

    if (pagamentosInvalidos) {
      setError("Preencha todas as formas de pagamento.");
      return;
    }

    if (valorPagamentos !== totalPedidos) {
      setError(
        "O valor total do pagamento não confere com o valor dos pedidos."
      );
      return;
    }

    let pagamentos: PagamentoFormType[];

    if (selected?.tipo === "mesa") {
      const totalMesa = selected.pedidosSelecionados.reduce(
        (acc, p) => acc + p.valorTotal,
        0
      );

      pagamentos = selected.pedidosSelecionados.map((pedido) => {
        const proporcao = pedido.valorTotal / totalMesa;

        return {
          pedidoId: pedido.id,
          formas: formasPagamento.map((forma) => ({
            formaPagamentoId: forma.formaPagamentoId!,
            valor: Number((forma.valor! * proporcao).toFixed(2)),
          })),
        };
      });
    } else {
      pagamentos = [
        {
          pedidoId: selected!.pedido.id,
          formas: formasPagamento.map((forma) => ({
            formaPagamentoId: forma.formaPagamentoId!,
            valor: forma.valor!,
          })),
        },
      ];
    }

    finalizarPedido.mutate(pagamentos);
  }

  return (
    <div className="flex flex-col h-full justify-between p-5">
      <div>
        {selected?.tipo === "mesa" ? (
          <PedidosMesa selected={selected} setSelected={setSelected} />
        ) : (
          <Pedido
            pedido={selected.pedido}
            selected={selected}
            handleSelect={() => handleRemoverPedido(selected.pedido)}
          />
        )}
      </div>
      <div className="flex flex-col gap-2 items-center">
        <PagamentoValores
          formasPagamentoForm={formasPagamento}
          setFormasPagamento={setFormasPagamento}
          selected={selected}
          setSelected={setSelected}
        />
        {selected.tipo === "mesa" ? (
          <p>
            Total selecionado:{" "}
            <span className="font-medium">
              {formatCurrency(
                selected.pedidosSelecionados.reduce(
                  (acc, p) => p.valorTotal + acc,
                  0
                )
              )}
            </span>
          </p>
        ) : (
          <p>
            Total selecionado:{" "}
            <span className="font-medium">
              {selected.pedido.valorTotalFormatado}
            </span>
          </p>
        )}
        {error && (
          <p className="text-red-500 tracking-tight text-sm">{error}</p>
        )}
        {finalizarPedido.error && (
          <ErrorMessage error={finalizarPedido.error} />
        )}
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          onClick={() => handleSubmit()}
        >
          Finalizar Pagamento
        </Button>
      </div>
    </div>
  );
}

export default Pagamento;

function PedidosMesa({ selected, setSelected }: PagamentoProps) {
  if (selected!.tipo !== "mesa") return;

  function handlePedidoMesaSelecionado(pedido: PedidoModelType) {
    if (selected?.tipo !== "mesa") return;

    const jaExiste = selected.pedidosSelecionados.some(
      (p) => p.id === pedido.id
    );

    // Se existe, remove
    if (jaExiste) {
      // Se for o último, limpa a lista de selecionados
      if (selected.pedidosSelecionados.length === 1) {
        setSelected(null);
        return;
      }

      setSelected({
        ...selected,
        pedidosSelecionados: selected.pedidosSelecionados.filter(
          (p) => p.id !== pedido.id
        ),
      });
      return;
    }

    // Se não existe, adiciona
    setSelected({
      ...selected,
      pedidosSelecionados: [...selected.pedidosSelecionados, pedido],
    });
  }

  return (
    <>
      {selected!.pedidos.map((p) => (
        <Pedido
          key={p.id}
          pedido={p}
          selected={selected}
          handleSelect={() => handlePedidoMesaSelecionado(p)}
        />
      ))}
    </>
  );
}
