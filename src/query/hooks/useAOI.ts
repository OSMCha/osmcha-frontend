import { useQuery } from "@tanstack/react-query";
import { fetchAllAOIs, fetchAOI } from "../../network/aoi";

export function useAOI(aoiId: string | null, token: string | null) {
  return useQuery({
    queryKey: ["aoi", aoiId, token],
    queryFn: () => fetchAOI(token!, parseInt(aoiId!, 10)),
    enabled: !!aoiId && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

export function useAllAOIs(token: string | null) {
  return useQuery({
    queryKey: ["aois", token],
    queryFn: () => fetchAllAOIs(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}
