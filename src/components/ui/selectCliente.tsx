"use client";

import { Dispatch, useState } from "react";
import useClientes from "@/lib/hooks/useClientes";

import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectContent,
  SelectSeparator,
} from "./select";
import Loading from "./loading";
import { Plus, Search } from "lucide-react";

type SelectClienteProps = {
  setCliente: Dispatch<React.SetStateAction<number | null>>;
  setModalCliente: Dispatch<React.SetStateAction<boolean>>;
};

function SelectCliente({
  setCliente,
  setModalCliente,
}: SelectClienteProps) {
  const { data: clientes, isPending: isClientesPending } = useClientes();
  const [research, setResearch] = useState("");

  const clientesFiltrados = clientes?.filter((c) =>
    c.nome.toLowerCase().includes(research.toLowerCase())
  );

  return (
    <Select onValueChange={(id) => setCliente(Number(id))}>
      <SelectTrigger className="pl-10 cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <div
          className="flex items-center px-1 py-1.5 rounded-sm hover:bg-neutral-100 text-sm cursor-pointer text-orange-600 indent-1"
          onClick={() => setModalCliente(true)}
        >
          <Plus size={16} />
          Novo cliente
        </div>
        <SelectSeparator />
        <div className="relative flex gap-1 items-center rounded-sm hover:bg-neutral-100 text-sm cursor-pointer text-orange-600">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={research}
            onChange={(e) => setResearch(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            className="w-full h-full outline-none py-1.5 bg-transparent placeholder:text-orange-600 indent-6"
          />
          <Search size={16} className="absolute left-1 top-1/2 -translate-y-1/2 cursor-default"/>
        </div>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Clientes</SelectLabel>
          {isClientesPending && <Loading />}
          {clientesFiltrados?.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {c.nome}
            </SelectItem>
          ))}
          {clientesFiltrados?.length === 0 && !isClientesPending && (
            <div className="px-2 py-1 text-sm text-gray-400">Nenhum cliente encontrado</div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectCliente;
