import { useUserDetails } from "../query/hooks/useUserDetails";
import { useWatchlist } from "../query/hooks/useWatchlist";

export const useIsUserListed = (username, uid, token) => {
  const { data: userDetails } = useUserDetails(token);
  const { data: watchlist = [] } = useWatchlist(token);

  // Trustedlist comes from user details, not a separate API call
  const trustedlist = userDetails?.whitelists || [];

  const isInTrustedlist =
    Array.isArray(trustedlist) && trustedlist.includes(username);
  const isInWatchlist =
    Array.isArray(watchlist) && watchlist.some((user) => user.uid === uid);

  return [isInTrustedlist, isInWatchlist];
};
