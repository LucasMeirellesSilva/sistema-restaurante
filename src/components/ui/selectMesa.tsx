"use client";

import { Dispatch, useState, useEffect, JSX } from "react";

import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectContent,
} from "@/components/ui/select";
import Loading from "./loading";

import useEstabelecimentoData from "@/lib/hooks/useEstabelecimentoData";

type SelectMesaProps = {
  mesa: string | undefined;
  setMesa: Dispatch<React.SetStateAction<string | undefined>>;
};

function SelectMesa({ mesa, setMesa }: SelectMesaProps) {
  const { data: estabelecimento, isPending: isEstabelecimentoPending } =
    useEstabelecimentoData();
  const [mesas, setMesas] = useState<JSX.Element[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (estabelecimento) {
      const mesas: JSX.Element[] = [];

      for (let i = 1; i <= estabelecimento.numeroMesas; i++) {
        const numero = i < 10 ? `0${i}` : `${i}`;
        mesas.push(
          <SelectItem key={i} value={numero}>
            {numero}
          </SelectItem>
        );
      }

      setMesas(mesas);
    }
  }, [estabelecimento]);

  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      value={mesa}
      onValueChange={(id) => setMesa(id)}
    >
      <SelectTrigger className="w-full pl-10 cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Mesas</SelectLabel>
          {isEstabelecimentoPending && <Loading />}
          {mesa && (
            <div
              className="flex items-center px-1 py-1.5 rounded-sm hover:bg-neutral-100 text-sm cursor-pointer indent-1"
              onClick={() => {
                setMesa("");
                setOpen(false);
              }}
            >
              Sem mesa
            </div>
          )}
          {mesas?.map((mesa) => mesa)}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectMesa;
