import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { setTag } from "../../network/changeset";

interface SetTagParams {
  changesetId: number;
  tag: { value: number; label: string };
  remove: boolean;
}

export function useSetTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ changesetId, tag, remove }: SetTagParams) =>
      setTag(changesetId, tag, remove),

    onMutate: async ({ changesetId, tag, remove }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["changeset", changesetId] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(["changeset", changesetId]);

      const updateTags = (existingTags: any[]) => {
        if (remove) {
          return existingTags.filter((t: any) => t.id !== tag.value);
        } else {
          return [...existingTags, { id: tag.value, name: tag.label }];
        }
      };

      // Optimistically update changeset detail
      queryClient.setQueryData(["changeset", changesetId], (old: any) => {
        if (!old) return old;

        const checked = old.properties?.checked;
        if (!checked) {
          throw new Error("Only allowed on checked changesets");
        }

        return {
          ...old,
          properties: {
            ...old.properties,
            tags: updateTags(old.properties?.tags || []),
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
                  tags: updateTags(f.properties?.tags || []),
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
      toast.error("Failed to update tags", {
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
