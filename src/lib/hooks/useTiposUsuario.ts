import { TiposUsuarioModelType } from "@/schemas/tipoUsuarioSchema";
import { useQuery } from "@tanstack/react-query";

async function fetchTiposUsuario(): Promise<TiposUsuarioModelType> {
  const res = await fetch("/api/tipos-usuario", {
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar tipos de usuário.");
  }
  return res.json();
}

export default function useTiposUsuario() {
  return useQuery({
    queryKey: ["tiposUsuario"],
    queryFn: fetchTiposUsuario,
    staleTime: Infinity,
  }); 
}