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
import Image from "next/image";

import { User, createLucideIcon } from "lucide-react";
import { chairsTablePlatter } from "@lucide/lab";
import { useRouter } from "next/navigation";

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
  const router = useRouter()

  const { data: categorias = [], isPending: isCategoriasPending } =
    useCategorias();

  const [categoria, setCategoria] = useState<number | null>(null);
  const [cliente, setCliente] = useState<number | null>(pedido?.clienteId ?? null);
  const [mesa, setMesa] = useState<string | undefined>(mesaSelecionada ?? (pedido?.mesa ?? undefined));
  const [observacao, setObservacao] = useState(pedido?.observacao ?? "");
  const [modalCliente, setModalCliente] = useState(false);
  const [items, setItems] = useState<ItemModelType[]>(pedido?.itens ?? []);

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
        ...(item.adicionais && { adicionais: adicionais }),
      };
    });

    const formData: PedidoFormType = {
      ...(pedido && { pedidoId: pedido.id }),
      ...(items && { itens: itemsForm }),
      ...(cliente && { clienteId: cliente }),
      ...(mesa && { mesaId: Number(mesa) }),
      ...(observacao && { observacao: observacao }),
    };

    mutation.mutate(formData);
  }

  return (
    <div className={cn("flex flex-col gap-2 h-[80vh] w-[80vw]")}>
      <Modal isOpen={modalCliente} onClose={() => setModalCliente(false)}>
        {modalCliente && <FormCliente onClose={() => setModalCliente(false)} />}
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
        <div className="flex-1 min-w-1/2 min-h-[70vh] border border-neutral-200 rounded-lg py-2 overflow-hidden">
          {isCategoriasPending ? (
            <div className="h-full flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              {categorias?.length ? (
                <SeletorCategorias
                  categoria={categoria}
                  setCategoria={setCategoria}
                  categorias={categorias}
                />
              ) :
                <div className="flex flex-col items-center space-y-4 h-fit my-auto">
                  <p className="text-center text-neutral-700">Nenhuma categoria registrada.</p>
                  <Image
                    src="/images/noData.svg"
                    alt=""
                    width={200}
                    height={128}
                    className="select-none"
                    draggable={false}
                  />
                  <Button className="cursor-pointer bg-orange-600 hover:bg-orange-500" onClick={() => router.push("/catalogo")}>Ir para Catálogo</Button>
                </div>}
              {!isProdutosPending && (
                produtos ?
                <ProdutosVenda produtos={produtos} setItems={setItems} />
                :
                <div className="flex flex-col items-center space-y-4 h-fit my-auto">
                  <p className="text-center text-neutral-700">Nenhum produto registrado.</p>
                  <Image
                    src="/images/noData.svg"
                    alt=""
                    width={200}
                    height={128}
                    className="select-none"
                    draggable={false}
                  />
                  <Button className="cursor-pointer bg-orange-600 hover:bg-orange-500" onClick={() => router.push("/catalogo")}>Ir para Catálogo</Button>
                </div>
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
