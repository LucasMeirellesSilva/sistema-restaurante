import { UsuarioModelType } from "@/schemas/usuarioSchema";
import { useQuery } from "@tanstack/react-query";

export type FilteredUsuariosType = {
  nome?: string;
};

async function fetchUsuarios(filter: FilteredUsuariosType): Promise<UsuarioModelType[]> {
  const params = new URLSearchParams();

  if (filter.nome) {
    params.set("nome", filter.nome);
  }

  const res = await fetch(`/api/usuarios?${params.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar os usuários.");
  }
  return res.json();
}

export default function useUsuarios(filter: FilteredUsuariosType) {
  return useQuery({
    queryKey: ["usuarios", filter],
    queryFn: () => fetchUsuarios(filter),
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
}
