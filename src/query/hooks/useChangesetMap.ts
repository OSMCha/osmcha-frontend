import { useQuery } from "@tanstack/react-query";
import { fetchAndParseAugmentedDiff } from "../../network/changeset";
import { fetchChangesetMetadata } from "../../network/openstreetmap";

export function useChangesetMap(changesetId: number | null) {
  return useQuery({
    queryKey: ["changesetMap", changesetId],
    queryFn: async () => {
      if (!changesetId) throw new Error("No changeset ID");

      const [metadata, adiff] = await Promise.all([
        fetchChangesetMetadata(changesetId),
        fetchAndParseAugmentedDiff(changesetId),
      ]);

      return { metadata, adiff };
    },
    enabled: !!changesetId,
    staleTime: 30 * 60 * 1000, // 30 minutes - maps are expensive
    retry: 3,
  });
}
