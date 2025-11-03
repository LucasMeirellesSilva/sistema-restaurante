"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectContent,
} from "./select";
import { FormaPagamentoType } from "@/schemas/formaPagamentoSchema";

type SelectFormaPagamentoProps = {
  index: number;
  formasPagamento: FormaPagamentoType[];
  handleSetFormaPagamento: (index: number, id: number) => void;
  multiPayment: boolean;
  setMultiPayment: Dispatch<SetStateAction<boolean>>;
};

function SelectFormaPagamento({
  index,
  formasPagamento,
  handleSetFormaPagamento,
  multiPayment,
  setMultiPayment,
}: SelectFormaPagamentoProps) {
  const [open, setOpen] = useState(false);

  return (
    <Select
      defaultValue={String(formasPagamento[0].id)}
      onValueChange={(id) => handleSetFormaPagamento(index, Number(id))}
      open={open}
      onOpenChange={setOpen}
    >
      <SelectTrigger className="pl-10 cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent side="top">
        <SelectGroup>
          <SelectLabel>Ações</SelectLabel>
          <div
            className="flex items-center px-1 py-1.5 rounded-sm hover:bg-neutral-100 text-sm cursor-pointer text-orange-600 indent-1"
            onClick={() => {
              setMultiPayment(!multiPayment);
              setOpen(false)
            }}
          >
            {multiPayment ? "Pagamento Simples" : "Pagamento Duplo"}
          </div>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Formas de Pagamento</SelectLabel>
          {formasPagamento.map((forma) => (
            <SelectItem key={forma.id} value={String(forma.id)}>
              {forma.descricao}
            </SelectItem>
          ))}
          {formasPagamento?.length === 0 && (
            <div className="px-2 py-1 text-sm text-gray-400">
              Nenhuma forma de pagamento encontrada.
            </div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectFormaPagamento;
