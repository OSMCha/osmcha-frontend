import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { fetchAllAOIs } from "../../network/aoi";
import { Button } from "../button";
import { Dropdown } from "../dropdown";

interface SaveAOIProps {
  name?: string;
  aoiList: Array<any>;
  aoiId?: string;
  updateAOI: (id: string, name: string) => void;
  createAOI: (name: string) => void;
}

function SaveAOI({ name, aoiList, aoiId, updateAOI, createAOI }: SaveAOIProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name || "");
  const clicked = useRef(false);

  useEffect(() => {
    setValue(name || "");
  }, [name]);

  const onClick = () => {
    clicked.current = true;
    setEditing(true);
    setValue(name || "");
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    } else if (event.key === "Escape") {
      setEditing(false);
      setValue(name || "");
      clicked.current = false;
    }
  };

  const handleSubmit = () => {
    setEditing(false);
    const matchingAoi = aoiList.find((aoi) => aoi.value === aoiId);
    if (aoiId && matchingAoi) {
      updateAOI(aoiId, value);
    } else {
      createAOI(value);
    }
  };

  return (
    <span>
      {editing ? (
        <span>
          <input
            ref={(r) => {
              if (clicked.current && r) {
                r.select();
                clicked.current = false;
              }
            }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <Button onClick={handleSubmit} className="mx3">
            Confirm Save
          </Button>
        </span>
      ) : (
        <Button onClick={onClick} className="border--0 bg-transparent">
          Save
        </Button>
      )}
    </span>
  );
}

interface FiltersHeaderProps {
  createAOI: (name: string) => void;
  updateAOI: (id: string, name: string) => void;
  removeAOI: (id: string) => void;
  loading: boolean;
  search: string;
  token: string | null;
  aoiName?: string;
  aoiId?: string;
  handleApply: () => void;
  handleClear: () => void;
  loadAoiId: (id: string) => void;
}

function FiltersHeader({
  createAOI,
  updateAOI,
  search,
  token,
  aoiName,
  aoiId,
  handleApply,
  handleClear,
}: FiltersHeaderProps) {
  const navigate = useNavigate();
  const [aoiList, setAoiList] = useState<Array<any>>([]);

  useEffect(() => {
    let cancelled = false;

    if (token) {
      fetchAllAOIs()
        .then((r) => {
          if (cancelled) return;
          const list = r.features.map((aoi: any) => ({
            label: aoi.properties.name,
            value: aoi.id,
          }));
          setAoiList(list);
        })
        .catch((e) => console.log(e));
    }

    return () => {
      cancelled = true;
    };
  }, [token]);

  const renderRssLink = () => {
    if (aoiId) {
      return (
        <a
          className="txt--s pl6"
          href={`${API_URL}/aoi/${aoiId}/changesets/feed/`}
          title="RSS Feed"
        >
          <svg className="icon icon--s mt-neg3 inline-block align-middle bg-gray-faint color-darken25 color-darken50-on-hover transition">
            <use xlinkHref="#icon-rss" />
          </svg>
        </a>
      );
    }
    return null;
  };

  const renderAoiLink = () => {
    if (aoiId) {
      return (
        <div
          className="txt--s pl6 pointer inline"
          onClick={() =>
            navigator.clipboard.writeText(
              `${API_URL.replace("/api/v1", "")}/?aoi=${aoiId}`,
            )
          }
          title="Copy filter URL"
        >
          <svg className="icon icon--s mt-neg3 inline-block align-middle bg-gray-faint color-darken25 color-darken50-on-hover transition">
            <use xlinkHref="#icon-link" />
          </svg>
        </div>
      );
    }
    return null;
  };

  const onAoiSelect = (arr: Array<any>) => {
    if (arr.length === 1) {
      navigate({
        pathname: "/filters",
        search: `aoi=${arr[0].value}`,
      });
    } else if (arr.length > 1) {
      throw new Error("filter select array is big");
    }
  };

  const renderFilterInfo = () => {
    const dropdown = (
      <Dropdown
        display={"My Filters"}
        options={aoiList}
        onChange={onAoiSelect}
        value={[]}
        onAdd={() => {}}
        onRemove={() => {}}
        position="left"
      />
    );
    if (token && aoiList.length) {
      return <span>{dropdown}</span>;
    }
    return null;
  };

  return (
    <header className="h55 hmin55 flex-parent px30 bg-gray-faint flex-parent--center-cross justify--space-between color-gray border-b border--gray-light border--1">
      <span className="txt-s color-gray--dark">{renderFilterInfo()}</span>
      <span className="txt-l txt-bold color-gray--dark">
        <span>
          Filters
          {aoiId && <span> / {aoiName}</span>}
          {renderAoiLink()}
          {renderRssLink()}
        </span>
      </span>
      <span className="txt-l color-gray--dark">
        {token && (
          <SaveAOI
            name={aoiName}
            aoiId={aoiId}
            aoiList={aoiList}
            createAOI={createAOI}
            updateAOI={updateAOI}
          />
        )}
        <Button className="border--0 bg-transparent" onClick={handleClear}>
          Reset
        </Button>
        <Button onClick={handleApply} className="mx3">
          Apply
        </Button>
        <Link to={{ search, pathname: "/" }} className="mx3 pointer">
          <svg className="icon icon--m inline-block align-middle bg-gray-faint color-darken25 color-darken50-on-hover transition">
            <use xlinkHref="#icon-close" />
          </svg>
        </Link>
      </span>
    </header>
  );
}

export { FiltersHeader };
