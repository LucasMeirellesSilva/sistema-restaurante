"use client";

import { Dispatch, SetStateAction, useState, useEffect, memo } from "react";

import InputQuantidade from "./inputQuantidade";

import { ProdutosPorCategoria, ProdutoType } from "@/lib/hooks/useProdutosCategoria";
import { ItemModelType, AdicionalModelType } from "@/schemas/itemSchema";
import { cn, normalizar } from "@/lib/utils";
import { isEqual } from "lodash";

import {
  ArrowDownUp,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Plus,
} from "lucide-react";
import { Button } from "./button";
import formatCurrency from "@/lib/formatCurrency";

const iconColor = "text-neutral-600";

type ProdutosVendaProps = {
  produtos: ProdutosPorCategoria;
  setItems: Dispatch<SetStateAction<ItemModelType[]>>;
};

function ProdutosVenda({ produtos, setItems }: ProdutosVendaProps) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);
  const [sortedList, setSortedList] = useState<ProdutoType[]>();

  function handleToggle(id: number) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  useEffect(() => {
    if (!sort || !produtos) {
      setSortedList([]);
      return;
    }

    const sortedProducts = [...produtos.normais].sort((a, b) => {
      const aValor = Number(a.valor);
      const bValor = Number(b.valor);
      return sort === "asc" ? aValor - bValor : bValor - aValor;
    });

    setSortedList(sortedProducts);
  }, [sort, produtos]);

  const nextSort = !sort ? "desc" : sort === "desc" ? "asc" : null;

  const lista = sort ? sortedList : produtos.normais;

  return (
    <div className="flex flex-col h-full py-2">
      <div className="flex justify-between border-b font-medium py-1 pl-2 pr-10 select-none">
        <p>Nome</p>
        <p
          className="flex gap-1 items-center cursor-pointer"
          onClick={() => setSort(nextSort)}
        >
          {/* Se sort for null = "asc", se for "asc" = "desc", se for "desc" = null */}
          Valor
          {!sort
            ? <ArrowDownUp size={16} className={cn(iconColor)} />
            : sort === "asc" ? <ArrowUp size={16} className={cn(iconColor)} />
              : <ArrowDown size={16} className={cn(iconColor)} />}
        </p>
      </div>
      <div className="h-full overflow-y-auto select-none">
        {lista?.map((produto) => (
          <MemoProdutoItem
            key={produto.id}
            produto={produto}
            adicionais={produtos.adicionais}
            isOpen={openId === produto.id}
            setIsOpen={setOpenId}
            setItems={setItems}
            onToggle={handleToggle}
          ></MemoProdutoItem>
        ))}
      </div>
    </div>
  );
}

export default ProdutosVenda;

type ProdutoItemProps = {
  produto: ProdutoType;
  adicionais: ProdutoType[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<number | null>>;
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
  setIsOpen,
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
    const valorTotal = adicionaisSelecionados.reduce(
      (acc, adicional) => acc + adicional.valorUnitario,
      Number(produto.valor)
    );

    const novoItem: ItemModelType = {
      produto: produto.nome,
      produtoId: produto.id,
      valorUnitarioFormatado: produto.valorFormatado,
      valorUnitario: Number(produto.valor),
      valorTotal: valorTotal,
      valorTotalFormatado: formatCurrency(valorTotal),
      quantidade: 1,
      adicionais: adicionaisSelecionados,
    };

    setItems((prev) => {
      const itemExistente = prev.find((item) =>
        isEqual(normalizar(item), normalizar(novoItem))
      );

      if (itemExistente) {
        // Se já existir, incrementa a quantidade e atualiza o valorTotal
        const novaQuantidade = itemExistente.quantidade + 1;
        const novoValorTotal = adicionaisSelecionados.reduce(
          (acc, adicional) => acc + adicional.valorUnitario * novaQuantidade,
          Number(produto.valor) * novaQuantidade
        );

        return prev.map((item) =>
          isEqual(normalizar(item), normalizar(novoItem))
            ? {
                ...item,
                quantidade: item.quantidade + 1,
                valorTotal: novoValorTotal,
                valorTotalFormatado: formatCurrency(novoValorTotal),
              }
            : item
        );
      } else {
        // Caso contrário, adiciona o novo item
        return [...prev, novoItem];
      }
    });

    setIsOpen(null);
  }

  return (
    <div
      className={cn(
        "transition-all px-2 hover:bg-neutral-100",
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
          isOpen ? "max-h-[500px] opacity-100 py-2" : "max-h-0 opacity-0 py-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {produto.descricao && (
          <p className="font-thin">Descrição: {produto.descricao}</p>
        )}

        {adicionais && <>
          <h2 className="font-medium">Adicionais</h2>
          <div className="grid max-h-80 overflow-y-auto xl:grid-cols-2 gap-2 items-stretch">
            {adicionais.map((adicional) => (
              <MemoAdicionalItem
                adicional={adicional}
                key={adicional.id}
                handleQuantidadeChange={handleQuantidadeChange}
              />
            ))}
          </div>
        </>}
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

const MemoProdutoItem = memo(
  ProdutoItem,
  (prev, next) =>
    prev.isOpen === next.isOpen &&
    prev.produto === next.produto &&
    prev.adicionais === next.adicionais
);


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
      produtoId: adicional.id,
      quantidade: quantidade,
      valorUnitario: Number(adicional.valor),
      valorUnitarioFormatado: adicional.valorFormatado,
      produto: adicional.nome,
    });
  }, [quantidade]);

  return (
    <div
      className={cn(
        "box-content flex gap-2 justify-between items-center px-4 rounded-sm select-none border py-0.5",
        quantidade && "border-orange-500"
      )}
    >
      <div className="flex flex-col w-fit">
        <p className="font-medium leading-tight text-sm md:text-normal">{adicional.nome}</p>
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

const MemoAdicionalItem = memo(AdicionalItem);