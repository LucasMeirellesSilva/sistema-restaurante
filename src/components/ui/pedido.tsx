import { cn } from "@/lib/utils";
import { Patrick_Hand } from "next/font/google";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";
import Link from "next/link";

import { PedidoModelType } from "@/schemas/pedidoSchema";

type PedidoProps = {
  className?: string
  pedido: PedidoModelType
};

const patrick = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Pedido({ className, pedido }: PedidoProps) {

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className={cn(
          "relative flex flex-col justify-between w-[150px] h-[120px] bg-yellow-400 rounded-[4px] cut-br px-2 box-border",
          patrick.className,
          className
        )}
      >
        <p className="text-end"> { pedido.criadoEm }</p>
        <p className="text-center"> Pedido { pedido.id }</p>
        <div className="flex justify-between">
          <p className="text-start text-sm"> { pedido.valorTotal }</p>
          <p className="text-start text-sm mr-5"> { pedido.autor }</p>
        </div>
        <div className="absolute bottom-0 right-0 bg-orange-400 w-6 h-5"></div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem className="cursor-pointer">
          <Link href={"#"}> Abrir </Link>
        </ContextMenuItem>
        <ContextMenuItem className="cursor-pointer"> Editar </ContextMenuItem>
        <ContextMenuItem className="cursor-pointer"> Cancelar </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
