import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteFromWatchList,
  postUserToWatchList,
} from "../../network/osmcha_watchlist";

interface WatchlistUser {
  username: string;
  uid: string;
}

export function useAddToWatchlist(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, uid }: WatchlistUser) =>
      postUserToWatchList(token!, { watchlist_user: { username, uid } }),
    onMutate: async ({ username, uid }) => {
      await queryClient.cancelQueries({ queryKey: ["watchlist", token] });
      const previous = queryClient.getQueryData(["watchlist", token]);

      queryClient.setQueryData(
        ["watchlist", token],
        (old: WatchlistUser[] = []) => [...old, { username, uid }],
      );

      return { previous };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["watchlist", token], context.previous);
      }
      toast.error("Failed to add user", { description: error.message });
    },
    onSuccess: (_data, { username, uid }) => {
      toast.success("Success", {
        description: `User ${username} (${uid}) added to your watchlist.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", token] });
    },
  });
}

export function useRemoveFromWatchlist(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uid: string) => deleteFromWatchList(token!, uid),
    onMutate: async (uid) => {
      await queryClient.cancelQueries({ queryKey: ["watchlist", token] });
      const previous = queryClient.getQueryData(["watchlist", token]);

      queryClient.setQueryData(
        ["watchlist", token],
        (old: WatchlistUser[] = []) => old.filter((u) => u.uid !== uid),
      );

      return { previous };
    },
    onError: (error: Error, _uid, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["watchlist", token], context.previous);
      }
      toast.error("Failed to remove user", { description: error.message });
    },
    onSuccess: (_data,) => {
      toast.success("Success", {
        description: `User removed from your watchlist.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", token] });
    },
  });
}
