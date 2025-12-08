import { PedidoModelType } from "@/schemas/pedidoSchema";
import { useQuery } from "@tanstack/react-query";

async function fetchPedidosCliente(clienteId: number): Promise<PedidoModelType[]> {
  const params = new URLSearchParams({
    clienteId: String(clienteId),
  });

  const res = await fetch(`/api/clientes/pedidos?${params.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar os pedidos do cliente.");
  }
  return res.json();
}

export default function usePedidosCliente(clienteId: number) {
  return useQuery({
    queryKey: ["pedidos", "cliente", clienteId],
    queryFn: () => fetchPedidosCliente(clienteId),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
}
