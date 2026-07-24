import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { RelativeTime } from "../components/relative_time.tsx";
import { SecondaryPagesHeader } from "../components/secondary_pages_header.tsx";
import { SortHeader } from "../components/sort_header.tsx";
import { SaveUser } from "../components/user/save_user.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { useWatchlist } from "../query/hooks/useWatchlist.ts";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
} from "../query/hooks/useWatchlistMutations.ts";
import { isMobile } from "../utils/isMobile.ts";
import { getObjAsQueryParam } from "../utils/query_params.ts";

interface WatchlistUser {
  username: string;
  uid: string;
  date?: string;
}

type SortKey = "username" | "uid" | "date";
type SortDir = "asc" | "desc";

function compareUsers(
  a: WatchlistUser,
  b: WatchlistUser,
  key: SortKey,
): number {
  if (key === "uid") return Number(a.uid) - Number(b.uid);
  if (key === "date") return (a.date || "").localeCompare(b.date || "");
  return a.username.localeCompare(b.username);
}

interface UserData {
  avatar?: string;
  [key: string]: any;
}

function Watchlist() {
  const { token, user } = useAuth();
  const currentUser = user as UserData | undefined;
  const { data: watchlist = [] } = useWatchlist();
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const onSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      // Names/ids read best ascending; dates most-recent-first.
      setSortDir(key === "date" ? "desc" : "asc");
    }
  };

  const addToWatchList = ({ username, uid }: WatchlistUser) => {
    if (!username || !uid) return;
    if (watchlist.some((u) => u.uid === uid)) {
      toast.error("Already on watchlist", {
        description: `User ${username} (${uid}) is already on your watchlist.`,
      });
      return;
    }
    addMutation.mutate({ username, uid });
  };

  const removeFromWatchList = (uid: string) => {
    if (!uid) return;
    removeMutation.mutate(uid);
  };

  const sorted = [...watchlist].sort((a, b) => {
    const cmp = compareUsers(a, b, sortKey);
    return sortDir === "asc" ? cmp : -cmp;
  });
  const mobile = isMobile();

  return (
    <div
      className={`flex-parent flex-parent--column changesets-filters bg-white ${
        mobile ? "viewport-full" : ""
      }`}
    >
      <SecondaryPagesHeader title="Watchlist" avatar={currentUser?.avatar} />
      <div
        className={`${mobile ? "px12" : "px30"} flex-child pb60 filters-scroll`}
      >
        {token && (
          <div className="mt24">
            <div className="color-gray mb6 ml3">
              {watchlist.length} {watchlist.length === 1 ? "user" : "users"} on
              your watchlist
            </div>
            <table
              className="table osmcha-custom-table w-full"
              style={{ tableLayout: "fixed" }}
            >
              <colgroup>
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>
              <thead>
                <tr>
                  <SortHeader
                    label="Username"
                    sortKey="username"
                    active={sortKey}
                    dir={sortDir}
                    onSort={onSort}
                  />
                  <SortHeader
                    label="ID"
                    sortKey="uid"
                    active={sortKey}
                    dir={sortDir}
                    onSort={onSort}
                  />
                  <SortHeader
                    label="Added"
                    sortKey="date"
                    active={sortKey}
                    dir={sortDir}
                    onSort={onSort}
                  />
                  <th>
                    <span className="hide-visually">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((u) => (
                  <tr key={u.uid} className="bg-darken5-on-hover">
                    <td className="txt-bold">{u.username}</td>
                    <td className="color-gray">{u.uid}</td>
                    <td className="color-gray">
                      {u.date ? (
                        <RelativeTime datetime={new Date(u.date)} />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="txt-right">
                      <Link
                        className="txt-underline-on-hover color-blue mr12"
                        to={{
                          search: getObjAsQueryParam("filters", {
                            users: [{ label: u.username, value: u.username }],
                          }),
                        }}
                      >
                        Changesets
                      </Link>
                      <button
                        type="button"
                        className="bg-transparent color-gray color-red-on-hover cursor-pointer"
                        title="Remove from watchlist"
                        onClick={() => removeFromWatchList(u.uid)}
                      >
                        <svg className="icon inline-block align-middle w18 h18">
                          <use xlinkHref="#icon-trash" />
                        </svg>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt18">
              <SaveUser onCreate={addToWatchList} forWatchlist={true} />
            </div>
          </div>
        )}

        {token && (
          <div className="mt24">
            <Link
              className="btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
              to={{
                search: getObjAsQueryParam("filters", {
                  blacklist: [{ label: "Yes", value: "True" }],
                }),
              }}
            >
              <svg className="icon txt-m mb3 inline-block align-middle">
                <use xlinkHref="#icon-filter" />
              </svg>
              View changesets from users on your watchlist
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export { Watchlist };
