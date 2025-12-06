import { useQuery } from "@tanstack/react-query";
import { PedidoModelType } from "@/schemas/pedidoSchema";

export type FilteredHistoricoType = {
  autor?: string;
  cliente?: string;
};

type FetchPedidosReturn = {
  items: PedidoModelType[];
  page: number;
  totalPages: number;
  total: number;
};

async function fetchPedidos(
  page: number,
  filter: FilteredHistoricoType
): Promise<FetchPedidosReturn> {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (filter.autor) {
    params.set("autor", filter.autor);
  }

  if (filter.cliente) {
    params.set("cliente", filter.cliente);
  }

  const res = await fetch(`/api/pedidos?${params.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar pedidos");
  }
  return res.json();
}

export default function usePedidosPaginado(
  page: number,
  filter: FilteredHistoricoType
) {
  return useQuery({
    queryKey: ["pedidos", page, filter],
    queryFn: () => fetchPedidos(page, filter),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
}
