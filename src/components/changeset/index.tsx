import type { MapLibreAugmentedDiffViewer } from "@osmcha/maplibre-adiff-viewer";
import bbox from "@turf/bbox";
import type * as maplibre from "maplibre-gl";
import Mousetrap from "mousetrap";
import React, { useCallback, useEffect, useState } from "react";
import {
  CHANGESET_DETAILS_DETAILS,
  CHANGESET_DETAILS_DISCUSSIONS,
  CHANGESET_DETAILS_GEOMETRY_CHANGES,
  CHANGESET_DETAILS_MAP,
  CHANGESET_DETAILS_OTHER_FEATURES,
  CHANGESET_DETAILS_SUSPICIOUS,
  CHANGESET_DETAILS_TAGS,
  CHANGESET_DETAILS_USER,
} from "../../config/bindings.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { getUserDetails } from "../../network/openstreetmap.ts";
import { getUsers } from "../../network/whosthat.ts";
import { useChangesetMap } from "../../query/hooks/useChangesetMap.ts";
import ElementInfo from "../element_info.tsx";
import { Discussions } from "./discussions.tsx";
import { Features } from "./features.tsx";
import { GeometryChanges } from "./geometry_changes.tsx";
import { Header } from "./header.tsx";
import { MapOptions } from "./map_options.tsx";
import { OtherFeatures } from "./other_features.tsx";
import { elementKey } from "./selection.ts";
import { type Tab, Tabs } from "./tabs.tsx";
import { TagChanges } from "./tag_changes.tsx";
import { User } from "./user.tsx";

type ChangesetProps = {
  changesetId: number;
  currentChangeset: any;
  showElements: Array<string>;
  showActions: Array<string>;
  setShowElements: (elements: Array<string>) => any;
  setShowActions: (actions: Array<string>) => any;
  mapRef: React.RefObject<{
    map: maplibre.Map;
    adiffViewer: MapLibreAugmentedDiffViewer;
  }>;
  selected: any;
  setSelected: (selected: any) => void;
};

const toggleOptions = [
  CHANGESET_DETAILS_DETAILS,
  CHANGESET_DETAILS_SUSPICIOUS,
  CHANGESET_DETAILS_TAGS,
  CHANGESET_DETAILS_GEOMETRY_CHANGES,
  CHANGESET_DETAILS_OTHER_FEATURES,
  CHANGESET_DETAILS_USER,
  CHANGESET_DETAILS_DISCUSSIONS,
  CHANGESET_DETAILS_MAP,
];

/**
 * This is the UI overlay that appears on top of the map in the changeset view.
 * It displays information about the changeset in the upper left, and may also display
 * information about the currently selected element in the lower right.
 */
