import { useQuery } from '@tanstack/react-query';

async function fetchUserRole() {
  const res = await fetch("/api/me");
  if (!res.ok) throw new Error("Não autenticado");
  const data = await res.json();
  return data.role;
}

export default function useUserRole () {

  return useQuery({
    queryKey: ['userRole'],
    queryFn: fetchUserRole,
    staleTime: 1000 * 60 * 5,
  });
};