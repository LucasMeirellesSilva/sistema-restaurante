import { cn } from "@/lib/utils";
import { Patrick_Hand } from "next/font/google";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";
import Link from "next/link";

// import { Decimal } from "@prisma/client/runtime/library";

type PedidoType = {
  id: number
  criadoEm: Date
  cliente: string
  autor: string
  valorTotal: string
}

type PedidoProps = {
  className?: string
  pedido: PedidoType
}

const patrick = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Pedido({ className, pedido }: PedidoProps) {
  const data = new Date(pedido.criadoEm);

// Formatar a data no fuso horário brasileiro (Brasília, UTC-3)
  const horaFormatada = data.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",  // Fuso horário brasileiro
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className={cn(
          "relative flex flex-col justify-between w-[150px] h-[120px] bg-yellow-400 rounded-[4px] shadow-lg cut-br px-2 box-border",
          patrick.className,
          className
        )}
      >
        <p className="text-end">{ horaFormatada }</p>
        <p className="text-center">Pedido { pedido.id }</p>
        <div className="flex justify-between">
          <p className="text-start text-sm">{ pedido.valorTotal }</p>
          <p className="text-start text-sm mr-5">{ pedido.autor }</p>
        </div>
        <div className="absolute bottom-0 right-0 bg-orange-400 w-6 h-5"></div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Link href={"#"}>Abrir</Link>
        </ContextMenuItem>
        <ContextMenuItem>Editar</ContextMenuItem>
        <ContextMenuItem>Cancelar</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
