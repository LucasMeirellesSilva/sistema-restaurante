"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { Checkbox } from "./checkbox";
import { ChevronDown } from "lucide-react";

import { PedidoModelType } from "@/schemas/pedidoSchema";
import { SelectedType } from "@/app/(private)/ponto-venda/page";
import { cn } from "@/lib/utils";

type SeletorPedidosProps = {
  pedidos: PedidoModelType[];
  selected: SelectedType;
  setSelected: Dispatch<SetStateAction<SelectedType>>;
};

function SeletorPedidos({
  pedidos,
  selected,
  setSelected,
}: SeletorPedidosProps) {
  function handlePedidoSelecionado(pedido: PedidoModelType) {
    // Se já for o selecionado remove
    if (selected?.tipo === "pedido" && selected.pedido.id === pedido.id) {
      setSelected(null);
      return;
    }

    // Se não for altera para o selecionado
    setSelected({
      tipo: "pedido",
      pedido: pedido,
    });
  }

  return pedidos.map((p, i) => {
    // Se o pedido já foi incluído em uma mesa, pula
    if (p.mesa) {
      const jaRenderizado = pedidos
        .slice(0, i)
        .some((anterior) => anterior.mesa === p.mesa);

      if (jaRenderizado) return null;
    }

    // Se tem mesa, pega todos pedidos da mesma mesa
    const pedidosMesa = p.mesa
      ? pedidos.filter((pedido) => pedido.mesa === p.mesa)
      : [p]; // sem mesa = array com 1 pedido

    return (
      <div key={p.id} className="flex">
        {p.mesa ? (
          <Mesa
            numero={p.mesa}
            pedidosMesa={pedidosMesa}
            selected={selected}
            setSelected={setSelected}
          />
        ) : (
          <Pedido
            pedido={p}
            selected={selected}
            handleSelect={() => handlePedidoSelecionado(p)}
            classname={cn("hover:bg-neutral-100" ,selected?.tipo === "pedido" && selected.pedido.id === p.id && "bg-[#f5510a1a] hover:bg-[#f5510a1a]")}
          />
        )}
      </div>
    );
  });
}

export default SeletorPedidos;

type MesaProps = {
  numero: string;
  pedidosMesa: PedidoModelType[];
  selected: SelectedType;
  setSelected: Dispatch<SetStateAction<SelectedType>>;
};

function Mesa({ numero, pedidosMesa, selected, setSelected }: MesaProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleMesaSelecionada() {
    // Se a mesa já está selecionada, remove
    if (selected?.tipo === "mesa" && selected.mesa === numero) {
      setSelected(null);
      return;
    }

    // Se não houver select ou select for qualquer outro além da mesa atual, define como a mesa selecionada.
    setSelected({
      tipo: "mesa",
      mesa: numero,
      pedidos: pedidosMesa,
      pedidosSelecionados: pedidosMesa,
    });
  }

  function handlePedidoMesaSelecionado(pedido: PedidoModelType) {
    // Se não houver nada selecionado, define a mesa e o pedido como único selecionado
    if (!selected || selected.tipo === "pedido") {
      setSelected({
        tipo: "mesa",
        mesa: numero,
        pedidos: pedidosMesa,
        pedidosSelecionados: [pedido],
      });
      return;
    }

    const jaExiste = selected.pedidosSelecionados.some(
      (p) => p.id === pedido.id
    );

    // Se existe, remove
    if (jaExiste) {
      // Se for o último, limpa a lista de selecionados
      if (selected.pedidosSelecionados.length === 1) {
        setSelected(null);
        return;
      }

      setSelected({
        ...selected,
        pedidosSelecionados: selected.pedidosSelecionados.filter(
          (p) => p.id !== pedido.id
        ),
      });
      return;
    }

    // Se não existe, adiciona
    setSelected({
      ...selected,
      pedidosSelecionados: [...selected.pedidosSelecionados, pedido],
    });
  }

  return (
    <div
      className={cn(
        "w-full p-2 select-none",
        selected?.tipo === "mesa" &&
          selected.mesa === numero &&
          "bg-[#f5510a1a]"
      )}
    >
      <div className="flex flex-col">
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => handleMesaSelecionada()}
        >
          <Checkbox
            checked={selected?.tipo === "mesa" && selected.mesa === numero}
          />
          <p className="font-medium">Mesa {numero}</p>
          <ChevronDown
            className={cn(
              "cursor-pointer transition-transform",
              !isOpen && "-rotate-90"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          />
        </div>
        <div
          className={cn(
            "flex flex-col gap-2 py-2 transition-all duration-300 ease-in-out overflow-hidden",
            isOpen ? "max-h-120 pl-4 opacity-100" : "max-h-0 opacity-0 p-0"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {pedidosMesa.map((p) => {
            return (
              <Pedido
                key={p.id}
                pedido={p}
                selected={selected}
                handleSelect={() => handlePedidoMesaSelecionado(p)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

type PedidoProps = {
  pedido: PedidoModelType;
  selected: SelectedType;
  handleSelect: () => void;
  classname?: string;
};

export function Pedido({
  pedido,
  selected,
  handleSelect,
  classname,
}: PedidoProps) {
  return (
    <div
      className={cn(
        "flex justify-between w-full p-2 cursor-pointer select-none",
        classname
      )}
      onClick={() => handleSelect()}
    >
      <div className="flex gap-2 items-center">
        <Checkbox
          checked={
            (selected?.tipo === "pedido" && selected.pedido.id === pedido.id) || (selected?.tipo === "mesa" && selected.pedidosSelecionados.some((p) => p.id === pedido.id))
          }
        />
        {pedido.cliente ? (
          <p className="font-medium">
            Pedido {pedido.id} - {pedido.cliente}
          </p>
        ) : (
          <p className="font-medium">Pedido {pedido.id}</p>
        )}
      </div>
      <p className="tracking-tight font-medium">{pedido.valorTotalFormatado}</p>
    </div>
  );
}
