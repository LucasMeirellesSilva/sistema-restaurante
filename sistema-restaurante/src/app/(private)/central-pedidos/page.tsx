import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pedido from "@/components/ui/pedido";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ListFilter, User, Plus } from "lucide-react";
import Image from "next/image";

import image from "../../../../public/undraw_idea_hz8b 2.svg";

export default function CentralPedidos() {
  return (
    <div className="flex flex-col items-center w-2/3 mx-auto">
      <h1 className="text-center font-semibold text-xl tracking-tight">
        Central de Pedidos
      </h1>
      <div className="flex items-center gap-12">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-sm flex items-center gap-1 whitespace-nowrap select-none cursor-pointer">
            <ListFilter width={24} height={24} className="text-neutral-700" />
            Ordenar por: Horário
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Horário</DropdownMenuItem>
            <DropdownMenuItem>Autor</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            src={image}
            alt=""
            className="h-32 w-[200px] select-none"
            draggable={false}
          />
          <Button className="absolute py-5 bg-orange-600 hover:bg-orange-600 cursor-pointer hover:shadow-lg inset-0 my-auto mx-auto w-fit">
            <Plus size={32} />
            Criar Pedido
          </Button>
        </div>
      </div>
      <h2 className="text-start font-semibold text-lg tracking-tight text-neutral-700 w-full">
        Pedidos Abertos
      </h2>
      <div className="flex flex-wrap gap-4 my-4">
        
      </div>
    </div>
  );
}
