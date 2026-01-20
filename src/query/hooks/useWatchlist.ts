import { useQuery } from "@tanstack/react-query";
import { fetchWatchList } from "../../network/osmcha_watchlist";
import { useAuthStore } from "../../stores/authStore";

export function useWatchlist() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["watchlist"],
    queryFn: fetchWatchList,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}
