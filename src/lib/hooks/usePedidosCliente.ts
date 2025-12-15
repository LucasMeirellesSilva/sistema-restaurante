import { PedidoModelType } from "@/schemas/pedidoSchema";
import { useQuery } from "@tanstack/react-query";

type FetchPedidosClienteReturn = {
  items: PedidoModelType[];
  page: number;
  totalPages: number;
  total: number;
};

async function fetchPedidosCliente(cliente: string): Promise<FetchPedidosClienteReturn> {
  const params = new URLSearchParams({
    cliente: String(cliente),
  });

  const res = await fetch(`/api/clientes/pedidos?${params.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar os pedidos do cliente.");
  }
  return res.json();
}

export default function usePedidosCliente(cliente: string) {
  return useQuery({
    queryKey: ["pedidos", "cliente", cliente],
    queryFn: () => fetchPedidosCliente(cliente),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
}
