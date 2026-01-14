import { useQuery } from "@tanstack/react-query";
import { fetchWatchList } from "../../network/osmcha_watchlist";

export function useWatchlist(token: string | null) {
  return useQuery({
    queryKey: ["watchlist", token],
    queryFn: () => fetchWatchList(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}
