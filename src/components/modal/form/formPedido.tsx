"use client";

import { useState, useEffect } from "react";
import useProdutosPorCategoria from "@/lib/hooks/useProdutosCategorias";
import useCategorias from "@/lib/hooks/useCategorias";

import { cn } from "@/lib/utils";

import { PedidoModelType } from "@/schemas/pedidoSchema";
import { ItemFormType, ItemModelType } from "@/schemas/itemSchema";

import Modal from "@/components/ui/modal";
import FormCliente from "./formCliente";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SelectMesa from "@/components/ui/selectMesa";
import SelectCliente from "@/components/ui/selectCliente";
import ProdutosVenda from "@/components/ui/produtosVenda";
import { Button } from "@/components/ui/button";

import { User, createLucideIcon } from "lucide-react";
import { chairsTablePlatter } from "@lucide/lab";
import Loading from "@/components/ui/loading";

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
  const [modalCliente, setModalCliente] = useState(false);
  const [items, setItems] = useState<ItemModelType[]>([]);

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
        produtoId: item.id,
        quantidade: 1,
      };

      const adicionais: ItemFormType[] = item.adicionais.map((adicional) => ({
        produtoId: adicional.id,
        quantidade: adicional.quantidade,
        pertenceId: item.id,
      }));

      return [itemBase, ...adicionais];
    });
  }

  function handleItemRemoval(combinedId: string) {
    setItems((prev) => prev.filter((item) => cn(item.id, ...item.adicionais.map((a) => String(a.id) + String(a.quantidade ))) !== combinedId));
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  return (
    <div className="flex flex-col gap-2 w-screen">
      <Modal isOpen={modalCliente} onClose={() => setModalCliente(false)}>
        {modalCliente && <FormCliente />}
      </Modal>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4 w-fit">
          <h1 className="w-fit px-6 text-center text-xl font-medium border-b border-neutral-200">
            Novo Pedido
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
                <Textarea id="observacao" className="resize-none" rows={4} />
              </Label>
            </div>
          </form>
          <div className="flex flex-col gap-2 overflow-y-auto h-106 scrollbar-none">
            <h2 className="font-medium">Itens do Pedido</h2>
            {items &&
              items.map((item) => (
                <div
                  key={cn(item.id, ...item.adicionais.map((a) => String(a.id) + String(a.quantidade)))}
                  className="flex flex-col gap-0.5 border-b"
                >
                  <div className="flex justify-between">
                    <p>
                      {item.quantidade}x {item.produto}
                    </p>
                    <p>{item.valorUnitarioFormatado}</p>
                  </div>
                  {item.adicionais &&
                    item.adicionais.map((adicional) => (
                      <div
                        key={adicional.id}
                        className="flex justify-between pl-5"
                      >
                        <li>
                          {adicional.quantidade}x {adicional.produto}
                        </li>
                        <p className="tracking-tight">
                          {formatCurrency(
                            adicional.quantidade * adicional.valorUnitario
                          )}
                        </p>
                      </div>
                    ))}
                  <div className="flex justify-between">
                    <button
                      className="cursor-pointer text-red-500 font-medium text-sm select-none"
                      onClick={() => handleItemRemoval(cn(item.id, ...item.adicionais.map((a) => String(a.id) + String(a.quantidade))))}
                    >
                      Remover
                    </button>
                    {/*
                    Fórmula de valor = (soma dos adicionais (valor_un * quantidade) * quantidade do item) + valor inicial (valor_un * quantidade)
                    */}
                    <p className="border-t font-medium">
                      {formatCurrency(
                        item.adicionais.reduce(
                          (acc, adicional) =>
                            acc +
                            item.quantidade *
                              (adicional.valorUnitario * adicional.quantidade),
                          item.valorUnitario * item.quantidade
                        )
                      )}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="flex-1 min-w-1/2 border border-neutral-200 rounded-lg py-2 overflow-hidden">
          {isCategoriasPending || isProdutosPending ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap gap-1 space-y-1">
                {!isCategoriasPending &&
                  categorias?.map((cat) => (
                    <div
                      className="relative flex items-center gap-2 font-medium"
                      key={cat.id}
                    >
                      <div
                        className={cn(
                          "px-3 py-1.5 mx-2 cursor-pointer rounded-sm hover:bg-neutral-100 select-none",
                          cat.id === categoria &&
                            "bg-orange-600 hover:bg-orange-600 text-white shadow-md"
                        )}
                        onClick={() => setCategoria(cat.id)}
                      >
                        {cat.nome}
                      </div>
                      <div className="absolute top-1/2 right-0 h-1/2 -translate-y-1/2 border-r"></div>
                    </div>
                  ))}
              </div>
              {!isProdutosPending && produtos && (
                <ProdutosVenda produtos={produtos} setItems={setItems} />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button className="cursor-pointer" onClick={() => onClose()}>Cancelar</Button>
        <Button className="cursor-pointer bg-emerald-600 hover:bg-emerald-700" onClick={() => handleSubmit()}>Criar pedido</Button>
      </div>
    </div>
  );
}

export default FormPedido;
