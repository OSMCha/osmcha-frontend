import { useEffect, useState } from "react";

export const useIsUserListed = (username, uid, trustedlist, watchlist) => {
  const [isInTrustedlist, setIsInTrustedlist] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    try {
      setIsInTrustedlist(trustedlist.indexOf(username) !== -1);
    } catch (_e) {
      setIsInTrustedlist(false);
    }
    try {
      setIsInWatchlist(
        watchlist.map((user) => user.get("uid")).indexOf(uid) !== -1,
      );
    } catch (_e) {
      setIsInWatchlist(false);
    }
  }, [username, uid, watchlist, trustedlist]);

  return [isInTrustedlist, isInWatchlist];
};
