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
} from "../../config/bindings";
import { useAuth } from "../../hooks/useAuth";
import { getUserDetails } from "../../network/openstreetmap";
import { getUsers } from "../../network/whosthat";
import { useChangesetMap } from "../../query/hooks/useChangesetMap";
import ElementInfo from "../element_info";
import { Box } from "./box";
import { ControlLayout } from "./control_layout";
import { Discussions } from "./discussions";
import { Features } from "./features";
import { Floater } from "./floater";
import { GeometryChanges } from "./geometry_changes";
import { Header } from "./header";
import { MapOptions } from "./map_options";
import { OtherFeatures } from "./other_features";
import { TagChanges } from "./tag_changes";
import { User } from "./user";

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

  // Keyboard toggle state - track which sections are visible
  const [bindingsState, setBindingsState] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      toggleOptions.forEach((opt) => {
        initial[opt.label] = opt === CHANGESET_DETAILS_DETAILS; // Only details visible by default
      });
      return initial;
    },
  );

  const exclusiveKeyToggle = useCallback((label: string) => {
    setBindingsState((prev) => {
      const newState: Record<string, boolean> = {};
      toggleOptions.forEach((opt) => {
        newState[opt.label] = opt.label === label ? !prev[label] : false;
      });
      return newState;
    });
  }, []);

  // Fetch user details when changeset changes
  useEffect(() => {
    const uid = currentChangeset?.properties?.uid;
    if (!uid || !token) return;

    let cancelled = false;

    getUserDetails(uid, token)
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
    toggleOptions.forEach((opt) => {
      Mousetrap.bind(opt.bindings, () => exclusiveKeyToggle(opt.label));
    });

    return () => {
      toggleOptions.forEach((opt) => {
        opt.bindings.forEach((binding) => Mousetrap.unbind(binding));
      });
    };
  }, [exclusiveKeyToggle]);

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

  const toggleDetails = () =>
    exclusiveKeyToggle(CHANGESET_DETAILS_DETAILS.label);
  const toggleFeatures = () =>
    exclusiveKeyToggle(CHANGESET_DETAILS_SUSPICIOUS.label);
  const toggleOtherFeatures = () =>
    exclusiveKeyToggle(CHANGESET_DETAILS_OTHER_FEATURES.label);
  const toggleTags = () => exclusiveKeyToggle(CHANGESET_DETAILS_TAGS.label);
  const toggleGeometryChanges = () =>
    exclusiveKeyToggle(CHANGESET_DETAILS_GEOMETRY_CHANGES.label);
  const toggleDiscussions = () =>
    exclusiveKeyToggle(CHANGESET_DETAILS_DISCUSSIONS.label);
  const toggleUser = () => exclusiveKeyToggle(CHANGESET_DETAILS_USER.label);
  const toggleMapOptions = () =>
    exclusiveKeyToggle(CHANGESET_DETAILS_MAP.label);

  const properties = currentChangeset?.properties || {};
  const features = properties.features || [];
  const discussions = osmInfo?.metadata?.changeset?.comments || [];

  return (
    <React.Fragment>
      <div
        className="absolute flex-parent flex-parent--column clip"
        style={{ top: 0, left: 0 }}
      >
        <div className="flex-child clip">
          <ControlLayout
            toggleDetails={toggleDetails}
            toggleFeatures={toggleFeatures}
            toggleOtherFeatures={toggleOtherFeatures}
            toggleTags={toggleTags}
            toggleGeometryChanges={toggleGeometryChanges}
            toggleDiscussions={toggleDiscussions}
            toggleUser={toggleUser}
            toggleMapOptions={toggleMapOptions}
            features={features}
            bindingsState={bindingsState}
            discussions={discussions}
          />
          <Floater style={{ marginTop: 5, marginLeft: 41 }}>
            {bindingsState[CHANGESET_DETAILS_DETAILS.label] && (
              <Box key={3} className=" responsive-box round-tr round-br">
                <Header
                  toggleUser={toggleUser}
                  changesetId={changesetId}
                  properties={properties}
                  userEditCount={userDetails?.count || 0}
                />
              </Box>
            )}
            {bindingsState[CHANGESET_DETAILS_SUSPICIOUS.label] && (
              <Box key={2} className=" responsive-box round-tr round-br">
                <Features
                  changesetId={changesetId}
                  properties={properties}
                  setHighlight={setHighlight}
                  zoomToAndSelect={zoomToAndSelect}
                />
              </Box>
            )}
            {bindingsState[CHANGESET_DETAILS_TAGS.label] && (
              <Box key={5} className=" responsive-box round-tr round-br">
                <TagChanges
                  changesetId={changesetId}
                  adiff={osmInfo?.adiff}
                  setHighlight={setHighlight}
                  zoomToAndSelect={zoomToAndSelect}
                />
              </Box>
            )}
            {bindingsState[CHANGESET_DETAILS_GEOMETRY_CHANGES.label] && (
              <Box key={5} className=" responsive-box round-tr round-br">
                <GeometryChanges
                  changesetId={changesetId}
                  adiff={osmInfo?.adiff}
                  setHighlight={setHighlight}
                  zoomToAndSelect={zoomToAndSelect}
                />
              </Box>
            )}
            {bindingsState[CHANGESET_DETAILS_OTHER_FEATURES.label] && (
              <Box key={5} className=" responsive-box round-tr round-br">
                <OtherFeatures
                  changesetId={changesetId}
                  adiff={osmInfo?.adiff}
                  setHighlight={setHighlight}
                  zoomToAndSelect={zoomToAndSelect}
                />
              </Box>
            )}
            {bindingsState[CHANGESET_DETAILS_DISCUSSIONS.label] && (
              <Box key={1} className=" responsive-box  round-tr round-br">
                <Discussions
                  changesetAuthor={properties.user}
                  discussions={discussions}
                  changesetIsHarmful={properties.harmful}
                  changesetId={changesetId}
                />
              </Box>
            )}
            {bindingsState[CHANGESET_DETAILS_USER.label] && (
              <Box key={0} className="responsive-box round-tr round-br">
                <User
                  userDetails={{
                    uid: properties.uid,
                    name: properties.user,
                    ...userDetails,
                  }}
                  whosThat={whosThat || []}
                  changesetUsername
                />
              </Box>
            )}
            {bindingsState[CHANGESET_DETAILS_MAP.label] && (
              <Box key={4} className="responsive-box round-tr round-br">
                <MapOptions
                  showElements={showElements}
                  showActions={showActions}
                  setShowElements={setShowElements}
                  setShowActions={setShowActions}
                />
              </Box>
            )}
          </Floater>
        </div>
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
