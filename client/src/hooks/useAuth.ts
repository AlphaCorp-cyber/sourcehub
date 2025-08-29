import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  isAdmin?: boolean;
}

export function useAuth() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      const res = await fetch("/api/auth/user", {
        credentials: "include",
      });
      
      if (res.status === 401) {
        // Return null instead of throwing error for 401s
        return null;
      }
      
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      
      return await res.json();
    },
  });

  return {
    user,
    isAuthenticated: !!user && !error,
    isLoading,
    error,
  };
}