"use client"

import { useState, useEffect, JSX } from "react";
import useEstabelecimentoData from "@/lib/hooks/useEstabelecimentoData";
import useClientes from "@/lib/hooks/useClientes";

import { PedidoModelType } from "@/schemas/pedidoSchema";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectValue, SelectGroup, SelectLabel, SelectContent } from "@/components/ui/select";
import Loading from "@/components/ui/loading";
import { User, createLucideIcon } from "lucide-react";
import { chairsTablePlatter  } from '@lucide/lab'

const ChairsTablePlatter = createLucideIcon("chairs-table-platter", chairsTablePlatter)

type FormPedidoProps = {
  pedido?: PedidoModelType;
  mesaSelecionada?: string;
};

function FormPedido({ pedido, mesaSelecionada }: FormPedidoProps) {
  const { data: estabelecimento, isPending: isEstabelecimentoPending } = useEstabelecimentoData();
  const { data: clientes, isPending: isClientesPending } = useClientes();

  const [cliente, setCliente] = useState<number | null>(null);
  const [mesa, setMesa] = useState<string | null>(mesaSelecionada ?? null);
  const [mesas, setMesas] = useState<JSX.Element[]>([]);

  useEffect(() => {
      if (estabelecimento) {
        const mesas: JSX.Element[] = [];
  
        for (let i = 1; i <= estabelecimento.numeroMesas; i++) {
          const numero = i < 10 ? `0${i}` : `${i}`;
          mesas.push(<SelectItem key={i} value={numero}>{numero}</SelectItem>);
        }
  
        setMesas(mesas);
      }
    }, [estabelecimento]);

  return (
    <div className="flex">
      <div className="flex flex-col gap-2">
        <h1 className="w-fit px-6 text-center text-xl font-medium border-b border-neutral-200">
          Novo Pedido
        </h1>
        <form>
          <Label htmlFor="cliente">
            Cliente
          </Label>
          <div className="relative lg:w-64">
            <Select onValueChange={(id) => setCliente(Number(id))}>
              <SelectTrigger className="w-full pl-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Clientes</SelectLabel>
                  { isClientesPending && <Loading /> }
                  { clientes?.map((cliente) => <SelectItem key={cliente.nome} value={String(cliente.id)}>{cliente.nome}</SelectItem>) }
                </SelectGroup>
              </SelectContent>
            </Select>
            <User className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
          </div>

          <Label htmlFor="mesa">
            Número da Mesa
          </Label>
          <div className="relative lg:w-64">
            <Select value={String(mesa)} onValueChange={(id) => setMesa(id)}>
              <SelectTrigger className="w-full pl-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mesas</SelectLabel>
                  { isEstabelecimentoPending && <Loading /> }
                  { mesas?.map((mesa) => mesa) }
                </SelectGroup>
              </SelectContent>
            </Select>
            <ChairsTablePlatter className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormPedido;
