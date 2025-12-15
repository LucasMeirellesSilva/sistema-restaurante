import { PagamentoModelType } from "@/schemas/pagamentoSchema";
import { useQuery } from "@tanstack/react-query";

async function fetchPagamentoPedido(id: number): Promise<PagamentoModelType> {
  const res = await fetch(`/api/pedidos/pagamento?id=${id}`, {
    method: "GET",
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar o pagamento do pedido.");
  }
  return res.json();
}

export default function usePagamentoPedido(id: number) {
  return useQuery({
    queryKey: ["pagamentos", "pedido", id],
    queryFn: () => fetchPagamentoPedido(id),
    staleTime: Infinity,
  });
}
