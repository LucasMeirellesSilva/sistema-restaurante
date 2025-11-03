"use client";
import { Dispatch, SetStateAction, useState, useEffect, useMemo } from "react";
import useFormasPagamento from "@/lib/hooks/useFormasPagamento";

import { SelectedType } from "@/app/(private)/ponto-venda/page";
import { PagamentoPedidoType } from "./pagamento";

import { Input } from "./input";
import { Button } from "./button";
import SelectFormaPagamento from "./selectFormaPagamento";
import Loading from "./loading";

import formatCurrency from "@/lib/formatCurrency";

type PagamentoValoresProps = {
  formasPagamentoForm: PagamentoPedidoType[];
  setFormasPagamento: Dispatch<SetStateAction<PagamentoPedidoType[]>>;
  selected: SelectedType;
  setSelected: Dispatch<SetStateAction<SelectedType>>;
};

function PagamentoValores({
  formasPagamentoForm,
  setFormasPagamento,
  selected
}: PagamentoValoresProps) {
  const { data: formasPagamento, isPending: isFormasPagamentoPending } =
    useFormasPagamento();
  const [error, setError] = useState<string | null>(null);
  const [multiPayment, setMultiPayment] = useState(false);

  const formasFiltradas = useMemo(() => {
    const [first, second] = formasPagamentoForm;

    if (!formasPagamento?.length) return [[], []];

    return [
      formasPagamento.filter(
        (f) => !multiPayment || f.id !== second?.formaPagamentoId
      ),
      formasPagamento.filter((f) => f.id !== first?.formaPagamentoId),
    ];
  }, [formasPagamento, formasPagamentoForm, multiPayment]);

  const valorTotalSelected =
    selected!.tipo === "mesa"
      ? selected!.pedidosSelecionados.reduce((acc, p) => acc + p.valorTotal, 0)
      : selected!.pedido.valorTotal;

  function handleSetFormaPagamento(index: number, id: number) {
    setError(null);
    if (formasPagamentoForm.some((forma, i) => i !== index && forma.formaPagamentoId === id)) {
      setError("Forma de pagamento já está em uso.");
      return;
    }

    setFormasPagamento((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...(updated[index] ?? {}),
        formaPagamentoId: id,
      };

      return updated.slice(0, 2);
    });
  }

  function handleSetValor(index: number, value: string) {
    // Remove tudo que não for número
    const numeric = value.replace(/\D/g, "");

    //  Converte pra número em reais (dividindo por 100)
    const numberValue = Number(numeric) / 100;

    const valor1 = formasPagamentoForm[0]?.valor ?? 0;
    const valor2 = formasPagamentoForm[1]?.valor ?? 0;

    let maxValue: number;

    // se for o segundo campo (index = 1)
    if (index === 1) {
      maxValue = valorTotalSelected - valor1;
    }
    // se for o primeiro campo (index = 0)
    else {
      maxValue = multiPayment
        ? valorTotalSelected - valor2
        : valorTotalSelected;
    }

    const newValue = numberValue > maxValue ? maxValue : numberValue;

    // Atualiza o estado mantendo o resto do array
    setFormasPagamento((prev) => {
      const novo = [...prev];
      novo[index] = {
        ...novo[index],
        valor: newValue,
      };
      return novo;
    });
  }

  useEffect(() => {
    if (!multiPayment) {
      setFormasPagamento((prev) => prev.slice(0, 1));
      return;
    }

    setFormasPagamento((prev) => {
      const updated = [...prev];
      if (!updated[1]) {
        updated[1] = { formaPagamentoId: updated[0].formaPagamentoId === 1 ? 2 : 1, valor: 0 };
      }
      return updated.slice(0, 2);
    });
  }, [multiPayment]);

  return (
    <div className="flex flex-col gap-2 justify-start">
      {error && <p className="text-red-500">{error}</p>}

      {isFormasPagamentoPending && <Loading />}
      {formasFiltradas[0].length && (
        <div className="flex gap-2">
          <SelectFormaPagamento
            index={0}
            formasPagamento={formasFiltradas[0]}
            handleSetFormaPagamento={handleSetFormaPagamento}
            multiPayment={multiPayment}
            setMultiPayment={setMultiPayment}
          />
          <Input
            type="text"
            value={formatCurrency(formasPagamentoForm?.[0]?.valor || 0)}
            inputMode="numeric"
            onChange={(e) => handleSetValor(0, e.target.value)}
          />
        </div>
      )}

      {multiPayment && formasFiltradas[1].length && (
        <div className="flex gap-2">
          <SelectFormaPagamento
            index={1}
            formasPagamento={formasFiltradas[1]}
            handleSetFormaPagamento={handleSetFormaPagamento}
            multiPayment={multiPayment}
            setMultiPayment={setMultiPayment}
          />
          <Input
            type="text"
            value={formatCurrency(formasPagamentoForm?.[1]?.valor || 0)}
            inputMode="numeric"
            onChange={(e) => handleSetValor(1, e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

export default PagamentoValores;
