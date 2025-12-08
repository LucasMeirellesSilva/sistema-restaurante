import { useQuery } from "@tanstack/react-query";
import { ProdutoModelType } from "@/schemas/produtoSchema";
import { FilteredProdutosType } from "@/repository/produto/getProdutos";

type FetchProdutosReturn = {
  items: ProdutoModelType[];
  page: number;
  totalPages: number;
  total: number;
};

async function fetchProdutos(
  page: number,
  filter: FilteredProdutosType
): Promise<FetchProdutosReturn> {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (filter.categoriaId) {
    params.set("categoria", String(filter.categoriaId));
  }

  if (filter.nome) {
    params.set("nome", filter.nome);
  }

  const res = await fetch(`/api/produtos?${params.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar produtos");
  }
  return res.json();
}

export default function useProdutosPaginado(
  page: number,
  filter: FilteredProdutosType
) {
  return useQuery({
    queryKey: ["produtos", page, filter],
    queryFn: () => fetchProdutos(page, filter),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
}
