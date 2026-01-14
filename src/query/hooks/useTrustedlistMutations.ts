import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteFromTrustedList,
  postUserToTrustedList,
} from "../../network/osmcha_trustedlist";

export function useAddToTrustedlist(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => postUserToTrustedList(token!, username),
    onMutate: async (username) => {
      await queryClient.cancelQueries({ queryKey: ["user", "details", token] });
      const previous = queryClient.getQueryData(["user", "details", token]);

      queryClient.setQueryData(["user", "details", token], (old: any) => {
        if (!old) return old;
        const whitelists = old.whitelists || [];
        return { ...old, whitelists: [...whitelists, username] };
      });

      return { previous };
    },
    onError: (error: Error, _username, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["user", "details", token], context.previous);
      }
      toast.error("Failed to add user", { description: error.message });
    },
    onSuccess: (_data, username) => {
      toast.success("Success", {
        description: `User ${username} added to your Trusted Users list.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "details", token] });
    },
  });
}

export function useRemoveFromTrustedlist(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => deleteFromTrustedList(token!, username),
    onMutate: async (username) => {
      await queryClient.cancelQueries({ queryKey: ["user", "details", token] });
      const previous = queryClient.getQueryData(["user", "details", token]);

      queryClient.setQueryData(["user", "details", token], (old: any) => {
        if (!old) return old;
        const whitelists = (old.whitelists || []).filter(
          (u: string) => u !== username,
        );
        return { ...old, whitelists };
      });

      return { previous };
    },
    onError: (error: Error, _username, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["user", "details", token], context.previous);
      }
      toast.error("Failed to remove user", { description: error.message });
    },
    onSuccess: (_data, username) => {
      toast.success("Success", {
        description: `User ${username} removed from your Trusted Users list.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "details", token] });
    },
  });
}
