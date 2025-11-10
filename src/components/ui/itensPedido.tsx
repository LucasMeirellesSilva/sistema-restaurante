"use client"

import { Dispatch, SetStateAction } from "react";

import { ItemModelType } from "@/schemas/itemSchema";

import formatCurrency from "@/lib/formatCurrency";

type ItensPedidoProps = {
  items: ItemModelType[];
  setItems: Dispatch<SetStateAction<ItemModelType[]>>;
};

function ItensPedido({ items, setItems }: ItensPedidoProps) {
  function handleItemRemoval(indexToRemove: number) {
    setItems((prev) => prev.filter((_, index) => index !== indexToRemove));
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
              <p className="border-t font-medium">
                {item.valorTotalFormatado}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ItensPedido;