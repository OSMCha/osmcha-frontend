import { useQuery } from "@tanstack/react-query";
import { fetchAllAOIs, fetchAOI } from "../../network/aoi";
import { useAuthStore } from "../../stores/authStore";

export function useAOI(aoiId: string | null) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["aoi", aoiId],
    queryFn: () => fetchAOI(aoiId!),
    enabled: !!aoiId && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

export function useAllAOIs() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ["aois"],
    queryFn: fetchAllAOIs,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}
