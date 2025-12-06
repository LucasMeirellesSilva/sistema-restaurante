"use client";

import { useState } from "react";
import useClientesPaginado, {
  FilteredClientesType,
} from "@/lib/hooks/useClientesPaginado";
import { useMutation } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";

// Components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import FormCliente from "@/components/modal/form/formCliente";
import Paginacao from "@/components/ui/paginacao";
import Loading from "@/components/ui/loading";
import { X, Edit, Trash2 } from "lucide-react";
import Confirmacao from "@/components/modal/confirmacao";

import { ClienteModelType } from "@/schemas/clienteSchema";
import useDebounce from "@/lib/hooks/useDebounce";
import { Label } from "@/components/ui/label";

type ModalCliente =
  | {
      tipo: "criar";
    }
  | {
      tipo: "editar";
      cliente: ClienteModelType;
    }
  | {
      tipo: "deletar";
      clienteId: number;
    }
  | null;

export default function Clientes() {
  const [nome, setNome] = useState("");
  const debouncedNome = useDebounce(nome);
  const filter: FilteredClientesType = {
    nome: debouncedNome,
  };

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"quantidadePedidos" | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [modalCliente, setModalCliente] = useState<ModalCliente>(null);

  const { data: clientes, isPending: isClientesPending } = useClientesPaginado(
    page,
    filter
  );

  const sorted = clientes
    ? [
        ...clientes.items.sort((a, b) => {
          if (!sortBy) return 0;
          const valA = a[sortBy];
          const valB = b[sortBy];
          if (valA < valB) return order === "asc" ? -1 : 1;
          if (valA > valB) return order === "asc" ? 1 : -1;
          return 0;
        }),
      ]
    : 0;

  function handleSort(key: "quantidadePedidos") {
    if (sortBy === key) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setOrder("asc");
    }
  }

  const deletarClienteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch("/api/clientes", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setModalCliente(null);
    },
  });

  function handleClienteDelete(id: number) {
    deletarClienteMutation.mutate(id);
  }

  const iconColor = "text-neutral-600";

  return (
    <div className="flex flex-col gap-2 w-2/3 mx-auto pb-4">
      <Modal isOpen={!!modalCliente} onClose={() => setModalCliente(null)}>
        {modalCliente?.tipo === "criar" && (
          <FormCliente onClose={() => setModalCliente(null)} />
        )}
        {modalCliente?.tipo === "editar" && (
          <FormCliente
            onClose={() => setModalCliente(null)}
            cliente={modalCliente.cliente}
          />
        )}
        {modalCliente?.tipo === "deletar" && (
          <Confirmacao
            handleConfirmation={() =>
              handleClienteDelete(modalCliente.clienteId)
            }
            onClose={() => setModalCliente(null)}
          >
            Tem certeza que deseja excluir o cliente {modalCliente.clienteId}?
          </Confirmacao>
        )}
      </Modal>
      <h1 className="text-center font-semibold text-xl tracking-tight">
        Clientes
      </h1>
      <div className="flex justify-between">
        <div className="w-2/5 lg:w-1/5">
          <Label className="flex flex-col gap-1 w-64">
            Nome
            <Input
              placeholder="Filtrar por nome"
              onChange={(e) => setNome(e.target.value)}
            />
          </Label>
        </div>
        <Button
          className="bg-orange-600 hover:bg-orange-500 cursor-pointer"
          onClick={() => setModalCliente({ tipo: "criar" })}
        >
          Novo Cliente
        </Button>
      </div>
      <div className="flex-1 flex-col justify-center gap-12 rounded-lg border py-4">
        {isClientesPending ? (
          <div className="w-fit mx-auto">
            <Loading />
          </div>
        ) : (
          <Table className="table-center">
            <TableCaption className="text-start indent-4">
              Exibindo {clientes?.items.length} dos {clientes?.total ?? 0}{" "}
              clientes.
            </TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-inherit">
                <TableHead className="text-neutral-800">Número</TableHead>
                <TableHead className="text-neutral-800">Nome</TableHead>
                <TableHead className="text-neutral-800">Telefone</TableHead>
                <TableHead
                  className="text-neutral-800 cursor-pointer"
                  onClick={() => handleSort("quantidadePedidos")}
                >
                  Pedidos Realizados
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted &&
                sorted.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer">
                    <TableCell className="min-w-32">{c.id}</TableCell>
                    <TableCell className="min-w-40">{c.nome}</TableCell>
                    <TableCell className="min-w-40 px-8">
                      {c.telefone ?? (
                        <X
                          className={cn(iconColor, "mx-auto")}
                          strokeWidth={1.5}
                        />
                      )}
                    </TableCell>
                    <TableCell className="min-w-32 px-8">
                      {c.quantidadePedidos}
                    </TableCell>
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalCliente({ tipo: "editar", cliente: c });
                      }}
                    >
                      <Edit size={20} strokeWidth={1.7} />
                    </TableCell>
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalCliente({ tipo: "deletar", clienteId: c.id });
                      }}
                    >
                      <Trash2 color="red" size={20} strokeWidth={1.7} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
        {clientes && (
          <Paginacao
            page={page}
            setPage={setPage}
            totalPages={clientes.totalPages}
          />
        )}
      </div>
    </div>
  );
}
