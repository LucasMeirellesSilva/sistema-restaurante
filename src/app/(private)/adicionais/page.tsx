"use client";

import { useState } from "react";
import useAdicionaisPaginado from "@/lib/hooks/useAdicionaisPaginado";
import useDebounce from "@/lib/hooks/useDebounce";
import { useMutation } from "@tanstack/react-query";

import Modal from "@/components/ui/modal";
import FormAdicional from "@/components/modal/form/formAdicional";
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
import { Edit, Trash2, TriangleAlert } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import ErrorMessage from "@/components/ui/errorMessage";
import SelectCategoria from "@/components/ui/selectCategoria";
import { Label } from "@/components/ui/label";

import { queryClient } from "@/lib/queryClient";

import { ProdutoModelType } from "@/schemas/produtoSchema";
import { FilteredProdutosType } from "@/repository/produto/getProdutos";

type ModalAdicional =
  | {
      tipo: "criar";
    }
  | {
      tipo: "editar";
      adicional: ProdutoModelType;
    }
  | {
      tipo: "deletar";
      adicionalId: number;
    }
  | null;

export default function Adicionais() {
  const [modalAdicional, setModalAdicional] = useState<ModalAdicional>(null);
  const [categoriaId, setCategoriaId] = useState<number>();
  const [nome, setNome] = useState("");
  const debouncedNome = useDebounce(nome)
  const filter: FilteredProdutosType = {
    categoriaId: categoriaId,
    nome: debouncedNome,
  };
    
  const [page, setPage] = useState(1);
  const [availableAlteredItems, setAvailableAlteredItems] = useState<
    ProdutoModelType[]
  >([]);
  const { data: adicionais, isPending: isAdicionaisPending } =
    useAdicionaisPaginado(page, filter);

  const deleteAddon = useMutation({
    mutationFn: async (data: { id: number }) => {
      const res = await fetch("/api/adicionais", {
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
      queryClient.invalidateQueries({ queryKey: ["adicionais"] });
    },
  });

  const patchAddonsAvailability = useMutation({
    mutationFn: async (productsId: number[]) => {
      const res = await fetch("/api/adicionais/disponibilidade", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productsId }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adicionais"] });
      setAvailableAlteredItems([]);
    },
  });

  function handleAddonDelete(addonId: number) {
    deleteAddon.mutate({ id: addonId });
  }

  function handleAddonsAvailability() {
    patchAddonsAvailability.mutate(
      availableAlteredItems.map((item) => item.id)
    );
  }

  return (
    <div className="flex flex-col gap-2 w-[75vw] 2xl:w-2/3 mx-auto pb-4">
      <Modal isOpen={!!modalAdicional}>
        {modalAdicional?.tipo === "criar" && (
          <FormAdicional onClose={() => setModalAdicional(null)} />
        )}
        {modalAdicional?.tipo === "editar" && (
          <FormAdicional
            onClose={() => setModalAdicional(null)}
            adicional={modalAdicional.adicional}
          />
        )}
        {modalAdicional?.tipo === "deletar" && (
          <Confirmacao
            handleConfirmation={() =>
              handleAddonDelete(modalAdicional.adicionalId)
            }
            onClose={() => setModalAdicional(null)}
          >
            Tem certeza que deseja excluir o adicional{" "}
            {modalAdicional.adicionalId}?
          </Confirmacao>
        )}
      </Modal>
      <h1 className="text-center font-semibold text-xl tracking-tight">
        Adicionais
      </h1>
      <div className="flex justify-between items-end">
        <div className="flex w-2/3 lg:w-2/5 gap-2">
          <Label className="flex flex-col gap-1 w-64">
            Nome
            <Input
              className="w-64"
              placeholder="Filtrar por nome"
              onChange={(e) => setNome(e.target.value)}
            />
          </Label>
          <Label className="flex flex-col gap-1 w-64">
            Categoria
            <SelectCategoria
              categoria={categoriaId}
              setCategoria={setCategoriaId}
            />
          </Label>
        </div>
        <Button
          className="bg-orange-600 hover:bg-orange-500 cursor-pointer"
          onClick={() => setModalAdicional({ tipo: "criar" })}
        >
          Novo Adicional
        </Button>
      </div>
      {patchAddonsAvailability.error && (
        <ErrorMessage error={patchAddonsAvailability.error} />
      )}
      <div className="relative flex-1 flex-col justify-center gap-12 rounded-lg border py-4">
        {isAdicionaisPending ? (
          <div className="w-fit mx-auto">
            <Loading />
          </div>
        ) : (
          <Table className="table-center">
            <TableCaption className="text-start indent-4">
              Exibindo {adicionais?.items.length} dos {adicionais?.total ?? 0}{" "}
              adicionais.
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
              {adicionais &&
                adicionais.items.length > 0 &&
                adicionais.items.map((p) => {
                  const isAvailableAltered = availableAlteredItems.some(
                    (item) => item.id === p.id
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
                          setModalAdicional({ tipo: "editar", adicional: p });
                        }}
                      >
                        <Edit size={20} strokeWidth={1.7} />
                      </TableCell>
                      <TableCell
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalAdicional({
                            tipo: "deletar",
                            adicionalId: p.id,
                          });
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
        {adicionais && (
          <Paginacao
            page={page}
            setPage={setPage}
            totalPages={adicionais.totalPages}
          />
        )}
        {availableAlteredItems.length > 0 && (
          <Button
            className="absolute bottom-4 right-4 bg-orange-600 hover:bg-orange-500 cursor-pointer"
            onClick={() => handleAddonsAvailability()}
          >
            Salvar Alterações
          </Button>
        )}
      </div>
    </div>
  );
}
