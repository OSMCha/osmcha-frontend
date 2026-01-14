import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails } from "../../network/auth";

export function useUserDetails(token: string | null) {
  return useQuery({
    queryKey: ["user", "details", token],
    queryFn: () => fetchUserDetails(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}
