import { useUserDetails } from "../query/hooks/useUserDetails";
import { useWatchlist } from "../query/hooks/useWatchlist";

interface UserDetailsWithWhitelists {
  whitelists?: string[];
  [key: string]: any;
}

export const useIsUserListed = (
  username: string,
  uid: number,
  token?: string | null,
): [boolean, boolean] => {
  const { data: userDetails } = useUserDetails();
  const { data: watchlist = [] } = useWatchlist();

  // Trustedlist comes from user details, not a separate API call
  const trustedlist =
    (userDetails as UserDetailsWithWhitelists | undefined)?.whitelists || [];

  const isInTrustedlist =
    Array.isArray(trustedlist) && trustedlist.includes(username);
  const isInWatchlist =
    Array.isArray(watchlist) && watchlist.some((user) => user.uid === uid);

  return [isInTrustedlist, isInWatchlist];
};
