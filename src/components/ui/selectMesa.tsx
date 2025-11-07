"use client"

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
  const { data: estabelecimento, isPending: isEstabelecimentoPending } = useEstabelecimentoData();
  const [mesas, setMesas] = useState<JSX.Element[]>([]);

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
    <Select value={mesa} onValueChange={(id) => setMesa(id)}>
      <SelectTrigger className="w-full pl-10 cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Mesas</SelectLabel>
          {isEstabelecimentoPending && <Loading />}
          <SelectItem value={""}>
            Sem mesa
          </SelectItem>
          {mesas?.map((mesa) => mesa)}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectMesa;