"use client";

import { useState, useEffect, JSX } from "react";

import useEstabelecimentoData from "@/lib/hooks/useEstabelecimentoData";
import usePedidosPendentes from "@/lib/hooks/usePedidosPendentes";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pedido from "@/components/ui/pedido";
import Mesa from "@/components/ui/mesa";
import Modal from "@/components/ui/modal";
import FormPedido from "@/components/modal/form/formPedido";
import DetalhesPedido from "@/components/modal/detalhesPedido";
import DetalhesMesa from "@/components/modal/detalhesMesa";
import { User, Plus, ChevronDown } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { PedidoModelType } from "@/schemas/pedidoSchema";
import { cn } from "@/lib/utils";

export type ModalAberto =
  | { tipo: "criarPedido" }
  | { tipo: "criarPedidoComMesa"; mesa: string }
  | { tipo: "editarPedido"; pedido: PedidoModelType }
  | { tipo: "detalhesPedido"; pedido: PedidoModelType }
  | { tipo: "detalhesMesa"; pedidos: PedidoModelType[] }
  | { tipo: "cliente" }
  | null;

export default function CentralPedidos() {
  const [mesasLivres, setMesasLivres] = useState<JSX.Element[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [mesaContainerOpen, setMesaContainerOpen] = useState(true);
  const [modalAberto, setModalAberto] = useState<ModalAberto>(null);
  const [size, setSize] = useState("mx-16")

  const { data: pedidos, isPending: isPedidosPendentesPending } = usePedidosPendentes();
  const { data: estabelecimento } = useEstabelecimentoData();

  const pedidosPorCliente =
    pesquisa && pedidos
      ? pedidos.filter((p) =>
          p.cliente?.toLowerCase().includes(pesquisa.toLowerCase())
        )
      : [];

  useEffect(() => {
    if (estabelecimento) {
      let mesasOcupadas: number[] = [];
      if (pedidos) {
        mesasOcupadas = pedidos
          .filter((p) => p.mesa)
          .map((p) => Number(p.mesa));
      }

      const novasMesas: JSX.Element[] = [];

      for (let i = 1; i <= estabelecimento.numeroMesas; i++) {
        if (!mesasOcupadas.includes(i)) {
          const numero = i < 10 ? `0${i}` : `${i}`;
          novasMesas.push(
            <Mesa
              key={i}
              numero={numero}
              setMesaSelecionada={() =>
                setModalAberto({ tipo: "criarPedidoComMesa", mesa: numero })
              }
            />
          );
        }
      }

      setMesasLivres(novasMesas);
    }
  }, [estabelecimento, pedidos]);

  function renderPedidos(listaPedidos: PedidoModelType[]) {
    return listaPedidos.map((p, i) => {
      // Se o pedido já foi incluído em outra mesa, pula
      if (p.mesa) {
        const jaRenderizado = listaPedidos
          .slice(0, i)
          .some((anterior) => anterior.mesa === p.mesa);

        if (jaRenderizado) return null;
      }

      // Se tem mesa, pega todos pedidos da mesma mesa
      const pedidosDaMesa = p.mesa
        ? listaPedidos.filter((pedido) => pedido.mesa === p.mesa)
        : [p]; // sem mesa = array com 1 pedido

      return (
        <motion.div
          key={p.id}
          layout
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {p.mesa ? (
            pedidosDaMesa.length > 1 ? (
              <Mesa
                numero={p.mesa}
                pedidos={pedidosDaMesa}
                setPedidos={() =>
                  setModalAberto({
                    tipo: "detalhesMesa",
                    pedidos: pedidosDaMesa,
                  })
                }
                setPedidoSelecionado={setModalAberto}
              />
            ) : (
              <Mesa numero={p.mesa} pedidos={pedidosDaMesa} />
            )
          ) : (
            <Pedido
              pedido={p}
              setPedidoSelecionado={() =>
                setModalAberto({ tipo: "editarPedido", pedido: p })
              }
              abrirPedido={() =>
                setModalAberto({ tipo: "detalhesPedido", pedido: p })
              }
            />
          )}
        </motion.div>
      );
    });
  }

  return (
    <div className={cn("flex flex-col items-center w-full mx-auto lg:w-3/4", size)}>
      {/* Modal dinâmico */}
      <Modal isOpen={!!modalAberto} onClose={() => setModalAberto(null)}>
        {modalAberto?.tipo === "criarPedido" && <FormPedido />}
        {modalAberto?.tipo === "criarPedidoComMesa" && (
          <FormPedido mesaSelecionada={modalAberto.mesa} />
        )}
        {modalAberto?.tipo === "editarPedido" && (
          <FormPedido pedido={modalAberto.pedido} />
        )}
        {modalAberto?.tipo === "detalhesPedido" && (
          <DetalhesPedido pedido={modalAberto.pedido} />
        )}
        {modalAberto?.tipo === "detalhesMesa" && (
          <DetalhesMesa pedidos={modalAberto.pedidos} />
        )}
      </Modal>

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
            onChange={(e) => setPesquisa(e.target.value)}
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
          <Button
            className="absolute py-5 bg-orange-600 hover:bg-orange-600 cursor-pointer hover:shadow-lg hover:scale-105 inset-0 my-auto mx-auto w-fit"
            onClick={() => setModalAberto({ tipo: "criarPedido" })}
          >
            <Plus size={32} className="scale-120" />
            Criar Pedido
          </Button>
        </div>
      </div>
      <h2 className="mb-2 text-start font-semibold text-lg tracking-tight text-neutral-800 w-full">
        Pedidos em Aberto
      </h2>
      <input type="button" value="Mudar" onClick={() => setSize(size === "px-16" ? "px-32" : "px-16")}/>
      <motion.div layout className="flex flex-wrap gap-4 m-4">
        <AnimatePresence>
          {!isPedidosPendentesPending &&
            pedidos &&
            pesquisa &&
            renderPedidos(pedidosPorCliente)}

          {!isPedidosPendentesPending &&
            pedidos &&
            !pesquisa &&
            renderPedidos(pedidos)}
        </AnimatePresence>
      </motion.div>
      <div className="flex items-center justify-start w-full gap-2">
        <h2 className="my-2 text-start font-semibold text-lg tracking-tight text-neutral-800">
          Mesas Livres
        </h2>
        <ChevronDown
          className={cn(
            "cursor-pointer transition-transform",
            !mesaContainerOpen && "-rotate-90"
          )}
          onClick={() => setMesaContainerOpen(!mesaContainerOpen)}
        />
      </div>
      <AnimatePresence>
        {mesaContainerOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="flex flex-wrap gap-4 m-4"
          >
            {mesasLivres}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}