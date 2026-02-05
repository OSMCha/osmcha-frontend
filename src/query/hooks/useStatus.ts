import { useQuery } from "@tanstack/react-query";
import { getStatus } from "../../network/status.ts";

export function useStatus() {
  return useQuery({
    queryKey: ["status"],
    queryFn: getStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}
