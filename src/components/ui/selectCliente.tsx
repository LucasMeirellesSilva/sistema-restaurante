"use client"

import { Dispatch } from "react";
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
import { Plus } from "lucide-react";

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
  const { data: clientes, isPending: isClientesPending } = useClientes();

  return (
    <Select onValueChange={(id) => setCliente(Number(id))}>
      <SelectTrigger className="pl-10 cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <div
          className="flex gap-1 items-center px-1 py-1.5 rounded-sm hover:bg-neutral-100 text-sm cursor-pointer text-orange-600 indent-1"
          onClick={() => setModalCliente(true)}
        >
          Novo cliente
          <Plus size={16} />
        </div>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Clientes</SelectLabel>
          {isClientesPending && <Loading />}
          {clientes?.map((cliente) => (
            <SelectItem key={cliente.nome} value={String(cliente.id)}>
              {cliente.nome}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectCliente;
