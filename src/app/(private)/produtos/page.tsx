"use client";

import { useState } from "react";
import useProdutosPaginado from "@/lib/hooks/useProdutosPaginado";

import Modal from "@/components/ui/modal";
import FormProduto from "@/components/modal/form/formProduto";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import Loading from "@/components/ui/loading";
import Paginacao from "@/components/ui/paginacao";
import Confirmacao from "@/components/modal/confirmacao";

import { ProdutoModelType } from "@/schemas/produtoSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { TriangleAlert } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import ErrorMessage from "@/components/ui/errorMessage";

type ModalProduto =
  | {
      tipo: "criar";
    }
  | {
      tipo: "editar";
      produto: ProdutoModelType;
    }
  | {
      tipo: "deletar";
      produtoId: number;
    }
  | null;

export default function Produtos() {
  const [modalProduto, setModalProduto] = useState<ModalProduto>(null);
  const [page, setPage] = useState(1);
  const [availableAlteredItems, setAvailableAlteredItems] = useState<
    ProdutoModelType[]
  >([]);
  const { data: produtos, isPending: isProdutosPending } =
    useProdutosPaginado(page);

  const deleteProduct = useMutation({
    mutationFn: async (data: { id: number }) => {
      const res = await fetch("/api/produtos", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });

  const patchProductsAvailability = useMutation({
    mutationFn: async (productsId: number[])  => {
      const res = await fetch("/api/produtos/disponibilidade", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({productsId}),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      setAvailableAlteredItems([])
    },
  });

  function handleProductDelete(productId: number) {
    deleteProduct.mutate({ id: productId });
  }

  function handleProductsAvailability() {
    patchProductsAvailability.mutate(
      availableAlteredItems.map((item) => item.id)
    );
  }

  return (
    <div className="flex flex-col gap-2 w-[75vw] 2xl:w-2/3 mx-auto pb-4">
      <Modal isOpen={!!modalProduto}>
        {modalProduto?.tipo === "criar" && (
          <FormProduto onClose={() => setModalProduto(null)} />
        )}
        {modalProduto?.tipo === "editar" && (
          <FormProduto
            onClose={() => setModalProduto(null)}
            produto={modalProduto.produto}
          />
        )}
        {modalProduto?.tipo === "deletar" && (
          <Confirmacao
            handleConfirmation={() =>
              handleProductDelete(modalProduto.produtoId)
            }
            onClose={() => setModalProduto(null)}
          >
            Tem certeza que deseja excluir o produto {modalProduto.produtoId}?
          </Confirmacao>
        )}
      </Modal>
      <h1 className="text-center font-semibold text-xl tracking-tight">
        Produtos
      </h1>
      <div className="flex justify-between">
        <div className="w-2/5 lg:w-1/5">
          <Input placeholder="Filtrar por nome" />
        </div>
        <Button
          className="bg-orange-600 hover:bg-orange-500 cursor-pointer"
          onClick={() => setModalProduto({ tipo: "criar" })}
        >
          Novo Produto
        </Button>
      </div>
      {patchProductsAvailability.error && <ErrorMessage error={patchProductsAvailability.error}/>}
      <div className="relative flex-1 flex-col justify-center gap-12 rounded-lg border py-4">
        {isProdutosPending ? (
          <div className="w-fit mx-auto">
            <Loading />
          </div>
        ) : (
          <Table className="table-center">
            <TableCaption className="text-start indent-4">
              Exibindo {produtos?.items.length} dos {produtos?.total ?? 0}{" "}
              produtos.
            </TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-inherit">
                <TableHead className="text-neutral-800">ID</TableHead>
                <TableHead className="text-neutral-800">Nome</TableHead>
                <TableHead className="text-neutral-800">Categoria</TableHead>
                <TableHead className="text-neutral-800">Valor</TableHead>
                <TableHead className="text-neutral-800">Disponível</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos &&
                produtos.items.length > 0 &&
                produtos.items.map((p) => {
                  const isAvailableAltered = availableAlteredItems.some(
                    (product) => product.id === p.id
                  );

                  return (
                    <TableRow key={p.id} className="cursor-pointer">
                      <TableCell className="min-w-32">{p.id}</TableCell>
                      <TableCell className="min-w-40">{p.nome}</TableCell>
                      <TableCell className="min-w-40">{p.categoria}</TableCell>
                      <TableCell className="min-w-40">
                        {p.valorFormatado}
                      </TableCell>
                      <TableCell className="relative min-w-40">
                        <Switch
                          className="data-[state=checked]:bg-emerald-600"
                          checked={
                            isAvailableAltered ? !p.disponivel : p.disponivel
                          }
                          onCheckedChange={() =>
                            setAvailableAlteredItems((prev) => {
                              if (isAvailableAltered) {
                                return prev.filter(
                                  (product) => product.id !== p.id
                                );
                              }

                              return [...prev, p];
                            })
                          }
                        />
                        {isAvailableAltered && (
                          <div className="group/alert absolute top-1/2 -translate-y-1/2 right-8">
                            <TriangleAlert className="text-orange-600" />
                            <p className="absolute right-full mr-2 top-1/2 -translate-y-1/2 hidden group-hover/alert:block transition-opacity px-2 py-1 rounded bg-neutral-600 text-white whitespace-nowrap select-none">
                              Não esqueça de salvar as alterações ao final da
                              tabela
                            </p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalProduto({ tipo: "editar", produto: p });
                        }}
                      >
                        <Edit size={20} strokeWidth={1.7} />
                      </TableCell>
                      <TableCell
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalProduto({ tipo: "deletar", produtoId: p.id });
                        }}
                      >
                        <Trash2 color="red" size={20} strokeWidth={1.7} />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}

        {produtos && (
          <Paginacao
            page={page}
            setPage={setPage}
            totalPages={produtos.totalPages}
          />
        )}
        {availableAlteredItems.length > 0 && (
          <Button
            className="absolute bottom-4 right-4 bg-orange-600 hover:bg-orange-500 cursor-pointer"
            onClick={() => handleProductsAvailability()}
          >
            Salvar Alterações
          </Button>
        )}
      </div>
    </div>
  );
}
