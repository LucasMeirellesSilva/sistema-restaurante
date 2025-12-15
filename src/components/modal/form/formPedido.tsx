"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import useProdutosPorCategoria from "@/lib/hooks/useProdutosCategoria";
import useCategorias from "@/lib/hooks/useCategorias";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

import { PedidoModelType, PedidoUpdateType } from "@/schemas/pedidoSchema";
import {
  ItemAdicionalFormType,
  ItemFormType,
  ItemModelType,
} from "@/schemas/itemSchema";
import { PedidoFormType } from "@/schemas/pedidoSchema";

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

import { User, XCircle, createLucideIcon } from "lucide-react";
import { chairsTablePlatter } from "@lucide/lab";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/ui/errorMessage";
import useUser from "@/lib/hooks/useUser";

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
  const [cliente, setCliente] = useState<number | null>(
    pedido?.clienteId ?? null
  );
  const [mesa, setMesa] = useState<string | undefined>(
    mesaSelecionada ?? pedido?.mesa ?? undefined
  );
  const [observacao, setObservacao] = useState(pedido?.observacao ?? "");
  const [modalCliente, setModalCliente] = useState(false);
  const [items, setItems] = useState<ItemModelType[]>(pedido?.itens ?? []);
  const [modalProdutos, setModalProdutos] = useState(false);

  const createOrPatchPedido = useMutation({
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

  function handleSubmit() {
    const itemsForm: ItemFormType[] = items.flatMap((item) => {
      const itemBase: ItemFormType = {
        produtoId: item.produtoId!,
        quantidade: item.quantidade,
      };

      const adicionais: ItemAdicionalFormType[] = item.adicionais.map(
        (adicional) => ({
          produtoId: adicional.produtoId!,
          quantidade: adicional.quantidade,
        })
      );

      return {
        ...itemBase,
        ...(item.adicionais && { adicionais: adicionais }),
      };
    });

    const formData = {
      ...(pedido && { pedidoId: pedido.id }),
      itens: itemsForm,
      clienteId: cliente,
      mesaId: Number(mesa),
      observacao: observacao,
    };

    createOrPatchPedido.mutate(formData);
  }

  return (
    <div className={cn("basis-auto flex flex-col gap-2 px-4")}>
      <Modal isOpen={modalCliente} onClose={() => setModalCliente(false)}>
        {modalCliente && <FormCliente onClose={() => setModalCliente(false)} />}
      </Modal>
      <Modal isOpen={modalProdutos} onClose={() => setModalProdutos(false)}>
        {modalProdutos && (
          <ModalProdutos
            items={items}
            setItems={setItems}
            onClose={() => setModalProdutos(false)}
          />
        )}
      </Modal>
      <div className=" h-full flex gap-4">
        <div className="lg:flex-1 mx-auto flex flex-col gap-4 w-fit">
          <h1 className="w-fit px-6 mx-auto lg:mx-none md:text-xl font-medium border-b border-neutral-200">
            {pedido ? cn("Pedido", pedido.id) : "Novo Pedido"}
          </h1>
          <form className="flex flex-col lg:flex-row md:gap-2 justify-center lg:justify-start">
            <div className="flex flex-col gap-2 min-w-48">
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
              <div className="relative min-w-48">
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
                  className="resize-none lg:w-48 lg:h-25"
                  onChange={(e) => setObservacao(e.target.value)}
                />
              </Label>
            </div>
          </form>
          <div className="h-full overflow-hidden flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-medium">Itens do Pedido</h2>
              <Button
                className="lg:hidden w-fit ml-auto px-2 bg-orange-600"
                onClick={() => setModalProdutos(true)}
              >
                Adicionar Item
              </Button>
            </div>
            {items.length < 1 && (
              <p className="font-light text-sm md:text-base">
                Adicione itens para criar o pedido.
              </p>
            )}
            <ItensPedido items={items} setItems={setItems} />
          </div>
        </div>
        <div className="hidden lg:block border border-neutral-200 rounded-lg py-2 overflow-hidden">
          <ModalProdutos items={items} setItems={setItems} />
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 mt-auto">
        {createOrPatchPedido.error && (
          <ErrorMessage error={createOrPatchPedido.error} />
        )}
        <Button className="cursor-pointer" onClick={() => onClose()}>
          Cancelar
        </Button>
        <Button
          className="cursor-pointer bg-emerald-600 hover:bg-emerald-700"
          onClick={() => handleSubmit()}
          disabled={items.length < 1 || createOrPatchPedido.isPending}
        >
          {pedido ? "Editar pedido" : "Criar pedido"}
        </Button>
      </div>
    </div>
  );
}

export default FormPedido;

type ModalProdutosProps = {
  items: ItemModelType[];
  setItems: Dispatch<SetStateAction<ItemModelType[]>>;
  onClose?: () => void;
};

function ModalProdutos({ items, setItems, onClose }: ModalProdutosProps) {
  const { data: user } = useUser();
  const router = useRouter();
  const [categoria, setCategoria] = useState<number | null>(null);

  const { data: categorias = [], isPending: isCategoriasPending } =
    useCategorias();

  const {
    data: produtos,
    isLoading: isProdutosLoading,
    isEnabled: isProdutosEnabled,
  } = useProdutosPorCategoria(categoria);

  const containerSize =
    "h-[90vh] md:h-[70vh] w-[90vw] md:w-[30vw] xl:w-[40vw] 2xl:w-[50vw] transition-all";

  useEffect(() => {
    if (categorias && categorias.length > 0 && !categoria) {
      setCategoria(categorias[0].id);
    }
  }, [categorias, categoria]);

  return isCategoriasPending ? (
    <div className={cn(containerSize, "")}>
      <Loading className="m-auto" />
    </div>
  ) : (
    <div className="h-[70vh] flex-col items-center justify-center">
      <XCircle
        size={32}
        strokeWidth={1}
        className="md:hidden text-neutral-700 ml-auto mr-2"
        onClick={() => onClose && onClose()}
      />
      {items.length > 0 && (
        <p className="text-sm text-center sm:hidden text-emerald-600">
          {items.at(-1)?.produto} adicionado com sucesso.
        </p>
      )}
      <h2 className="md:hidden font-medium my-2">Categorias</h2>
      {categorias && categorias?.length > 0 ? (
        <SeletorCategorias
          categoria={categoria}
          setCategoria={setCategoria}
          categorias={categorias}
        />
      ) : (
        <div
          className={cn(
            containerSize,
            "flex flex-col items-center justify-center space-y-4"
          )}
        >
          <p className="text-center text-neutral-700">
            Nenhuma categoria registrada.
          </p>
          <Image
            src="/images/noData.svg"
            alt=""
            width={200}
            height={128}
            className="select-none"
            draggable={false}
          />
          {user && user.role === "Admin" && (
            <Button
              className="cursor-pointer bg-orange-600 hover:bg-orange-500"
              onClick={() => router.push("/categorias")}
            >
              Ir para Categorias
            </Button>
          )}
        </div>
      )}
      {isProdutosLoading ? (
        <div
          className={cn(
            containerSize,
            "flex items-center justify-center h-[90vh]"
          )}
        >
          <Loading />
        </div>
      ) : (
        isProdutosEnabled &&
        (produtos && produtos.normais.length > 0 ? (
          <div className={cn(containerSize, "overflow-hidden")}>
            <ProdutosVenda produtos={produtos} setItems={setItems} />
          </div>
        ) : (
          <div
            className={cn(
              containerSize,
              "flex flex-col items-center justify-center space-y-4"
            )}
          >
            <p className="text-center text-neutral-700">
              Nenhum produto registrado nesta categoria.
            </p>
            <Image
              src="/images/noData.svg"
              alt=""
              width={200}
              height={128}
              className="select-none"
              draggable={false}
            />
            {user && user.role === "Admin" && (
              <Button
                className="cursor-pointer bg-orange-600 hover:bg-orange-500"
                onClick={() => router.push("/produtos")}
              >
                Ir para Produtos
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
