import { useQuery } from "@tanstack/react-query";
import { fetchChangeset } from "../../network/changeset";

export function useChangeset(changesetId: number | null, token: string | null) {
  return useQuery({
    queryKey: ["changeset", changesetId, token],
    queryFn: async ({ }) => {
      if (!changesetId) throw new Error("No changeset ID");
      const data = await fetchChangeset(changesetId, token);
      return data;
    },
    enabled: !!changesetId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
}
