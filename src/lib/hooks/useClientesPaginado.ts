import { ClienteModelType } from "@/schemas/clienteSchema";
import { useQuery } from "@tanstack/react-query";

export type FilteredClientesType = {
  nome?: string;
};

type ClienteComQuantidadePedidosType = Omit<ClienteModelType, "pedidos"> & {
  quantidadePedidos: number;
};

type FetchPedidosReturn = {
  items: ClienteComQuantidadePedidosType[];
  page: number;
  totalPages: number;
  total: number;
};

async function fetchClientes(
  page: number,
  filter: FilteredClientesType
): Promise<FetchPedidosReturn> {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (filter.nome) {
    params.set("nome", filter.nome);
  }

  const res = await fetch(`/api/clientes?${params.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar os clientes");
  }
  return res.json();
}

export default function useClientesPaginado(
  page: number,
  filter: FilteredClientesType
) {
  return useQuery({
    queryKey: ["clientes", page, filter],
    queryFn: () => fetchClientes(page, filter),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
}
