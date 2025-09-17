'use client'

import { useState } from "react";

// export type Pedido {
    
// }

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Historico() {
  
  return (
    <div className="flex flex-col items-center w-2/3 mx-auto">
      <h1 className="text-center font-semibold text-xl tracking-tight">
        Central de Pedidos
      </h1>
      <div className="flex items-center gap-12">
        <div className="relative">
          <Input
            className="bg-white indent-8 w-80"
            type="text"
            placeholder="Filtrar por cliente"
          />
        </div>
        <div className="relative w-fit">
          <Button className="absolute py-5 bg-orange-600 hover:bg-orange-600 cursor-pointer hover:shadow-lg hover:scale-105 inset-0 my-auto mx-auto w-fit">
            Criar Pedido
          </Button>
        </div>
      </div>
      <h2 className="text-start font-semibold text-lg tracking-tight text-neutral-800 w-full">
        Pedidos em Aberto
      </h2>
      <div className="flex flex-wrap gap-4 my-4">
        
      </div>
    </div>
  );
}
