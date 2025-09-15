import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function getUserRole () {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['userType'],
    queryFn: () => queryClient.getQueryData(['userRole']) || null,
  });
};