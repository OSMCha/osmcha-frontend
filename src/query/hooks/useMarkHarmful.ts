import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { setHarmful } from "../../network/changeset.ts";

interface MarkHarmfulParams {
  changesetId: number;
  harmful: boolean | -1;
  username: string;
}

export function useMarkHarmful() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ changesetId, harmful }: MarkHarmfulParams) =>
      setHarmful(changesetId, harmful),

    onMutate: async ({ changesetId, harmful, username }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["changeset", changesetId] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(["changeset", changesetId]);

      // Optimistically update changeset detail
      queryClient.setQueryData(["changeset", changesetId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          properties: {
            ...old.properties,
            check_user: harmful === -1 ? null : username,
            checked: harmful !== -1,
            harmful: harmful === -1 ? null : harmful,
          },
        };
      });

      // Optimistically update changeset in list pages
      queryClient.setQueriesData(
        { queryKey: ["changesets", "page"] },
        (old: any) => {
          if (!old?.features) return old;
          const features = old.features.map((f: any) => {
            if (f.id === changesetId) {
              return {
                ...f,
                properties: {
                  ...f.properties,
                  check_user: harmful === -1 ? null : username,
                  checked: harmful !== -1,
                  harmful: harmful === -1 ? null : harmful,
                },
              };
            }
            return f;
          });
          return { ...old, features };
        },
      );

      return { previous, changesetId };
    },

    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(
          ["changeset", context.changesetId],
          context.previous,
        );
      }
      toast.error("Failed to update changeset", {
        description: error.message,
      });
    },

    onSettled: (data, error, variables) => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({
        queryKey: ["changeset", variables.changesetId],
      });
      queryClient.invalidateQueries({ queryKey: ["changesets", "page"] });
    },
  });
}
