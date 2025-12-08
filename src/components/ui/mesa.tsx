"use client"

import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./context-menu";

import { PedidoModelType } from "@/schemas/pedidoSchema";
import { ModalAberto } from "@/app/(private)/central-pedidos/page";
import { Dispatch, SetStateAction } from "react";
import { ContextMenuSub } from "@radix-ui/react-context-menu";

import { UserType } from "@/lib/hooks/useUser";

type MesaProps = {
  user?: UserType;
  numero: string;
  pedidos?: PedidoModelType[];
  setMesaSelecionada?: () => void;
  setPedidoSelecionado?: Dispatch<SetStateAction<ModalAberto>>;
  setPedidos?: () => void;
  cancelarPedido?: Dispatch<SetStateAction<ModalAberto>>;
};

export default function Mesa({ user, pedidos, numero, setMesaSelecionada, setPedidoSelecionado, setPedidos, cancelarPedido}: MesaProps) {
  const valorMesa = pedidos?.reduce((acc, pedido) => acc + pedido.valorTotal, 0) ?? 0;
  const valorMesaFormatado = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valorMesa);

  if (pedidos)
    return (
      <ContextMenu>
        <ContextMenuTrigger
          className={cn(
            "relative flex flex-col justify-between w-[100px] sm:w-[120px] sm:h-[120px] text-xs sm:text-sm rounded-lg px-2 py-1 hover:-translate-y-1 transition box-border font-bold text-white cursor-pointer shadow-[0px_2px_4px_rgba(0,0,0,0.15)] bg-orange-600 select-none")}
          onClick={() => setPedidos?.()}
        >
          <p className="text-end">{pedidos[0].criadoEmHora}</p>
          <p className="text-center text-lg sm:text-2xl tracking-wide">{numero}</p>
          <div className="flex flex-col items-center">
            <p className="text-start">{valorMesaFormatado}</p>
            <p className="text-start">{pedidos[0].autor}</p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem className="cursor-pointer" onClick={() => setPedidos?.()}> Abrir </ContextMenuItem>
          <ContextMenuItem className="cursor-pointer" onClick={() => setMesaSelecionada?.()}> Novo pedido </ContextMenuItem>
            {pedidos.map((p) => 
            <ContextMenuSub key={p.id}>
              <ContextMenuSubTrigger className="cursor-pointer flex gap-4 justify-between">
                <p> Pedido {p.id} </p>
                <p className="font-medium">{ p.valorTotalFormatado }</p>
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem onClick={() => setPedidoSelecionado?.({ tipo:"detalhesPedido", pedido: p })}> Abrir </ContextMenuItem>
                {(user?.role === "Admin" || user?.id === p.autorId) && <ContextMenuItem onClick={() => setPedidoSelecionado?.({ tipo:"editarPedido", pedido: p })}> Editar </ContextMenuItem>}
                <ContextMenuItem onClick={() => cancelarPedido?.({tipo: "cancelarPedido", pedido: p})}> Cancelar </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          )}
        </ContextMenuContent>
      </ContextMenu>
    );

  return (
    <div
      className={cn("relative flex flex-col justify-center w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] text-xs sm:text-sm rounded-lg px-2 py-1 transition box-border font-bold text-white cursor-pointer shadow-[0px_2px_4px_rgba(0,0,0,0.15)] bg-emerald-600 hover:bg-emerald-700")}
      onClick={() => setMesaSelecionada?.()}
    >
      <p className="text-center text-lg sm:text-2xl tracking-wide">{numero}</p>
    </div>
  );
}
