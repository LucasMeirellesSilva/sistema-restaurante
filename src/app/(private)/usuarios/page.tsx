"use client";

import { useState } from "react";
import useUsuarios, { FilteredUsuariosType } from "@/lib/hooks/useUsuarios";

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
import Loading from "@/components/ui/loading";
import Modal from "@/components/ui/modal";
import FormUsuario from "@/components/modal/form/formUsuario";
import { UsuarioModelType } from "@/schemas/usuarioSchema";
import useDebounce from "@/lib/hooks/useDebounce";
import { Label } from "@/components/ui/label";

type ModalUsuario =
  | {
      tipo: "criar";
    }
  | {
      tipo: "editar";
      usuario: UsuarioModelType;
    }
  | null;

export default function Usuarios() {
  const [nome, setNome] = useState("");
  const debouncedNome = useDebounce(nome);
  const filter: FilteredUsuariosType = {
    nome: debouncedNome,
  };

  const [sortBy, setSortBy] = useState<"pedidosAnotados" | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [modalUsuario, setModalUsuario] = useState<ModalUsuario>(null);

  const { data: usuarios, isPending: isUsuariosPending } = useUsuarios(filter);

  const sorted = usuarios
    ? [
        ...usuarios.sort((a, b) => {
          if (!sortBy) return 0;
          const valA = a[sortBy];
          const valB = b[sortBy];
          if (valA < valB) return order === "asc" ? -1 : 1;
          if (valA > valB) return order === "asc" ? 1 : -1;
          return 0;
        }),
      ]
    : [];

  function handleSort(key: "pedidosAnotados") {
    if (sortBy === key) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setOrder("asc");
    }
  }

  return (
    <div className="flex flex-col gap-2 w-2/3 mx-auto pb-4">
      <Modal isOpen={!!modalUsuario} onClose={() => setModalUsuario(null)}>
        {modalUsuario?.tipo === "criar" && (
          <FormUsuario onClose={() => setModalUsuario(null)} />
        )}
        {modalUsuario?.tipo === "editar" && (
          <FormUsuario
            onClose={() => setModalUsuario(null)}
            usuario={modalUsuario.usuario}
          />
        )}
      </Modal>
      <h1 className="text-center font-semibold text-xl tracking-tight">
        Usuários
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
          onClick={() => setModalUsuario({ tipo: "criar" })}
        >
          Novo Usuário
        </Button>
      </div>
      <div className="flex-1 flex-col justify-center gap-12 rounded-lg border py-4">
        {isUsuariosPending ? (
          <div className="w-fit mx-auto">
            <Loading />
          </div>
        ) : (
          <Table className="table-center">
            <TableCaption className="text-start indent-4">
              Exibindo {usuarios?.length} dos {usuarios?.length} usuários.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-neutral-800">Nome</TableHead>
                <TableHead className="text-neutral-800">
                  Nível de Permissão
                </TableHead>
                <TableHead
                  className="text-neutral-800 cursor-pointer"
                  onClick={() => handleSort("pedidosAnotados")}
                >
                  Pedidos Anotados
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isUsuariosPending && <Loading />}
              {!isUsuariosPending &&
                sorted.length > 0 &&
                sorted.map((u) => (
                  <TableRow
                    key={u.id}
                    className="cursor-pointer"
                    onClick={() =>
                      setModalUsuario({ tipo: "editar", usuario: u })
                    }
                  >
                    <TableCell className="min-w-40">{u.nome}</TableCell>
                    <TableCell className="min-w-40">{u.tipo}</TableCell>
                    <TableCell className="min-w-32 px-8">
                      {u.pedidosAnotados}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
