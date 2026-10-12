import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAugmentedDiff,
  fetchAugmentedDiffFromOverpass,
} from "../../network/changeset.ts";
import { fetchChangesetMetadata } from "../../network/openstreetmap.ts";

const queryKey = (changesetId: number | null) => ["changesetMap", changesetId];

export function useChangesetMap(changesetId: number | null) {
  return useQuery({
    queryKey: queryKey(changesetId),
    queryFn: async () => {
      if (!changesetId) throw new Error("No changeset ID");

      const [metadata, adiff] = await Promise.all([
        fetchChangesetMetadata(changesetId),
        fetchAugmentedDiff(changesetId),
      ]);

      return { metadata, adiff };
    },
    enabled: !!changesetId,
    staleTime: 30 * 60 * 1000,
    retry: false,
  });
}

/// Load a changeset's augmented diff from Overpass and store it as the result
/// of useChangesetMap. Intended to be triggered explicitly by the user when the
/// adiff service doesn't have the diff.
export function useChangesetMapFromOverpass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (changesetId: number) => {
      const [metadata, adiff] = await Promise.all([
        fetchChangesetMetadata(changesetId),
        fetchAugmentedDiffFromOverpass(changesetId),
      ]);
      return { metadata, adiff };
    },
    onSuccess: (data, changesetId) => {
      queryClient.setQueryData(queryKey(changesetId), data);
    },
  });
}
