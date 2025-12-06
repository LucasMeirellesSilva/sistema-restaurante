"use client";

import { useState } from "react";
import usePedidosPaginado, { FilteredHistoricoType } from "@/lib/hooks/usePedidosPaginado";

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
import { UserX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Loading from "@/components/ui/loading";
import Paginacao from "@/components/ui/paginacao";
import Modal from "@/components/ui/modal";
import DetalhesPedido from "@/components/modal/detalhesPedido";

import { PedidoModelType } from "@/schemas/pedidoSchema";
import { Label } from "@/components/ui/label";
import useDebounce from "@/lib/hooks/useDebounce";

export default function Historico() {
  const [autor, setAutor] = useState("");
  const debouncedAutor = useDebounce(autor);
  const [cliente, setCliente] = useState("");
  const debouncedCliente = useDebounce(cliente);
  const filter: FilteredHistoricoType = {
    autor: debouncedAutor,
    cliente: debouncedCliente,
  };

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"criadoEmData" | "valorTotal" | null>(
    null
  );
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [modalPedido, setModalPedido] = useState<PedidoModelType | null>(null);

  const { data: pedidos, isPending: isPedidosPending } =
    usePedidosPaginado(page, filter);

  const sorted = pedidos
    ? [...pedidos.items].sort((a, b) => {
        if (!sortBy) return 0;
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      })
    : 0;

  function handleSort(key: "criadoEmData" | "valorTotal") {
    if (sortBy === key) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setOrder("asc");
    }
  }

  const iconColor = "text-neutral-600";

  return (
    <div className="flex flex-col gap-2 w-[75vw] 2xl:w-2/3 mx-auto pb-4">
      <Modal isOpen={!!modalPedido} onClose={() => setModalPedido(null)}>
        {modalPedido && <DetalhesPedido pedido={modalPedido} />}
      </Modal>
      <h1 className="text-center font-semibold text-xl tracking-tight">
        Histórico
      </h1>
      <div className="flex w-2/3 lg:w-2/5 gap-2">
        <Label className="flex flex-col gap-1 w-64">
          Nome
          <Input
            className="w-64"
            placeholder="Filtrar por autor"
            onChange={(e) => setAutor(e.target.value)}
          />
        </Label>
        <Label className="flex flex-col gap-1 w-64">
          Categoria
          <Input
            className="w-64"
            placeholder="Filtrar por cliente"
            onChange={(e) => setCliente(e.target.value)}
          />
        </Label>
      </div>
      <div className="flex-1 flex-col justify-center gap-12 rounded-lg border py-4">
        {isPedidosPending ? (
          <div className="w-fit mx-auto">
            <Loading />
          </div>
        ) : (
          <Table className="table-center">
            <TableCaption className="text-start indent-4">
              Exibindo {pedidos?.items.length} dos {pedidos?.total ?? 0}{" "}
              pedidos.
            </TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-inherit">
                <TableHead>ID</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Mesa</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("valorTotal")}
                >
                  Total (R$)
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("criadoEmData")}
                >
                  Data - Hora
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isPedidosPending &&
                sorted &&
                sorted.map((p) => (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer"
                    onClick={() => setModalPedido(p)}
                  >
                    <TableCell className="min-w-32">{p.id}</TableCell>
                    <TableCell className="min-w-40 px-8">{p.autor}</TableCell>
                    <TableCell className="min-w-32 px-8">
                      {p.mesa ?? (
                        <X
                          className={cn(iconColor, "mx-auto")}
                          strokeWidth={1.5}
                        />
                      )}
                    </TableCell>
                    <TableCell className="min-w-40 px-8">
                      {p.cliente ?? (
                        <UserX
                          className={cn(iconColor, "mx-auto")}
                          strokeWidth={1.5}
                        />
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "min-w-40 px-8",
                        p.status === "Finalizado"
                          ? "text-emerald-600"
                          : p.status === "Pendente"
                          ? "text-orange-500"
                          : "text-red-600"
                      )}
                    >
                      {p.status}
                    </TableCell>
                    <TableCell className="min-w-40 px-8">
                      {p.valorTotalFormatado}
                    </TableCell>
                    <TableCell className="min-w-40 px-8">
                      {p.criadoEmData} {p.criadoEmHora}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
        {pedidos && (
          <Paginacao
            page={page}
            setPage={setPage}
            totalPages={pedidos.totalPages}
          />
        )}
      </div>
    </div>
  );
}
