import { cn } from "@/lib/utils";
import { Patrick_Hand } from "next/font/google";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";

import { PedidoModelType } from "@/schemas/pedidoSchema";
import { UserType } from "@/lib/hooks/useUser";

type PedidoProps = {
  className?: string;
  pedido: PedidoModelType;
  user?: UserType;
  setPedidoSelecionado: () => void;
  abrirPedido: () => void;
  cancelarPedido: () => void;
};

const patrick = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Pedido({
  className,
  pedido,
  user,
  setPedidoSelecionado,
  abrirPedido,
  cancelarPedido,
}: PedidoProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        className={cn(
          "relative flex flex-col justify-between w-[120px] sm:w-[150px] aspect-5/4 text-sm md:text-base bg-yellow-400 rounded-[4px] hover:-translate-y-1 transition cut-br px-2 box-border cursor-pointer shadow-[0px_2px_4px_rgba(0,0,0,0.25)] select-none",
          patrick.className,
          className
        )}
        onClick={() => abrirPedido()}
      >
        <p className="text-end"> {pedido.criadoEmHora}</p>
        <p className="text-center truncate">
          {pedido.cliente ?? `Pedido ${pedido.id}`}{" "}
        </p>
        <div className="flex flex-wrap justify-between overflow-hidden">
          <p className="text-start text-md"> {pedido.valorTotalFormatado}</p>
          <p className="text-start text-md mr-5 truncate"> {pedido.autor}</p>
        </div>
        <div className="absolute bottom-0 right-0 bg-orange-400 w-6 h-5"></div>
      </ContextMenuTrigger>
      {(user?.role === "Admin" || user?.id === pedido.autorId) && (
        <ContextMenuContent>
          <ContextMenuItem
            className="cursor-pointer"
            onClick={() => setPedidoSelecionado()}
          >
            {" "}
            Editar{" "}
          </ContextMenuItem>
          <ContextMenuItem
            className="cursor-pointer"
            onClick={() => cancelarPedido()}
          >
            {" "}
            Cancelar{" "}
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
}
