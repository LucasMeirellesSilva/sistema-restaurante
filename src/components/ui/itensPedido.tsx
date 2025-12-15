"use client";

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
    <div className="relative max-h-[45vh] flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-none py-2">
      {items &&
        items.map((item, index) => (
          <div key={index} className="flex flex-col gap-0.5 border-b">
            <div className="flex justify-between gap-2">
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
                    {adicional.valorTotalFormatado}
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
              {(item.adicionais.length > 0 || item.quantidade > 1) && (
                <p className="border-t">{item.valorTotalFormatado}</p>
              )}
            </div>
          </div>
        ))}
      <div className="flex font-medium justify-end bg-white absolute sticky bottom-0 py-1">
        Total:{" "}
        {formatCurrency(items.reduce((acc, item) => acc + item.valorTotal, 0))}
      </div>
    </div>
  );
}

export default ItensPedido;
