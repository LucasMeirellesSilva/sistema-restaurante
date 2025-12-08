"use client";

import usePedidosCliente from "@/lib/hooks/usePedidosCliente";

import { ClienteModelType } from "@/schemas/clienteSchema";
import Loading from "../ui/loading";
import { X } from "lucide-react";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PedidoModelType } from "@/schemas/pedidoSchema";
import Modal from "../ui/modal";
import DetalhesPedido from "./detalhesPedido";

type DetalhesClienteProps = {
  cliente: ClienteModelType;
};

function DetalhesCliente({ cliente }: DetalhesClienteProps) {
  const { data: pedidos, isLoading: isPedidosLoading } = usePedidosCliente(
    cliente.id
  );

  const [sortBy, setSortBy] = useState<"criadoEmData" | "valorTotal" | null>(
    null
  );
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [modalPedido, setModalPedido] = useState<PedidoModelType | null>(null);

  const sorted = pedidos
    ? [...pedidos].sort((a, b) => {
        if (!sortBy) return 0;
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      })
    : [];

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
    <div className="min-w-[50vw] lg:min-w-[30vw] mx-4 space-y-4">
      <Modal isOpen={!!modalPedido} onClose={() => setModalPedido(null)}>
        {modalPedido && <DetalhesPedido pedido={modalPedido} />}
      </Modal>
      <h2 className="w-fit px-6 pb-3 border-b font-medium mx-auto">
        Cliente {cliente.id}
      </h2>
      <div className="space-y-2">
        <div className="flex gap-1">
          <span className="flex items-center gap-1 font-medium">Nome:</span>
          <p className="truncate">{cliente.nome}</p>
        </div>
        <div className="flex gap-1">
          <span className="flex items-center gap-1 font-medium">Telefone:</span>
          <p className="truncate">{cliente.telefone}</p>
        </div>
      </div>
      <h3 className="font-medium">Pedidos Realizados</h3>
      <div className="flex-1 flex-col justify-center gap-12 rounded-lg border py-4 max-h-[50vh] overflow-y-auto">
        {isPedidosLoading ? (
          <div className="w-fit mx-auto">
            <Loading />
          </div>
        ) : (
          <Table className="table-center">
            <TableCaption className="text-start indent-4">
              Exibindo {pedidos?.length} dos {pedidos?.length} pedidos
              realizados por este usuário.
            </TableCaption>
            <TableHeader>
              <TableRow>
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
              {sorted &&
                sorted.length > 0 &&
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
                    <TableCell className="min-w-40 px-8">{p.cliente}</TableCell>
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
      </div>
    </div>
  );
}

export default DetalhesCliente;