function Changeset({
  changesetId,
  currentChangeset,
  showElements,
  showActions,
  setShowElements,
  setShowActions,
  mapRef,
  selected,
  setSelected,
}: ChangesetProps) {
  const { token } = useAuth();
  const { data: osmInfo } = useChangesetMap(changesetId);

  const [userDetails, setUserDetails] = useState<any>(null);
  const [whosThat, setWhosThat] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<string | null>(
    CHANGESET_DETAILS_DETAILS.label,
  );

  const toggleTab = useCallback((label: string) => {
    setActiveTab((prev) => (prev === label ? null : label));
  }, []);

  // Fetch user details when changeset changes
  useEffect(() => {
    const uid = currentChangeset?.properties?.uid;
    if (!uid || !token) return;

    let cancelled = false;

    getUserDetails(uid)
      .then((details) => {
        if (!cancelled) {
          setUserDetails(details);
        }
      })
      .catch((e) => console.log(e));

    getUsers(uid)
      .then((users) => {
        if (!cancelled && users[0]?.names) {
          setWhosThat(users[0].names);
        }
      })
      .catch((e) => console.log(e));

    return () => {
      cancelled = true;
    };
  }, [currentChangeset?.properties?.uid, token]);

  // Setup keyboard shortcuts
  useEffect(() => {
    for (const opt of toggleOptions) {
      Mousetrap.bind(opt.bindings, () => toggleTab(opt.label));
    }

    return () => {
      for (const opt of toggleOptions) {
        for (const binding of opt.bindings) {
          Mousetrap.unbind(binding);
        }
      }
    };
  }, [toggleTab]);

  /// Given an OSM Element type (node/way/relation) and ID number,
  /// add or remove a highlight effect for the corresponding map features.
  /// (Used for indicating elements when references to them in the UI are hovered)
  const setHighlight = useCallback(
    (type: string, id: number, isHighlighted: boolean) => {
      if (!mapRef.current) return;
      const { adiffViewer } = mapRef.current;
      if (isHighlighted) {
        adiffViewer.highlight(type, id);
      } else {
        adiffViewer.unhighlight(type, id);
      }
    },
    [mapRef],
  );

  /// Given an OSM Element type (node/way/relation) and ID number,
  /// zoom the map to show that element, and select it in the overlay.
  const zoomToAndSelect = useCallback(
    (type: string, id: number) => {
      if (!mapRef.current) return;
      const { map, adiffViewer } = mapRef.current;

      // find the feature(s) in the geojson that represent this element
      // (there may be two, the old and new versions, if the element was modified)
      const features = adiffViewer.geojson.features.filter(
        (feature: any) =>
          feature.properties.type === type && feature.properties.id === id,
      );

      // zoom the map to the bounding box of the feature(s)
      let bounds = bbox({ type: "FeatureCollection", features });
      if (bounds.length === 6) {
        bounds = [bounds[0], bounds[1], bounds[3], bounds[4]];
      }
      const camera = map.cameraForBounds(bounds, {
        padding: 50,
        maxZoom: 18,
      });
      if (camera) {
        map.jumpTo(camera);
      }

      // style the feature(s) on the map to indicate that they're selected
      adiffViewer.select(type, id);

      // find the action in the adiff that affects this element
      const action = adiffViewer.adiff.actions.find((action: any) => {
        const element = action.new ?? action.old;
        return element.type === type && element.id === id;
      });

      // show the ElementInfo overlay for that action
      setSelected(action);
    },
    [mapRef, setSelected],
  );

  const selectedElement = selected ? (selected.new ?? selected.old) : null;
  const selectedKey = selectedElement
    ? elementKey(selectedElement.type, selectedElement.id)
    : null;

  const properties = currentChangeset?.properties || {};
  const features = properties.features || [];
  const discussions = osmInfo?.metadata?.changeset?.comments || [];

  const tabs: Tab[] = [
    {
      binding: CHANGESET_DETAILS_DETAILS,
      title: "Details",
      icon: "eye",
      content: (
        <Header
          toggleUser={() => toggleTab(CHANGESET_DETAILS_USER.label)}
          changesetId={changesetId}
          properties={properties}
          userEditCount={userDetails?.count || 0}
        />
      ),
    },
    {
      binding: CHANGESET_DETAILS_SUSPICIOUS,
      title: "Flagged features",
      icon: "alert",
      empty: features.length === 0,
      content: (
        <Features
          changesetId={changesetId}
          properties={properties}
          selected={selectedKey}
          setHighlight={setHighlight}
          zoomToAndSelect={zoomToAndSelect}
        />
      ),
    },
    {
      binding: CHANGESET_DETAILS_TAGS,
      title: "Tag changes",
      icon: "hash",
      content: (
        <TagChanges
          changesetId={changesetId}
          adiff={osmInfo?.adiff}
          selected={selectedKey}
          setHighlight={setHighlight}
          zoomToAndSelect={zoomToAndSelect}
        />
      ),
    },
    {
      binding: CHANGESET_DETAILS_GEOMETRY_CHANGES,
      title: "Geometry changes",
      icon: "point-line",
      content: (
        <GeometryChanges
          changesetId={changesetId}
          adiff={osmInfo?.adiff}
          selected={selectedKey}
          setHighlight={setHighlight}
          zoomToAndSelect={zoomToAndSelect}
        />
      ),
    },
    {
      binding: CHANGESET_DETAILS_OTHER_FEATURES,
      title: "Other features",
      icon: "plus",
      content: (
        <OtherFeatures
          changesetId={changesetId}
          adiff={osmInfo?.adiff}
          selected={selectedKey}
          setHighlight={setHighlight}
          zoomToAndSelect={zoomToAndSelect}
        />
      ),
    },
    {
      binding: CHANGESET_DETAILS_DISCUSSIONS,
      title: "Discussions",
      icon: "contact",
      empty: discussions.length === 0,
      content: (
        <Discussions
          changesetAuthor={properties.user}
          discussions={discussions}
          changesetIsHarmful={properties.harmful}
          changesetId={changesetId}
        />
      ),
    },
    {
      binding: CHANGESET_DETAILS_USER,
      title: "User",
      icon: "user",
      content: (
        <User
          userDetails={{
            uid: properties.uid,
            name: properties.user,
            ...userDetails,
          }}
          whosThat={whosThat || []}
          changesetUsername
        />
      ),
    },
    {
      binding: CHANGESET_DETAILS_MAP,
      title: "Map controls",
      icon: "map",
      content: (
        <MapOptions
          showElements={showElements}
          showActions={showActions}
          setShowElements={setShowElements}
          setShowActions={setShowActions}
        />
      ),
    },
  ];

  return (
    <React.Fragment>
      <div className="absolute z1" style={{ top: 8, left: 8 }}>
        <Tabs tabs={tabs} activeId={activeTab} onToggle={toggleTab} />
      </div>
      {selected && (
        <div
          className="absolute bg-white px12 py6 z5 round"
          style={{
            bottom: 0,
            right: 0,
            margin: "10px",
            minWidth: "400px",
            maxWidth: "550px",
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          <ElementInfo
            action={selected}
            setHighlight={setHighlight}
            changeset={currentChangeset}
            changesetId={changesetId}
          />
        </div>
      )}
    </React.Fragment>
  );
}

export { Changeset };
