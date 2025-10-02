import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";

import { PedidoModelType } from "@/schemas/pedidoSchema";

type MesaProps = {
  className?: string
  numero: string
  pedido?: PedidoModelType
};

export default function Mesa({ className, pedido, numero }: MesaProps) {

  if(pedido) return (
    <ContextMenu>
      <ContextMenuTrigger className={cn("relative flex flex-col justify-between w-[120px] h-[120px] rounded-lg px-2 py-1 hover:scale-105 transition box-border font-bold text-white text-sm cursor-pointer shadow-[0px_2px_4px_rgba(0,0,0,0.15)] bg-orange-600" , className)}>
        <p className="text-end">{ pedido.criadoEmHora }</p>
        <p className="text-center text-2xl tracking-wide">{ numero }</p>
        <div className="flex flex-col items-center">
            <p className="text-start">{ pedido.valorTotal }</p>
            <p className="text-start">{ pedido.autor }</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem className="cursor-pointer"> Abrir </ContextMenuItem>
        <ContextMenuItem className="cursor-pointer"> Editar </ContextMenuItem>
        <ContextMenuItem className="cursor-pointer"> Cancelar </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )

  return (
    <div className={cn("relative flex flex-col justify-center w-[120px] h-[120px] rounded-lg px-2 py-1 hover:scale-105 transition box-border font-bold text-white text-sm cursor-pointer shadow-[0px_2px_4px_rgba(0,0,0,0.15)] bg-emerald-600 hover:bg-emerald-700" , className)}>
      <p className="text-center text-2xl tracking-wide">{ numero }</p>
    </div>
  );
}
