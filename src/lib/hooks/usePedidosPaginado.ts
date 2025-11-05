import { useQuery } from "@tanstack/react-query";
import { PedidoModelType } from "@/schemas/pedidoSchema";

type FetchPedidosReturn = {
    items: PedidoModelType[],
    page: number,
    totalPages: number,
    total: number,
}

async function fetchPedidos(page: number): Promise<FetchPedidosReturn> {
  const res = await fetch(`/api/pedidos?page=${page}`, {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar pedidos");
  }
  return res.json();
}

export default function usePedidos(page: number) {
  return useQuery({
    queryKey: ["pedidos", page],
    queryFn: () => fetchPedidos(page),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  }); 
}