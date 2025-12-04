import { useQuery } from "@tanstack/react-query";
import { CategoriaModelType } from "@/schemas/categoriaSchema";

type CategoriasComContagem = Omit<CategoriaModelType, "produtos"> & { contagemProdutos: number };

type FetchCategoriasReturn = {
    items: CategoriasComContagem[],
    page: number,
    totalPages: number,
    total: number,
}

async function fetchCategorias(page: number): Promise<FetchCategoriasReturn> {
  const res = await fetch(`/api/categorias?page=${page}`, {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar categorias");
  }
  return res.json();
}

export default function useCategoriasPaginado(page: number) {
  return useQuery({
    queryKey: ["categorias", page],
    queryFn: () => fetchCategorias(page),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  }); 
}