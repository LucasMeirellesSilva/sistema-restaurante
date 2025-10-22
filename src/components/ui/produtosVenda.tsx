"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";

import InputQuantidade from "./inputQuantidade";

import { ProdutosPorCategoria } from "@/lib/hooks/useProdutosCategorias";
import { ProdutoType } from "@/lib/hooks/useProdutosCategorias";
import { ItemModelType, AdicionalModelType } from "@/schemas/itemSchema";
import { cn } from "@/lib/utils";
import { isEqual } from "lodash";


import { ArrowDownUp, ChevronDown, Plus } from "lucide-react";
import { Button } from "./button";

const iconColor = "text-neutral-500";

type ProdutosVendaProps = {
  produtos: ProdutosPorCategoria;
  setItems: Dispatch<SetStateAction<ItemModelType[]>>;
};

function ProdutosVenda({ produtos, setItems }: ProdutosVendaProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  function handleToggle(id: number) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <>
      <div className="flex justify-between border-b font-medium py-1 pl-2 pr-10">
        <p>Nome</p>
        <p className="flex gap-1 items-center cursor-pointer">
          Valor <ArrowDownUp size={20} className={cn(iconColor)} />
        </p>
      </div>
      <div className="flex flex-col overflow-y-auto h-140 select-none">
        {produtos.normais.map((produto) => (
          <ProdutoItem
            produto={produto}
            adicionais={produtos.adicionais}
            isOpen={openId === produto.id}
            setItems={setItems}
            onToggle={handleToggle}
          ></ProdutoItem>
        ))}
      </div>
    </>
  );
}

export default ProdutosVenda;

type ProdutoItemProps = {
  produto: ProdutoType;
  adicionais: ProdutoType[];
  isOpen: boolean;
  setItems: Dispatch<SetStateAction<ItemModelType[]>>;
  onToggle: (id: number) => void;
};

type AdicionalType = Omit<AdicionalModelType, "quantidade"> & {
  quantidade: number | null;
};

function ProdutoItem({
  produto,
  adicionais,
  isOpen,
  setItems,
  onToggle,
}: ProdutoItemProps) {
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<
    AdicionalModelType[]
  >([]);

  // Função responsável por controlar a adição e remoção de adicionais de um produto base.
  function handleQuantidadeChange(adicional: AdicionalType) {
    setAdicionaisSelecionados((prev) => {
      const index = prev.findIndex((item) => item.id === adicional.id);

      // Se quantidade for null -> remove o adicional da lista.
      if (adicional.quantidade === null) {
        if (index === -1) return prev;
        return prev.filter((item) => item.id !== adicional.id);
      }

      const adicionalValido = {
        ...adicional,
        quantidade: adicional.quantidade as number,
      };

      // Se não existe -> adiciona com a quantidade informada.
      if (index === -1) {
        return [...prev, adicionalValido];
      }

      // Se já existe -> atualiza a quantidade.
      return prev.map((item) =>
        item.id === adicional.id
          ? { ...item, quantidade: adicional.quantidade! }
          : item
      );
    });
  }

  function handleAdicionarItem() {
    const novoItem: ItemModelType = {
      id: produto.id,
      produto: produto.nome,
      valorUnitarioFormatado: produto.valorFormatado,
      valorUnitario: Number(produto.valor),
      quantidade: 1,
      adicionais: adicionaisSelecionados,
    };

    // Função que "normaliza" o item antes de comparar devido ao fato de que adicionais podem ser adicionados em ordem diferente.
    function normalizar(item: ItemModelType) {
      return {
        ...item,
        // Garante que os adicionais sempre fiquem em ordem fixa
        adicionais: [...item.adicionais].sort((a, b) => a.id - b.id),
        // Ignora quantidade na comparação
        quantidade: 0,
      };
    }

    setItems((prev) => {
      const itemExistente = prev.find((item) =>
        isEqual(normalizar(item), normalizar(novoItem))
      );

      if (itemExistente) {
        // Se já existir, incrementa a quantidade
        return prev.map((item) =>
          isEqual(normalizar(item), normalizar(novoItem))
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        // Caso contrário, adiciona o novo item
        return [...prev, novoItem];
      }
    });
  }

  return (
    <div
      key={produto.id}
      className={cn(
        "flex-col transition-all px-2 hover:bg-neutral-100",
        isOpen && "bg-neutral-100"
      )}
      onClick={() => onToggle(produto.id)}
    >
      <div className="flex justify-between gap-2 py-2 cursor-pointer">
        {produto.nome}
        <div className="flex gap-2 font-medium text-neutral-800">
          {produto.valorFormatado}
          <ChevronDown
            className={cn(
              "w-5 cursor-pointer transition-transform",
              iconColor,
              isOpen && "-rotate-180"
            )}
          />
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col gap-2 pb-2 transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-120 px-2 opacity-100" : "max-h-0 opacity-0 p-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {produto.descricao && (
          <p className="font-thin">Descrição: {produto.descricao}</p>
        )}

        <h2 className="font-medium">Adicionais</h2>
        <div className="flex flex-wrap gap-2">
          {adicionais.map((adicional) => (
            <AdicionalItem
              adicional={adicional}
              handleQuantidadeChange={handleQuantidadeChange}
            />
          ))}
        </div>
        <div className="flex justify-end px-2 pb">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
            onClick={() => handleAdicionarItem()}
          >
            Adicionar ao Pedido
          </Button>
        </div>
      </div>
    </div>
  );
}

type AdicionalItemProps = {
  adicional: ProdutoType;
  handleQuantidadeChange: (adicional: AdicionalType) => void;
};

function AdicionalItem({
  adicional,
  handleQuantidadeChange,
}: AdicionalItemProps) {
  const [quantidade, setQuantidade] = useState<number | null>(null);

  useEffect(() => {
    handleQuantidadeChange({
      id: adicional.id,
      quantidade: quantidade,
      valorUnitario: Number(adicional.valor),
      valorUnitarioFormatado: adicional.valorFormatado,
      produto: adicional.nome,
    });
  }, [quantidade]);

  return (
    <div
      key={adicional.id}
      className={cn(
        "min-w-70 flex justify-between items-center px-4 rounded-sm select-none border py-0.5",
        quantidade && "border-orange-500"
      )}
    >
      <div className="flex flex-col w-fit">
        <p className="font-medium">{adicional.nome}</p>
        <p className="text-sm">{adicional.valorFormatado}</p>
      </div>
      {quantidade ? (
        <InputQuantidade
          quantidade={quantidade}
          setQuantidade={setQuantidade}
        />
      ) : (
        <Button
          onClick={() => setQuantidade(1)}
          className="cursor-pointer bg-white hover:bg-neutral-50 border text-orange-500"
        >
          <Plus /> Adicionar
        </Button>
      )}
    </div>
  );
}
