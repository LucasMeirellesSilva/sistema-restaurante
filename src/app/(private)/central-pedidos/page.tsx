'use client'

import { useState, useEffect, JSX } from "react";

import { useEstabelecimentoData } from "@/lib/hooks/useEstabelecimentoData";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pedido from "@/components/ui/pedido";
import Mesa from "@/components/ui/mesa";
import { User, Plus } from "lucide-react";
import Image from "next/image";

import { usePedidosPendentes } from "@/lib/hooks/usePedidosPendentes";
import { PedidoModelType } from "@/schemas/pedidoSchema";

export default function CentralPedidos() {
  const [mesasLivres, setMesasLivres] = useState<JSX.Element[]>([]);

  const { data: pedidos, isLoading: isPedidosPendentesLoading } = usePedidosPendentes();
  const { data: estabelecimento, isLoading: isEstabelecimentoLoading } = useEstabelecimentoData();

   useEffect(() => {
    if (estabelecimento) {

      let mesasOcupadas: number[] = [];
      if (pedidos) {
        mesasOcupadas = pedidos
        .filter(p => p.mesa)
        .map(p => Number(p.mesa));
      }

      const novasMesas: JSX.Element[] = [];

      for (let i = 1; i <= estabelecimento.numeroMesas; i++) {
        if (!mesasOcupadas.includes(i)) {
          const numero = i < 10 ? `0${i}` : `${i}`;
          novasMesas.push(<Mesa key={i} numero={numero} />);
        }
      }

      setMesasLivres(novasMesas);
    }
  }, [estabelecimento, pedidos]);

  
  return (
    <div className="flex flex-col items-center w-2/3 mx-auto">
      <h1 className="text-center font-semibold text-xl tracking-tight">
        Central de Pedidos
      </h1>
      <div className="flex items-center gap-12">
        <div className="relative">
          <User
            className="absolute inset-0 my-auto ml-2 text-neutral-500"
            strokeWidth={1.5}
          />
          <Input
            className="bg-white indent-8 w-80"
            type="text"
            placeholder="Filtrar por cliente"
          />
        </div>
        <div className="relative w-fit">
          <Image
            src="/images/bttnBorder.svg"
            alt=""
            width={200}
            height={128}
            className="select-none"
            draggable={false}
          />
          <Button className="absolute py-5 bg-orange-600 hover:bg-orange-600 cursor-pointer hover:shadow-lg hover:scale-105 inset-0 my-auto mx-auto w-fit">
            <Plus size={32} className="scale-120" />
            Criar Pedido
          </Button>
        </div>
      </div>
      <h2 className="text-start font-semibold text-lg tracking-tight text-neutral-800 w-full">
        Pedidos em Aberto
      </h2>
      <div className="flex flex-wrap gap-4 my-4">
        {!isPedidosPendentesLoading && pedidos?.map((p: PedidoModelType) => p.mesa ? <Mesa key={p.id} numero={p.mesa} pedido={p}></Mesa> : <Pedido key={p.id} pedido={p}></Pedido>)}
      </div>
      <h2 className="text-start font-semibold text-lg tracking-tight text-neutral-800 w-full">
        Mesas Livres
      </h2>
      <div className="flex flex-wrap gap-4 my-4">
        {mesasLivres}
      </div>
    </div>
  );
}
