import type { MapLibreAugmentedDiffViewer } from "@osmcha/maplibre-adiff-viewer";
import type * as maplibre from "maplibre-gl";
import Mousetrap from "mousetrap";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { Changeset as ChangesetOverlay } from "../components/changeset";
import { FILTER_BY_USER } from "../config/bindings";
import { useAuth } from "../hooks/useAuth";
import { useFilters } from "../hooks/useFilters";
import { useChangeset } from "../query/hooks/useChangeset";
import { showToast } from "../utils/toast";
import { CMap } from "../views/map";
import { NavbarChangeset } from "../views/navbar_changeset";

function Changeset() {
  const { token, user } = useAuth();
  const { setFilters } = useFilters();
  const { id } = useParams<{ id: string }>();
  const changesetId = id ? parseInt(id, 10) : null;

  const {
    data: currentChangeset,
    isLoading,
    error,
  } = useChangeset(changesetId, token);

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
    if (currentChangeset && currentChangeset.properties) {
      const userName = currentChangeset.properties.user;
      setFilters({
        users: [
          {
            label: userName,
            value: userName,
          },
        ],
      });
    }
  }, [currentChangeset, setFilters]);

  useEffect(() => {
    Mousetrap.bind(FILTER_BY_USER.bindings, filterChangesetsByUser);
    return () => {
      FILTER_BY_USER.bindings.forEach((k) => Mousetrap.unbind(k));
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
        currentChangeset={currentChangeset}
        username={user?.username || null}
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

        {!isLoading && currentChangeset && changesetId && (
          <ChangesetOverlay
            changesetId={changesetId}
            currentChangeset={currentChangeset}
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
