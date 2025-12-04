"use client";

import { useState } from "react";
import useCategoriasPaginado from "@/lib/hooks/useCategoriasPaginado";

import Modal from "@/components/ui/modal";
import FormCategoria from "@/components/modal/form/formCategoria";
import Confirmacao from "@/components/modal/confirmacao";
import Paginacao from "@/components/ui/paginacao";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
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

import { CategoriaModelType } from "@/schemas/categoriaSchema";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

type ModalCategoria =
  | {
      tipo: "criar";
    }
  | {
      tipo: "editar";
      categoria: CategoriaModelType;
    }
  | {
      tipo: "deletar";
      categoriaId: number;
    }
  | null;

export default function Categorias() {
  const [modalCategoria, setModalCategoria] = useState<ModalCategoria>(null);
  const [page, setPage] = useState(1);
  const { data: categorias, isPending: isCategoriasPending } =
    useCategoriasPaginado(page);

  const deleteCategory = useMutation({
    mutationFn: async (data: { id: number }) => {
      const res = await fetch("/api/categorias", {
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
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  function handleCategoryDelete(categoryId: number) {
    deleteCategory.mutate({ id: categoryId });
  }

  return (
    <div className="flex flex-col gap-2 w-[75vw] 2xl:w-2/3 mx-auto pb-4">
      <Modal isOpen={!!modalCategoria}>
        {modalCategoria?.tipo === "criar" && (
          <FormCategoria onClose={() => setModalCategoria(null)} />
        )}
        {modalCategoria?.tipo === "editar" && (
          <FormCategoria
            onClose={() => setModalCategoria(null)}
            categoria={modalCategoria.categoria}
          />
        )}
        {modalCategoria?.tipo === "deletar" && (
          <Confirmacao
            handleConfirmation={() =>
              handleCategoryDelete(modalCategoria.categoriaId)
            }
            onClose={() => setModalCategoria(null)}
          >
            Tem certeza que deseja excluir a categoria{" "}
            {modalCategoria.categoriaId}?
          </Confirmacao>
        )}
      </Modal>
      <h1 className="text-center font-semibold text-xl tracking-tight">
        Categorias
      </h1>
      <div className="flex justify-between">
        <div className="w-2/5 lg:w-1/5">
          <Input placeholder="Filtrar por nome" />
        </div>
        <Button
          className="bg-orange-600 hover:bg-orange-500 cursor-pointer"
          onClick={() => setModalCategoria({ tipo: "criar" })}
        >
          Nova Categoria
        </Button>
      </div>
      <div className="flex-1 flex-col justify-center gap-12 rounded-lg border py-4">
        {isCategoriasPending ? (
          <div className="w-fit mx-auto">
            <Loading />
          </div>
        ) : (
          <Table className="table-center">
            <TableCaption className="text-start indent-4">
              Exibindo {categorias?.items.length} das {categorias?.total ?? 0}{" "}
              categorias.
            </TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-inherit">
                <TableHead className="text-neutral-800">ID</TableHead>
                <TableHead className="text-neutral-800">Nome</TableHead>
                <TableHead className="text-neutral-800">
                  Contagem de Produtos e Categorias
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias &&
                categorias.items.length > 0 &&
                categorias.items.map((p) => (
                  <TableRow key={p.id} className="cursor-pointer">
                    <TableCell className="min-w-32">{p.id}</TableCell>
                    <TableCell className="min-w-40">{p.nome}</TableCell>
                    <TableCell className="min-w-40">
                      {p.contagemProdutos}
                    </TableCell>
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalCategoria({ tipo: "editar", categoria: p });
                      }}
                    >
                      <Edit size={20} strokeWidth={1.7} />
                    </TableCell>
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalCategoria({
                          tipo: "deletar",
                          categoriaId: p.id,
                        });
                      }}
                    >
                      <Trash2 color="red" size={20} strokeWidth={1.7} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
        {categorias && (
          <Paginacao
            page={page}
            setPage={setPage}
            totalPages={categorias.totalPages}
          />
        )}
      </div>
    </div>
  );
}
