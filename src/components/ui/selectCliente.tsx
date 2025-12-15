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
import { Plus, Minus, Search } from "lucide-react";

type SelectClienteProps = {
  cliente: number | null;
  setCliente: Dispatch<React.SetStateAction<number | null>>;
  setModalCliente: Dispatch<React.SetStateAction<boolean>>;
};

function SelectCliente({
  cliente,
  setCliente,
  setModalCliente,
}: SelectClienteProps) {
  const { data: clientes, isLoading: isClientesLoading } = useClientes();
  const [research, setResearch] = useState("");
  const [open, setOpen] = useState(false);

  const clientesFiltrados = clientes?.filter((c) =>
    c.nome.toLowerCase().includes(research.toLowerCase())
  );

  return (
    <Select
      value={String(cliente) ?? ""}
      open={open}
      onOpenChange={setOpen}
      onValueChange={(id) => setCliente(Number(id))}
    >
      <SelectTrigger className="pl-10 cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-[40vh] md:max-h-[50vh]">
        <div
          className="flex items-center px-1 py-1.5 rounded-sm hover:bg-neutral-100 text-sm cursor-pointer text-orange-600 indent-1"
          onClick={() => {
            setOpen(false);
            setModalCliente(true);
          }}
        >
          <Plus size={16} />
          Novo cliente
        </div>
        {!!cliente && (
          <div
            className="flex items-center px-1 py-1.5 rounded-sm hover:bg-neutral-100 text-sm cursor-pointer text-orange-600 indent-1"
            onClick={() => {
              setCliente(null);
              setOpen(false);
            }}
          >
            <Minus size={16} />
            Remover cliente atual
          </div>
        )}
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
          <Search
            size={16}
            className="absolute left-1 top-1/2 -translate-y-1/2 cursor-default"
          />
        </div>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Clientes</SelectLabel>
          {isClientesLoading ? (
            <Loading />
          ) : clientesFiltrados && clientesFiltrados?.length > 0 ? (
            clientesFiltrados.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.id} - {c.nome}
              </SelectItem>
            ))
          ) : (
            <div className="px-2 py-1 text-sm text-gray-400">
              Nenhum cliente encontrado
            </div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectCliente;
