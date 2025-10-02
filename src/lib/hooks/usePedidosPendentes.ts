import { useQuery } from "@tanstack/react-query";
import { PedidoModelType } from "@/schemas/pedidoSchema";

async function fetchPedidosPendentes(): Promise<PedidoModelType[]> {
  const res = await fetch("/api/pedidos/pendente", {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar pedidos pendentes");
  }
  return res.json();
}

export function usePedidosPendentes() {
  return useQuery({
    queryKey: ["pedidosPendentes"],
    queryFn: fetchPedidosPendentes,
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  }); 
}