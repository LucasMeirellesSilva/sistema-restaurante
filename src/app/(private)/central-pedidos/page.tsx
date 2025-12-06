"use client";

import { useState, useEffect, JSX } from "react";

import useEstabelecimentoData from "@/lib/hooks/useEstabelecimentoData";
import usePedidosPendentes from "@/lib/hooks/usePedidosPendentes";
import useUser from "@/lib/hooks/useUser";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pedido from "@/components/ui/pedido";
import Mesa from "@/components/ui/mesa";
import Modal from "@/components/ui/modal";
import FormPedido from "@/components/modal/form/formPedido";
import DetalhesPedido from "@/components/modal/detalhesPedido";
import DetalhesMesa from "@/components/modal/detalhesMesa";
import Loading from "@/components/ui/loading";
import Confirmacao from "@/components/modal/confirmacao";

import { User, Plus, ChevronDown } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { PedidoModelType } from "@/schemas/pedidoSchema";
import { cn } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export type ModalAberto =
  | { tipo: "criarPedido" }
  | { tipo: "criarPedidoComMesa"; mesa: string }
  | { tipo: "editarPedido"; pedido: PedidoModelType }
  | { tipo: "detalhesPedido"; pedido: PedidoModelType }
  | { tipo: "cancelarPedido"; pedido: PedidoModelType }
  | { tipo: "detalhesMesa"; mesa: string, pedidos: PedidoModelType[] }
  | { tipo: "cliente" }
  | null;

export default function CentralPedidos() {
  const [mesasLivres, setMesasLivres] = useState<JSX.Element[]>([]);
  const [research, setResearch] = useState("");
  const [mesaContainerOpen, setMesaContainerOpen] = useState(true);
  const [modalAberto, setModalAberto] = useState<ModalAberto>(null);

  const { data: pedidos, isPending: isPedidosPendentesPending } =
    usePedidosPendentes();
  const { data: estabelecimento } = useEstabelecimentoData();
  const { data: user } = useUser();

  const pedidosPorCliente =
    research && pedidos
      ? pedidos.filter((p) =>
        p.cliente?.toLowerCase().includes(research.toLowerCase())
      )
      : [];

  const cancelarPedido = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch("/api/pedidos/cancelar", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidosPendentes"] });
      setModalAberto(null);
    },
  });

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
              user={user}
              setMesaSelecionada={() =>
                setModalAberto({ tipo: "criarPedidoComMesa", mesa: numero })
              }
            />
          );
        }
      }

      setMesasLivres(novasMesas);
    }
  }, [estabelecimento, pedidos, user]);

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
          className="flex justify-center w-[120px] sm:w-[150px] aspect-5/4"
        >
          {p.mesa ? (
            <Mesa
              numero={p.mesa}
              user={user}
              pedidos={pedidosDaMesa}
              setPedidos={() =>
                setModalAberto({
                  tipo: "detalhesMesa",
                  mesa: p.mesa!,
                  pedidos: pedidosDaMesa,
                })
              }
              setPedidoSelecionado={setModalAberto}
              setMesaSelecionada={() =>
                setModalAberto({ tipo: "criarPedidoComMesa", mesa: p.mesa! })
              }
              cancelarPedido={setModalAberto}
            />
          ) : (
            <Pedido
              pedido={p}
              user={user}
              setPedidoSelecionado={() =>
                setModalAberto({ tipo: "editarPedido", pedido: p })
              }
              abrirPedido={() =>
                setModalAberto({ tipo: "detalhesPedido", pedido: p })
              }
              cancelarPedido={() =>
                setModalAberto({ tipo: "cancelarPedido", pedido: p })
              }
            />
          )}
        </motion.div>
      );
    });
  }

  function handleCancelarPedido() {
    if (modalAberto?.tipo !== "cancelarPedido") return;

    cancelarPedido.mutate(modalAberto.pedido.id);
  }

  return (
    <div className="flex flex-col gap-4 md:gap-0 min-h-screen items-center sm:w-4/5 mx-auto lg:w-3/4">
      {/* Modal dinâmico */}
      <Modal isOpen={!!modalAberto} onClose={() => setModalAberto(null)}>
        {modalAberto?.tipo === "criarPedido" && (
          <FormPedido onClose={() => setModalAberto(null)} />
        )}
        {modalAberto?.tipo === "criarPedidoComMesa" && (
          <FormPedido
            mesaSelecionada={modalAberto.mesa}
            onClose={() => setModalAberto(null)}
          />
        )}
        {modalAberto?.tipo === "editarPedido" && (
          <FormPedido
            pedido={modalAberto.pedido}
            onClose={() => setModalAberto(null)}
          />
        )}
        {modalAberto?.tipo === "detalhesPedido" && (
          <DetalhesPedido pedido={modalAberto.pedido} />
        )}
        {modalAberto?.tipo === "detalhesMesa" && (
          <DetalhesMesa mesa={modalAberto.mesa} pedidos={modalAberto.pedidos} />
        )}
        {modalAberto?.tipo === "cancelarPedido" && (
          <Confirmacao
            handleConfirmation={handleCancelarPedido}
            onClose={() => setModalAberto(null)}
          >
            Tem certeza que deseja cancelar o pedido {modalAberto.pedido.id}?
          </Confirmacao>
        )}
      </Modal>

      <h1 className="text-center font-semibold text-xl tracking-tight">
        Central de Pedidos
      </h1>
      <div className="flex flex-col-reverse md:flex-row flex-wrap items-center gap-2 md:gap-12">
        <div className="relative">
          <User
            className="absolute inset-0 my-auto ml-2 text-neutral-500"
            strokeWidth={1.5}
          />
          <Input
            className="bg-white indent-8 w-48 md:w-64"
            type="text"
            placeholder="Filtrar por cliente"
            onChange={(e) => setResearch(e.target.value)}
          />
        </div>
        <div className="relative w-fit">
          <Image
            src="/images/bttnBorder.svg"
            alt=""
            width={200}
            height={128}
            className="select-none hidden md:block"
            draggable={false}
            unoptimized
          />
          <Button
            className="md:absolute md:py-5 bg-orange-600 hover:bg-orange-600 cursor-pointer hover:shadow-lg inset-0 my-auto mx-auto w-fit"
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
      <motion.div layout className="flex flex-wrap items-center gap-2 sm:gap-4 md:m-4">
        <AnimatePresence>
          {isPedidosPendentesPending && <Loading />}

          {!isPedidosPendentesPending &&
            pedidos &&
            (research
              ? renderPedidos(pedidosPorCliente)
              : renderPedidos(pedidos))}

          {!isPedidosPendentesPending && !pedidos?.length && (
            <p className="text-sm">Nenhum pedido no momento.</p>
          )}
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
            {mesasLivres.length > 0 
            ? mesasLivres 
            : <p className="text-sm">Nenhuma mesa livre ou registrada.</p>}
          </motion.div>)

        }
      </AnimatePresence>
    </div>
  );
}
