import type { MapLibreAugmentedDiffViewer } from "@osmcha/maplibre-adiff-viewer";
import type * as maplibre from "maplibre-gl";
import Mousetrap from "mousetrap";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { Changeset as ChangesetOverlay } from "../components/changeset";
import { FILTER_BY_USER } from "../config/bindings";
import { useAuth } from "../hooks/useAuth";
import { useFilters } from "../hooks/useFilters";
import { useChangeset } from "../query/hooks/useChangeset";
import { showToast } from "../utils/toast";
import { CMap } from "../views/map";
import { NavbarChangeset } from "../views/navbar_changeset";

interface ChangesetData {
  properties?: {
    user?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface UserData {
  username?: string;
  [key: string]: any;
}

function Changeset() {
  const { user } = useAuth();
  const currentUser = user as UserData | undefined;
  const { setFilters } = useFilters();
  const { id } = useParams<{ id: string }>();
  const changesetId = id ? parseInt(id, 10) : null;

  const {
    data: currentChangeset,
    isLoading,
    error,
  } = useChangeset(changesetId);

  const changeset = currentChangeset as ChangesetData | undefined;

  const [camera, setCamera] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [showElements, setShowElements] = useState<Array<string>>([
    "node",
    "way",
    "relation",
  ]);
  const [showActions, setShowActions] = useState<Array<string>>([
    "create",
    "modify",
    "delete",
    "noop",
  ]);

  // This ref is passed to CMap, which updates it with references to the MapLibre map
  // and AdiffViewer instance. Other components can use this ref to imperatively update
  // the map state.
  const mapRef = useRef<{
    map: maplibre.Map;
    adiffViewer: MapLibreAugmentedDiffViewer;
  } | null>(null);

  const filterChangesetsByUser = useCallback(() => {
    if (changeset?.properties) {
      const userName = changeset.properties.user;
      setFilters({
        users: [
          {
            label: userName,
            value: userName,
          },
        ],
      });
    }
  }, [changeset, setFilters]);

  useEffect(() => {
    Mousetrap.bind(FILTER_BY_USER.bindings, filterChangesetsByUser);
    return () => {
      for (const k of FILTER_BY_USER.bindings) {
        Mousetrap.unbind(k);
      }
    };
  }, [filterChangesetsByUser]);

  useEffect(() => {
    // Reset selected element and filter choices when switching between changesets
    setSelected(null);
    setShowElements(["node", "way", "relation"]);
    setShowActions(["create", "modify", "delete", "noop"]);
  }, []);

  useEffect(() => {
    if (error) {
      showToast({
        kind: "error",
        title: `changeset:${changesetId} failed to load`,
        description: "Try reloading osmcha",
      });
      console.error(error);
    }
  }, [error, changesetId]);

  return (
    <div className="flex-parent flex-parent--column h-full">
      <NavbarChangeset
        changesetId={changesetId || 0}
        currentChangeset={changeset}
        username={currentUser?.username}
        camera={camera}
      />
      <div className="flex-child flex-child--grow relative">
        <CMap
          changesetId={changesetId}
          mapRef={mapRef}
          className="z0 fixed bottom right"
          showElements={showElements}
          showActions={showActions}
          setSelected={setSelected}
          setCamera={setCamera}
        />

        {!isLoading && changeset && changesetId && (
          <ChangesetOverlay
            changesetId={changesetId}
            currentChangeset={changeset}
            showElements={showElements}
            showActions={showActions}
            setShowElements={setShowElements}
            setShowActions={setShowActions}
            mapRef={mapRef}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </div>
    </div>
  );
}

export { Changeset };
