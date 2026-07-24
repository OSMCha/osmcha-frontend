import { TrustedListUser } from "./trustedlist_user.tsx";
import { WatchListUser } from "./watchlist_user.tsx";

interface SaveUserProps {
  forWatchlist?: boolean;
  onCreate: (data: any) => void;
}

export function SaveUser({ forWatchlist, onCreate }: SaveUserProps) {
  const onSave = (username: string, uid?: number | string) => {
    if (forWatchlist) {
      if (!username || !uid) return;
      onCreate({ username, uid });
    } else {
      if (!username) return;
      onCreate({ username });
    }
  };

  return (
    <span className="flex-parent flex-parent--row">
      {forWatchlist ? (
        <WatchListUser onSave={onSave} />
      ) : (
        <TrustedListUser onSave={onSave} />
      )}
    </span>
  );
}
