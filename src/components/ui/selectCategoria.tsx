"use client";

import { Dispatch, SetStateAction, useState } from "react";
import useCategorias from "@/lib/hooks/useCategorias";

import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectContent,
} from "./select";
import Loading from "./loading";

type SelectCategoriaProps = {
  categoria?: number;
  setCategoria: Dispatch<React.SetStateAction<number | undefined>>;
};

function SelectCategoria({
  categoria,
  setCategoria,
}: SelectCategoriaProps) {
  const [open, setOpen] = useState(false);
  const { data: categorias, isPending: isCategoriasPending } = useCategorias();

  return (
    <Select
      defaultValue={String(categoria)}
      onValueChange={(id) => setCategoria(Number(id))}
      open={open}
      onOpenChange={setOpen}
    >
      <SelectTrigger className=" cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-[40vh] md:max-h-[50vh]">
        <SelectGroup>
          <SelectLabel>Categorias</SelectLabel>
          {isCategoriasPending ? (
            <Loading />
          ) : categorias && categorias?.length > 0 ? (
            categorias.map((categoria) => (
              <SelectItem key={categoria.id} value={String(categoria.id)}>
                {categoria.nome}
              </SelectItem>
            ))
          ) : (
            <div className="px-2 py-1 text-sm text-gray-400">
              Nenhuma categoria encontrada.
            </div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectCategoria;
