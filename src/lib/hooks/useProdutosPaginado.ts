import { useQuery } from "@tanstack/react-query";
import { ProdutoModelType } from "@/schemas/produtoSchema";

type FetchProdutosReturn = {
    items: ProdutoModelType[],
    page: number,
    totalPages: number,
    total: number,
}

async function fetchProdutos(page: number): Promise<FetchProdutosReturn> {
  const res = await fetch(`/api/produtos?page=${page}`, {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar produtos");
  }
  return res.json();
}

export default function useProdutosPaginado(page: number) {
  return useQuery({
    queryKey: ["produtos", page],
    queryFn: () => fetchProdutos(page),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  }); 
}