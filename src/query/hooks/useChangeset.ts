import { useQuery } from "@tanstack/react-query";
import { fetchChangeset } from "../../network/changeset";

export function useChangeset(changesetId: number | null) {
  return useQuery({
    queryKey: ["changeset", changesetId],
    queryFn: async () => {
      if (!changesetId) throw new Error("No changeset ID");
      return fetchChangeset(changesetId);
    },
    enabled: !!changesetId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
}
