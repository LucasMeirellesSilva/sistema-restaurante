import { ClienteModelType } from "@/schemas/clienteSchema";
import { useQuery } from "@tanstack/react-query";

async function fetchClientes(): Promise<ClienteModelType[]> {
  const res = await fetch("/api/clientes", {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar os clientes");
  }
  return res.json();
}

export default function useClientes() {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: fetchClientes,
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  }); 
}