"use client"

import { Dispatch, SetStateAction } from "react";

import { ItemModelType } from "@/schemas/itemSchema";

type ItensPedidoProps = {
  items: ItemModelType[];
  setItems: Dispatch<SetStateAction<ItemModelType[]>>;
};

function ItensPedido({ items, setItems }: ItensPedidoProps) {
  function handleItemRemoval(indexToRemove: number) {
    setItems((prev) => prev.filter((_, index) => index !== indexToRemove));
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  return (
    <div className="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-none">
      <h2 className="font-medium">Itens do Pedido</h2>
      {items.length < 1 && <p className="font-light">Adicione itens para criar o pedido.</p>}
      {items &&
        items.map((item, index) => (
          <div key={index} className="flex flex-col gap-0.5 border-b">
            <div className="flex justify-between">
              <p>
                {item.quantidade}x {item.produto}
              </p>
              <p>{item.valorUnitarioFormatado}</p>
            </div>
            {item.adicionais &&
              item.adicionais.map((adicional) => (
                <div key={adicional.id} className="flex justify-between pl-5">
                  <li>
                    {adicional.quantidade}x {adicional.produto}
                  </li>
                  <p className="tracking-tight">
                    {formatCurrency(
                      adicional.quantidade * adicional.valorUnitario
                    )}
                  </p>
                </div>
              ))}
            <div className="flex justify-between">
              <button
                className="cursor-pointer text-red-500 font-medium text-sm select-none"
                onClick={() => handleItemRemoval(index)}
              >
                Remover
              </button>
              {/*
                Fórmula de valor = (soma dos adicionais (valor_un * quantidade) * quantidade do item) + valor inicial (valor_un * quantidade)
                */}
              <p className="border-t font-medium">
                {formatCurrency(
                  item.adicionais.reduce(
                    (acc, adicional) =>
                      acc +
                      item.quantidade *
                        (adicional.valorUnitario * adicional.quantidade),
                    item.valorUnitario * item.quantidade
                  )
                )}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ItensPedido;