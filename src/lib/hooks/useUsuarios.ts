import { UsuarioModelType } from "@/schemas/usuarioSchema";
import { useQuery } from "@tanstack/react-query";

async function fetchUsuarios(): Promise<UsuarioModelType[]> {
  const res = await fetch("/api/usuarios", {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar os usuários.");
  }
  return res.json();
}

export default function useUsuarios() {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: fetchUsuarios,
    refetchInterval: 50000,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  }); 
}