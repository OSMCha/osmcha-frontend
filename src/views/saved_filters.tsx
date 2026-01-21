import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { CustomURL } from "../components/customURL";
import { SecondaryPagesHeader } from "../components/secondary_pages_header";
import { BlockMarkup } from "../components/user/block_markup";
import { API_URL } from "../config";
import { useAuth } from "../hooks/useAuth";
import { useFilters } from "../hooks/useFilters";
import { useAllAOIs } from "../query/hooks/useAOI";
import { useCreateAOI, useDeleteAOI } from "../query/hooks/useAOIMutations";
import { isMobile } from "../utils/isMobile";

interface SaveButtonProps {
  onCreate: (value: string) => void;
}

function SaveButton({ onCreate }: SaveButtonProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      setEditing(false);
      if (value) {
        onCreate(value);
        setValue("");
      }
    } else if (event.key === "Escape") {
      setEditing(false);
      setValue("");
    }
  };

  const handleSave = () => {
    setEditing(false);
    if (value) {
      onCreate(value);
      setValue("");
    }
  };

  return (
    <span>
      {editing ? (
        <span className="flex-parent flex-parent--row ">
          <input
            placeholder="Filter name"
            className="input wmax120 ml12"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button className="input wmax120 ml6" onClick={handleSave}>
            Save
          </Button>
        </span>
      ) : (
        <Button
          className="input wmax120 ml12 mt12"
          onClick={() => setEditing(true)}
        >
          Save Filter
        </Button>
      )}
    </span>
  );
}

const AOIsBlock = ({ data, activeAoiId, removeAoi }) => (
  <BlockMarkup>
    <Link
      className="mx3"
      to={{
        search: `aoi=${data.id}`,
        pathname: "/filters",
      }}
    >
      <span className="txt-bold">
        {data.properties?.name}
        {activeAoiId === data.id && (
          <span className="ml12 btn btn--s px6 py0 bg-darken25 events-none">
            Active
          </span>
        )}
      </span>
    </Link>
    <span>
      <CustomURL
        href={`${API_URL}/aoi/${data.id}/changesets/feed/`}
        className="mr3"
        iconName="rss"
      >
        RSS Feed
      </CustomURL>
      <Button
        className="mr3 bg-transparent border--0"
        onClick={() => removeAoi(data.id)}
      >
        <svg className={"icon txt-m mb3 inline-block align-middle color-gray"}>
          <use xlinkHref="#icon-trash" />
        </svg>
        Delete
      </Button>
    </span>
  </BlockMarkup>
);

const ListFortified = ({ data, TargetBlock, propsToPass, SaveComp }) => (
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

function SavedFilters() {
  const { token, user } = useAuth();
  const currentUser = user as UserData | undefined;
  const { filters, aoiId, clearFilters } = useFilters();
  const aoisQuery = useAllAOIs();
  const createMutation = useCreateAOI();
  const deleteMutation = useDeleteAOI();
  const navigate = useNavigate();
  const mobile = isMobile();

  const createAOI = (name: string) => {
    if (!name || !token) return;

    createMutation.mutate({ name, filters });
  };

  const removeAOI = (aoiIdToRemove: string) => {
    if (!aoiIdToRemove || !token) return;

    deleteMutation.mutate(aoiIdToRemove, {
      onSuccess: () => {
        if (aoiIdToRemove === aoiId) {
          clearFilters();
          navigate("/user");
        }
      },
    });
  };

  const aois = aoisQuery.data?.features || [];

  return (
    <div
      className={`flex-parent flex-parent--column changesets-filters bg-white${
        mobile ? "viewport-full" : ""
      }`}
    >
      <SecondaryPagesHeader
        title="Saved Filters"
        avatar={currentUser?.avatar}
      />
      <div className="px30 flex-child  pb60  filters-scroll">
        <div className="flex-parent flex-parent--column align justify--space-between">
          {token && (
            <div>
              <div className="mt24 mb12">
                <ListFortified
                  data={aois}
                  TargetBlock={AOIsBlock}
                  propsToPass={{
                    activeAoiId: aoiId,
                    removeAoi: removeAOI,
                  }}
                  SaveComp={<SaveButton onCreate={createAOI} />}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { SavedFilters };
