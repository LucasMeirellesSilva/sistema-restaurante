import { ClienteModelType } from "@/schemas/clienteSchema";
import { useQuery } from "@tanstack/react-query";

type ClienteComQuantidadePedidosType = Omit<ClienteModelType, "pedidos"> & { quantidadePedidos: number }

type FetchPedidosReturn = {
    items: ClienteComQuantidadePedidosType[],
    page: number,
    totalPages: number,
    total: number,
}

async function fetchClientes(page: number): Promise<FetchPedidosReturn> {
  const res = await fetch(`/api/clientes?page=${page}`, {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar os clientes");
  }
  return res.json();
}

export default function useClientesPaginado(page: number) {
  return useQuery({
    queryKey: ["clientes", page],
    queryFn: () => fetchClientes(page),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  }); 
}