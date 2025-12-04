import { useQuery } from "@tanstack/react-query";
import { ProdutoModelType } from "@/schemas/produtoSchema";

type FetchAdicionaisReturn = {
    items: ProdutoModelType[],
    page: number,
    totalPages: number,
    total: number,
}

async function fetchAdicionais(page: number): Promise<FetchAdicionaisReturn> {
  const res = await fetch(`/api/adicionais?page=${page}`, {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar adicionais");
  }
  return res.json();
}

export default function useAdicionaisPaginado(page: number) {
  return useQuery({
    queryKey: ["adicionais", page],
    queryFn: () => fetchAdicionais(page),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  }); 
}