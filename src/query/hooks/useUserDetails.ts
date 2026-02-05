import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails } from "../../network/auth.ts";
import { useAuthStore } from "../../stores/authStore.ts";

export function useUserDetails() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["user", "details"],
    queryFn: fetchUserDetails,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}
