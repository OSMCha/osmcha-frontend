import type React from "react";
import { Link } from "react-router";
import { Button } from "../components/button";
import { SecondaryPagesHeader } from "../components/secondary_pages_header";
import { BlockMarkup } from "../components/user/block_markup";
import { SaveUser } from "../components/user/save_user";
import { useAuth } from "../hooks/useAuth";
import { useWatchlist } from "../query/hooks/useWatchlist";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
} from "../query/hooks/useWatchlistMutations";
import { isMobile } from "../utils/isMobile";
import { getObjAsQueryParam } from "../utils/query_params";

interface WatchlistUser {
  username: string;
  uid: string;
}

interface WatchListBlockProps {
  data: WatchlistUser;
  removeFromWatchList: (uid: string) => void;
}

const WatchListBlock = ({ data, removeFromWatchList }: WatchListBlockProps) => (
  <BlockMarkup>
    <span>
      <span>{data.username}</span>
      <span className="txt-em color-gray pl6">({data.uid})</span>
    </span>
    <span>
      <Link
        className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
        to={{
          search: getObjAsQueryParam("filters", {
            users: [
              {
                label: data.username,
                value: data.username,
              },
            ],
          }),
        }}
      >
        Changesets
      </Link>
      <Button
        className="mr3 bg-transparent border--0"
        onClick={() => removeFromWatchList(data.uid)}
      >
        <svg className={"icon txt-m mb3 inline-block align-middle"}>
          <use xlinkHref="#icon-trash" />
        </svg>
        Remove
      </Button>
    </span>
  </BlockMarkup>
);

interface ListFortifiedProps {
  data: WatchlistUser[];
  TargetBlock: React.ComponentType<WatchListBlockProps>;
  propsToPass: { removeFromWatchList: (uid: string) => void };
  SaveComp: React.ReactNode;
}

const ListFortified = ({
  data,
  TargetBlock,
  propsToPass,
  SaveComp,
}: ListFortifiedProps) => (
  <div>
    {data.map((e, i) => (
      <TargetBlock key={i} data={e} {...propsToPass} />
    ))}
    {SaveComp}
  </div>
);

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

  const addToWatchList = ({ username, uid }: WatchlistUser) => {
    if (!username || !uid) return;
    addMutation.mutate({ username, uid });
  };

  const removeFromWatchList = (uid: string) => {
    if (!uid) return;
    removeMutation.mutate(uid);
  };

  const sortedWatchlist = [...watchlist].sort((a, b) =>
    a.username.localeCompare(b.username),
  );
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
        <div className="flex-parent flex-parent--column align justify--space-between">
          {token && (
            <div>
              <div className="mt24 mb12">
                <ListFortified
                  data={sortedWatchlist}
                  TargetBlock={WatchListBlock}
                  propsToPass={{
                    removeFromWatchList,
                  }}
                  SaveComp={
                    <SaveUser onCreate={addToWatchList} forWatchlist={true} />
                  }
                />
              </div>
            </div>
          )}
          {token && (
            <span>
              <Link
                className="input wmax180 ml12 btn btn--s border border--1 border--lighten25 border--lighten50-on-hover round bg-darken5 bg-lighten25-on-hover color-gray transition"
                to={{
                  search: getObjAsQueryParam("filters", {
                    blacklist: [{ label: "Yes", value: "True" }],
                  }),
                }}
              >
                <svg className={"icon txt-m mb3 inline-block align-middle"}>
                  <use xlinkHref="#icon-filter" />
                </svg>
                Watchlist's changesets
              </Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export { Watchlist };
