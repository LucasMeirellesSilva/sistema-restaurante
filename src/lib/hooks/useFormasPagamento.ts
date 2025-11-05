import { FormaPagamentoType } from "@/schemas/formaPagamentoSchema";
import { useQuery } from "@tanstack/react-query";

async function fetchFormasPagamento(): Promise<FormaPagamentoType[]> {
  const res = await fetch("/api/formas-pagamento", {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar as formas de pagamento.");
  }
  return res.json();
}

export default function useFormasPagamento() {
  return useQuery({
    queryKey: ["formasPagamento"],
    queryFn: fetchFormasPagamento,
    staleTime: Infinity,
  }); 
}