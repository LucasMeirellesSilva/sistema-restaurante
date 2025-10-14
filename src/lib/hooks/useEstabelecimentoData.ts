import { useQuery } from "@tanstack/react-query";
import { EstabelecimentoModelType } from "@/schemas/estabelecimentoSchema";

async function fetchEstabelecimentoData(): Promise<EstabelecimentoModelType> {
  const res = await fetch("/api/estabelecimento", {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar pedidos pendentes");
  }
  return res.json();
}

export default function useEstabelecimentoData() {
  return useQuery({
    queryKey: ["estabelecimentoData"],
    queryFn: fetchEstabelecimentoData,
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  }); 
}