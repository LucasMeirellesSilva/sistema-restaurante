import { useQuery } from "@tanstack/react-query";
import { CategoriaModelType } from "@/schemas/categoriaSchema";
import { FilteredCategoriasType } from "@/repository/categoria/getCategoriasPaginado";

type CategoriasComContagem = Omit<CategoriaModelType, "produtos"> & {
  contagemProdutos: number;
};

type FetchCategoriasReturn = {
  items: CategoriasComContagem[];
  page: number;
  totalPages: number;
  total: number;
};

async function fetchCategorias(
  page: number,
  filter: FilteredCategoriasType
): Promise<FetchCategoriasReturn> {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (filter.nome) {
    params.set("nome", filter.nome);
  }

  const res = await fetch(`/api/categorias?${params.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar categorias");
  }
  return res.json();
}

export default function useCategoriasPaginado(
  page: number,
  filter: FilteredCategoriasType
) {
  return useQuery({
    queryKey: ["categorias", page, filter],
    queryFn: () => fetchCategorias(page, filter),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
}
