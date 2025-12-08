import { useQuery } from '@tanstack/react-query';

export type UserType = {
  id: number,
  role: string,
}

async function fetchUser() {
  const res = await fetch("/api/me");
  if (!res.ok) throw new Error("Não autenticado");
  const data = await res.json();
  const user: UserType = data;
  return user;
}

export default function useUser () {

  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 10,
    
  });
};