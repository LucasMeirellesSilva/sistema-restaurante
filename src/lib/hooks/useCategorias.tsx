import { CategoriaModelType } from "@/schemas/categoriaSchema";
import { useQuery } from "@tanstack/react-query";

async function fetchCategorias(): Promise<CategoriaModelType[]> {
  const res = await fetch("/api/categorias", {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar categorias");
  }
  return res.json();
}

export default function useCategorias() {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategorias,
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  }); 
}