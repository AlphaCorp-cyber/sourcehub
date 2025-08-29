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
  });

  return {
    user,
    isAuthenticated: !!user && !error,
    isLoading,
    error,
  };
}