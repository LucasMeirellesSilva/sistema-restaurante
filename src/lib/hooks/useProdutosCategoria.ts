import { useQuery } from "@tanstack/react-query";
import { ProdutoModelType } from "@/schemas/produtoSchema";

export type ProdutoType = Omit<ProdutoModelType, "adicional">

export type ProdutosPorCategoria = {
  adicionais: ProdutoType[];
  normais: ProdutoType[];
}

async function fetchProdutosPorCategoria(id: number): Promise<ProdutosPorCategoria> {
  const res = await fetch(`/api/produtos/categoria?id=${id}`, {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar produtos.");
  }
  return res.json();
}

export default function useProdutosPorCategoria(id: number | null) {
  return useQuery({
    queryKey: ["produtos", "categoria", id],
    queryFn: () => fetchProdutosPorCategoria(id!),
    enabled: !!id,
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  }); 
}