"use client";

import { useState, useEffect } from "react";
import useProdutosPorCategoria from "@/lib/hooks/useProdutosCategoria";
import useCategorias from "@/lib/hooks/useCategorias";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

import { PedidoModelType } from "@/schemas/pedidoSchema";
import { ItemAdicionalFormType, ItemFormType, ItemModelType } from "@/schemas/itemSchema";
import { PedidoFormType } from "@/schemas/pedidoSchema";
import { PedidoUpdateType } from "@/repository/pedido/updatePedidoService";

import Modal from "@/components/ui/modal";
import FormCliente from "./formCliente";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SelectMesa from "@/components/ui/selectMesa";
import SelectCliente from "@/components/ui/selectCliente";
import ItensPedido from "@/components/ui/itensPedido";
import SeletorCategorias from "@/components/ui/seletorCategorias";
import ProdutosVenda from "@/components/ui/produtosVenda";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";

import { User, createLucideIcon } from "lucide-react";
import { chairsTablePlatter } from "@lucide/lab";

const ChairsTablePlatter = createLucideIcon(
  "chairs-table-platter",
  chairsTablePlatter
);

type FormPedidoProps = {
  pedido?: PedidoModelType;
  mesaSelecionada?: string;
  onClose: () => void;
};

function FormPedido({ pedido, mesaSelecionada, onClose }: FormPedidoProps) {
  const { data: categorias = [], isPending: isCategoriasPending } =
    useCategorias();

  const [categoria, setCategoria] = useState<number | null>(null);
  const [cliente, setCliente] = useState<number | null>(null);
  const [mesa, setMesa] = useState<string | undefined>(
    mesaSelecionada ?? undefined
  );
  const [observacao, setObservacao] = useState("");
  const [modalCliente, setModalCliente] = useState(false);
  const [items, setItems] = useState<ItemModelType[]>([]);

  const mutation = useMutation({
    mutationFn: async (data: PedidoFormType | PedidoUpdateType) => {
      const res = await fetch("/api/pedidos", {
        method: pedido ? "PATCH" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidosPendentes"] });
      onClose();
    },
  });

  useEffect(() => {
    if (categorias.length > 0 && !categoria) {
      setCategoria(categorias[0].id);
    }
  }, [categorias]);

  useEffect(() => {
    if (pedido) {
      setCliente(pedido.clienteId ?? null);
      setMesa(pedido.mesa ? String(Number(pedido.mesa)) : undefined);
      setObservacao(pedido.observacao ?? "");
      setItems(pedido.itens ?? []);
    }
  }, [pedido]);

  const { data: produtos, isPending: isProdutosPending } =
    useProdutosPorCategoria(categoria);

  function handleSubmit() {
    const itemsForm: ItemFormType[] = items.flatMap((item) => {
      const itemBase: ItemFormType = {
        produtoId: item.produtoId!,
        quantidade: 1,
      };

      const adicionais: ItemAdicionalFormType[] = item.adicionais.map((adicional) => ({
        produtoId: adicional.produtoId!,
        quantidade: adicional.quantidade,
      }));

      return {
        ...itemBase,
        ...(item.adicionais && { adicionais: adicionais } ),
      };
    });

    const formData: PedidoFormType | PedidoUpdateType = {
      ...(pedido && { pedidoId: pedido.id } ),
      ...(items && { itens: itemsForm}),
      ...(cliente ? { clienteId: cliente } : { clienteId: null }),
      ...(mesa ? { mesaId: Number(mesa) } : { mesaId: null }),
      ...(observacao && { observacao: observacao }),
    };

    mutation.mutate(formData);
  }

  return (
    <div className={cn("flex flex-col gap-2 w-full lg:h-[80vh] lg:w-[80vw]")}>
      <Modal isOpen={modalCliente} onClose={() => setModalCliente(false)}>
        {modalCliente && <FormCliente onClose={() => setModalCliente(false)}/>}
      </Modal>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4 w-fit">
          <h1 className="w-fit px-6 text-center text-xl font-medium border-b border-neutral-200">
            {pedido ? cn("Pedido", pedido.id) : "Novo pedido"}
          </h1>
          <form className="flex gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cliente">Cliente</Label>
              <div className="flex gap-2 items-center relative">
                <SelectCliente
                  cliente={cliente}
                  setCliente={setCliente}
                  setModalCliente={setModalCliente}
                />
                <User className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
              <Label htmlFor="mesa">Número da Mesa</Label>
              <div className="relative lg:w-64">
                <SelectMesa mesa={mesa} setMesa={setMesa} />
                <ChairsTablePlatter className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>
            <div>
              <Label htmlFor="observacao">
                Observação
                <Textarea
                  id="observacao"
                  value={observacao}
                  className="resize-none"
                  rows={4}
                  onChange={(e) => setObservacao(e.target.value)}
                />
              </Label>
            </div>
          </form>
          <ItensPedido items={items} setItems={setItems} />
        </div>
        <div className="flex-1 min-w-1/2 border border-neutral-200 rounded-lg py-2 overflow-hidden">
          {isCategoriasPending || isProdutosPending ? (
            <div className="h-full flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            <div>
              {!isCategoriasPending && categorias && (
                <SeletorCategorias
                  categoria={categoria}
                  setCategoria={setCategoria}
                  categorias={categorias}
                />
              )}
              {!isProdutosPending && produtos && (
                <ProdutosVenda produtos={produtos} setItems={setItems} />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end items-center gap-2">
        <p className="text-red-500 text-end">
          {mutation.error instanceof Error ? mutation.error.message : null}
        </p>
        <Button className="cursor-pointer" onClick={() => onClose()}>
          Cancelar
        </Button>
        <Button
          className="cursor-pointer bg-emerald-600 hover:bg-emerald-700"
          onClick={() => handleSubmit()}
          disabled={items.length < 1}
        >
          {pedido ? "Editar pedido" : "Criar pedido"}
        </Button>
      </div>
    </div>
  );
}

export default FormPedido;
