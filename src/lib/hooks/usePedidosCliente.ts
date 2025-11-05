import { PedidoModelType } from "@/schemas/pedidoSchema";
import { useQuery } from "@tanstack/react-query";

async function fetchPedidosClientes(id: number): Promise<PedidoModelType[]> {
  const res = await fetch(`/api/pedidos/cliente?id=${id}`, {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar os pedidos do cliente.");
  }
  return res.json();
}

export default function usePedidosCliente(id: number) {
  return useQuery({
    queryKey: ["pedidosCliente", id],
    queryFn: () => fetchPedidosClientes(id),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  }); 
}