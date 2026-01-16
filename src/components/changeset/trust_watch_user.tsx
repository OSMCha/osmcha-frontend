import { useAuth } from "../../hooks/useAuth";
import { useTrustedlist } from "../../query/hooks/useTrustedlist";
import {
  useAddToTrustedlist,
  useRemoveFromTrustedlist,
} from "../../query/hooks/useTrustedlistMutations";
import { useWatchlist } from "../../query/hooks/useWatchlist";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
} from "../../query/hooks/useWatchlistMutations";
import { Dropdown } from "../dropdown";

interface TrustWatchUserProps {
  user: {
    name: string;
    uid: number;
  };
}

function TrustWatchUser({ user }: TrustWatchUserProps) {
  const { token } = useAuth();
  const { data: trustedlist = [] } = useTrustedlist(token);
  const { data: watchlist = [] } = useWatchlist(token);
  const addToTrustedlistMutation = useAddToTrustedlist(token);
  const removeFromTrustedlistMutation = useRemoveFromTrustedlist(token);
  const addToWatchlistMutation = useAddToWatchlist(token);
  const removeFromWatchlistMutation = useRemoveFromWatchlist(token);

  const username = user.name;
  const uid = user.uid;

  const handleVerify = (arr: Array<any>) => {
    if (arr.length === 1) {
      if (arr[0].value === false) {
        addToWatchlistMutation.mutate({ username, uid: String(uid) });
      }
      if (arr[0].value === true) {
        addToTrustedlistMutation.mutate(username);
      }
    } else if (arr.length > 1) {
      throw new Error("verify array is big");
    }
  };

  const isWatchlisted = watchlist.some((u) => u.uid === String(uid));
  const isTrusted = trustedlist.includes(username);

  if (isWatchlisted) {
    return (
      <div className="flex-parent-inline">
        <span className="btn btn--s border border--1 round color-gray transition pl12 pr6 bg-lighten50 border--red-light">
          <span>
            <svg className="icon inline-block align-middle pr3 pb3 w18 h18 color-gray">
              <use xlinkHref="#icon-alert" />
            </svg>
            Watchlisted user
          </span>
          <svg
            onClick={() => removeFromWatchlistMutation.mutate(String(uid))}
            className="icon inline-block align-middle pl6 w24 h24 cursor-pointer color-gray"
          >
            <use xlinkHref="#icon-close" />
          </svg>
        </span>
      </div>
    );
  } else if (isTrusted) {
    return (
      <div className="flex-parent-inline">
        <span className="btn btn--s border border--1 round color-gray transition pl12 pr6 bg-lighten50 border--yellow">
          <span>
            <svg className="icon inline-block align-middle pr3 pb3 w18 h18 color-gray">
              <use xlinkHref="#icon-star" />
            </svg>
            Trusted user
          </span>
          <svg
            onClick={() => removeFromTrustedlistMutation.mutate(username)}
            className="icon inline-block align-middle pl6 w24 h24 cursor-pointer color-gray"
          >
            <use xlinkHref="#icon-close" />
          </svg>
        </span>
      </div>
    );
  }

  return (
    <div className="select-container">
      <Dropdown
        eventTypes={["click", "touchend"]}
        value={[]}
        onAdd={() => {}}
        onRemove={() => {}}
        options={[
          {
            value: false,
            label: "Add to your watchlist",
          },
          {
            value: true,
            label: "Add to your trusted users list",
          },
        ]}
        onChange={handleVerify}
        display="Trust / Watch user"
        position="left"
      />
    </div>
  );
}

export { TrustWatchUser };
