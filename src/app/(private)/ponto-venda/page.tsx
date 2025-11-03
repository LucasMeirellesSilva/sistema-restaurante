"use client";

import { useState } from "react";
import usePedidosPendentes from "@/lib/hooks/usePedidosPendentes";

import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import SeletorPedidos from "@/components/ui/seletorPedidos";
import DetalhesPedido from "@/components/ui/detalhesPedido";
import Pagamento from "@/components/ui/pagamento";

import { User } from "lucide-react";
import { PedidoModelType } from "@/schemas/pedidoSchema";

export type SelectedType =
  | {
      tipo: "mesa";
      mesa: string;
      pedidos: PedidoModelType[];
      pedidosSelecionados: PedidoModelType[];
    }
  | { tipo: "pedido"; pedido: PedidoModelType }
  | null;

export default function PontoVenda() {
  const { data: pedidos, isPending: isPedidosPendentesPending } =
    usePedidosPendentes();
  const [selected, setSelected] = useState<SelectedType>(null);
  const [research, setResearch] = useState("");

  if (isPedidosPendentesPending)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="w-full mx-auto lg:w-3/4 h-screen">
      <h1 className="text-center font-semibold text-xl tracking-tight">
        Ponto de Venda
      </h1>
      <div className="relative m-2">
        <Input
          type="text"
          id="research"
          placeholder="Pesquisar por cliente"
          className="indent-5 w-64"
          onChange={(e) => setResearch(e.target.value)}
        />
        <User className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
      </div>
      <div className="flex border rounded-lg h-4/5">
        <div className="flex-1/4 flex flex-col gap-2 pt-4 border-r">
          <h2 className="font-medium text-center">Pedidos em Aberto</h2>
          <div className="overflow-y-scroll scrollbar">
            {pedidos ? (
              <SeletorPedidos
                pedidos={pedidos}
                selected={selected}
                setSelected={setSelected}
              />
            ) : (
              <p>Nenhum pedido em andamento.</p>
            )}
          </div>
        </div>
        <div className="flex-1/3 flex flex-col gap-2 pt-4 border-r">
          {selected ? (
            <DetalhesPedido selected={selected} />
          ) : (
            <p className="text-sm text-center my-auto">
              Selecione um pedido ou mesa para ver informações
            </p>
          )}
        </div>
        <div className="flex-1/3 flex flex-col gap-2 pt-4">
          {selected ? (
            selected.tipo === "mesa" ? (
              <h2 className="font-medium text-center">
                Pagamento de Mesa {selected.mesa}
              </h2>
            ) : (
              <h2 className="font-medium text-center">
                Pagamento de Pedido {selected?.pedido.id}
              </h2>
            )
          ) : (
            <h2 className="font-medium text-center">Pagamento</h2>
          )}
          {selected && <Pagamento selected={selected} setSelected={setSelected}/>}
        </div>
      </div>
    </div>
  );
}
