import { useState } from "react";
import { Link } from "react-router";
import { SecondaryPagesHeader } from "../components/secondary_pages_header.tsx";
import { SortHeader } from "../components/sort_header.tsx";
import { SaveUser } from "../components/user/save_user.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { useTrustedlist } from "../query/hooks/useTrustedlist.ts";
import {
  useAddToTrustedlist,
  useRemoveFromTrustedlist,
} from "../query/hooks/useTrustedlistMutations.ts";
import { isMobile } from "../utils/isMobile.ts";
import { getObjAsQueryParam } from "../utils/query_params.ts";

type SortDir = "asc" | "desc";

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
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const addToTrustedList = ({ username }: { username: string }) => {
    if (!username) return;
    addMutation.mutate(username);
  };

  const removeFromTrustedList = (username: string) => {
    if (!username) return;
    removeMutation.mutate(username);
  };

  const sorted = [...trustedList].sort((a, b) => {
    const cmp = a.localeCompare(b);
    return sortDir === "asc" ? cmp : -cmp;
  });
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
      <div
        className={`${mobile ? "px12" : "px30"} flex-child pb60 filters-scroll`}
      >
        {token && (
          <div className="mt24">
            <div className="color-gray mb6 ml3">
              {trustedList.length}{" "}
              {trustedList.length === 1 ? "trusted user" : "trusted users"}
            </div>
            <table
              className="table osmcha-custom-table w-full"
              style={{ tableLayout: "fixed" }}
            >
              <colgroup>
                <col style={{ width: "75%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>
              <thead>
                <tr>
                  <SortHeader
                    label="Username"
                    sortKey="username"
                    active="username"
                    dir={sortDir}
                    onSort={() =>
                      setSortDir(sortDir === "asc" ? "desc" : "asc")
                    }
                  />
                  <th>
                    <span className="hide-visually">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((username) => (
                  <tr key={username} className="bg-darken5-on-hover">
                    <td className="txt-bold">{username}</td>
                    <td className="txt-right">
                      <Link
                        className="txt-underline-on-hover color-blue mr12"
                        to={{
                          search: getObjAsQueryParam("filters", {
                            users: [{ label: username, value: username }],
                          }),
                        }}
                      >
                        Changesets
                      </Link>
                      <button
                        type="button"
                        className="bg-transparent color-gray color-red-on-hover cursor-pointer"
                        title="Remove from trusted users"
                        onClick={() => removeFromTrustedList(username)}
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
              <SaveUser onCreate={addToTrustedList} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { TrustedUsers };
