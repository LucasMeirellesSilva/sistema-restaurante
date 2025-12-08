"use client";

import { Dispatch, SetStateAction } from "react";

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

import useTiposUsuario from "@/lib/hooks/useTiposUsuario";

type SelectTipoUsuarioProps = {
  tipo: number,
  setTipo: Dispatch<SetStateAction<number>>;
};

function SelectTipoUsuario({ tipo, setTipo }: SelectTipoUsuarioProps) {
  const { data: tiposUsuario, isPending: isTiposUsuarioPending } =
    useTiposUsuario();

  return (
    <Select defaultValue={String(tipo)} onValueChange={(id) => setTipo(Number(id))}>
      <SelectTrigger className="w-32 cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tipos de Usuário</SelectLabel>
          {isTiposUsuarioPending && <Loading />}
          {tiposUsuario?.map((tipo) => (
            <SelectItem key={tipo.id} value={String(tipo.id)}>{tipo.descricao}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectTipoUsuario;
