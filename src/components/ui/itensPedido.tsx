"use client"

import { Dispatch, SetStateAction } from "react";

import { ItemModelType } from "@/schemas/itemSchema";

import formatCurrency from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";

type ItensPedidoProps = {
  items: ItemModelType[];
  setItems: Dispatch<SetStateAction<ItemModelType[]>>;
};

function ItensPedido({ items, setItems }: ItensPedidoProps) {
  function handleItemRemoval(indexToRemove: number) {
    setItems((prev) => prev.filter((_, index) => index !== indexToRemove));
  }

  return (
      <>
    <div className="space-y-2 h-full overflow-y-auto scrollbar-none">
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
                  <div key={adicional.id} className="flex justify-between pl-5 text-neutral-500">
                    <li>
                      {adicional.quantidade}x {adicional.produto}
                    </li>
                    <p className="tracking-tight font-[400]">
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
                <p className={cn("border-t", item.adicionais.length < 1 && "hidden")}>
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
      <p className="text-end">
        Valor Total: <span className="font-medium tracking-tight">{formatCurrency(items.reduce((acc, item) => acc + item.adicionais.reduce((acc, add) => acc + (add.valorUnitario * add.quantidade), item.valorUnitario * item.quantidade) * item.quantidade, 0))}</span>
      </p>
    </>
  );
}

export default ItensPedido;