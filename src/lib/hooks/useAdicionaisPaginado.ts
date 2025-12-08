import { useQuery } from "@tanstack/react-query";
import { ProdutoModelType } from "@/schemas/produtoSchema";
import { FilteredProdutosType } from "@/repository/produto/getProdutos";

type FetchAdicionaisReturn = {
  items: ProdutoModelType[];
  page: number;
  totalPages: number;
  total: number;
};

async function fetchAdicionais(
  page: number,
  filter: FilteredProdutosType
): Promise<FetchAdicionaisReturn> {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (filter.categoriaId) {
    params.set("categoria", String(filter.categoriaId));
  }

  if (filter.nome) {
    params.set("nome", filter.nome);
  }

  const res = await fetch(`/api/adicionais?${params.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar adicionais");
  }
  return res.json();
}

export default function useAdicionaisPaginado(page: number, filter: FilteredProdutosType) {
  return useQuery({
    queryKey: ["adicionais", page, filter],
    queryFn: () => fetchAdicionais(page, filter),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
}
