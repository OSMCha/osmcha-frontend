import type React from "react";
import { Link } from "react-router";
import { Button } from "../components/button";
import { SecondaryPagesHeader } from "../components/secondary_pages_header";
import { BlockMarkup } from "../components/user/block_markup";
import { SaveUser } from "../components/user/save_user";
import { useAuth } from "../hooks/useAuth";
import { useTrustedlist } from "../query/hooks/useTrustedlist";
import {
  useAddToTrustedlist,
  useRemoveFromTrustedlist,
} from "../query/hooks/useTrustedlistMutations";
import { isMobile } from "../utils/isMobile";
import { getObjAsQueryParam } from "../utils/query_params";

interface TrustedListBlockProps {
  data: string;
  removeFromTrustedList: (username: string) => void;
}

const TrustedListBlock = ({
  data,
  removeFromTrustedList,
}: TrustedListBlockProps) => (
  <BlockMarkup>
    <span>
      <span>{data}</span>
    </span>
    <span>
      <Link
        className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
        to={{
          search: getObjAsQueryParam("filters", {
            users: [
              {
                label: data,
                value: data,
              },
            ],
          }),
        }}
      >
        Changesets
      </Link>
      <Button
        className="mr3 bg-transparent border--0"
        onClick={() => removeFromTrustedList(data)}
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
  data: string[];
  TargetBlock: React.ComponentType<TrustedListBlockProps>;
  propsToPass: { removeFromTrustedList: (username: string) => void };
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

function TrustedUsers() {
  const { token, user } = useAuth();
  const currentUser = user as UserData | undefined;
  const { data: trustedList = [] } = useTrustedlist();
  const addMutation = useAddToTrustedlist();
  const removeMutation = useRemoveFromTrustedlist();

  const addToTrustedList = ({ username }: { username: string }) => {
    if (!username) return;
    addMutation.mutate(username);
  };

  const removeFromTrustedList = (username: string) => {
    if (!username) return;
    removeMutation.mutate(username);
  };

  const trustedUsers = [...trustedList].sort((a, b) => a.localeCompare(b));
  const mobile = isMobile();

  return (
    <div
      className={`flex-parent flex-parent--column changesets-filters bg-white${
        mobile ? " viewport-full" : ""
      }`}
    >
      <SecondaryPagesHeader
        title="Trusted Users"
        avatar={currentUser?.avatar}
      />
      <div className="px30 flex-child pb60 filters-scroll">
        <div className="flex-parent flex-parent--column align justify--space-between">
          {token && (
            <div>
              <div className="mt24 mb12">
                <ListFortified
                  data={trustedUsers}
                  TargetBlock={TrustedListBlock}
                  propsToPass={{
                    removeFromTrustedList,
                  }}
                  SaveComp={<SaveUser onCreate={addToTrustedList} />}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { TrustedUsers };
