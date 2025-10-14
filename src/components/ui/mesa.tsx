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

type MesaProps = {
  className?: string;
  numero: string;
  pedidos?: PedidoModelType[];
  setMesaSelecionada?: () => void;
  setPedidoSelecionado?: Dispatch<SetStateAction<ModalAberto>>;
  setPedidos?: () => void;
};

export default function Mesa({ className, pedidos, numero, setMesaSelecionada, setPedidoSelecionado, setPedidos}: MesaProps) {
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
            "relative flex flex-col justify-between w-[120px] h-[120px] rounded-lg px-2 py-1 hover:scale-105 transition box-border font-bold text-white text-sm cursor-pointer shadow-[0px_2px_4px_rgba(0,0,0,0.15)] bg-orange-600",
            className
          )}
          onClick={() => setPedidos?.()}
        >
          <p className="text-end">{pedidos[0].criadoEmHora}</p>
          <p className="text-center text-2xl tracking-wide">{numero}</p>
          <div className="flex flex-col items-center">
            <p className="text-start">{valorMesaFormatado}</p>
            <p className="text-start">{pedidos[0].autor}</p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem className="cursor-pointer" onClick={() => setPedidos?.()}> Abrir </ContextMenuItem>
            {pedidos.map((p) => 
            <ContextMenuSub>
              <ContextMenuSubTrigger className="cursor-pointer flex justify-between">
                <p>Pedido {p.id} </p>
                <p> { p.valorTotalFormatado } </p>
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem onClick={() => setPedidoSelecionado?.({ tipo:"detalhesPedido", pedido: p })}> Abrir </ContextMenuItem>
                <ContextMenuItem onClick={() => setPedidoSelecionado?.({ tipo:"editarPedido", pedido: p })}> Editar </ContextMenuItem>
                <ContextMenuItem> Cancelar </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          )}
        </ContextMenuContent>
      </ContextMenu>
    );

  return (
    <div
      className={cn(
        "relative flex flex-col justify-center w-[120px] h-[120px] rounded-lg px-2 py-1 hover:scale-105 transition box-border font-bold text-white text-sm cursor-pointer shadow-[0px_2px_4px_rgba(0,0,0,0.15)] bg-emerald-600 hover:bg-emerald-700",
        className
      )}
      onClick={() => setMesaSelecionada?.()}
    >
      <p className="text-center text-2xl tracking-wide">{numero}</p>
    </div>
  );
}
