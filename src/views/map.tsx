import { MapLibreAugmentedDiffViewer } from "@osmcha/maplibre-adiff-viewer";
import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loading } from "../components/loading.tsx";
import { SignIn } from "../components/sign_in.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { AdiffNotFoundError } from "../network/changeset.ts";
import {
  useChangesetMap,
  useChangesetMapFromOverpass,
} from "../query/hooks/useChangesetMap.ts";
import { useMapStore } from "../stores/mapStore.ts";

const BING_AERIAL_IMAGERY_STYLE: maplibre.StyleSpecification = {
  version: 8,
  sources: {
    bing: {
      type: "raster",
      scheme: "xyz",
      tiles: [
        "https://ecn.t0.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z",
        "https://ecn.t1.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z",
        "https://ecn.t2.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z",
        "https://ecn.t3.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z",
      ],
      tileSize: 256,
      maxzoom: 20,
      attribution: "Imagery © Microsoft Corporation",
    },
  },
  layers: [
    {
      id: "imagery",
      type: "raster",
      source: "bing",
    },
  ],
};

const ESRI_WORLD_IMAGERY_STYLE: maplibre.StyleSpecification = {
  version: 8,
  sources: {
    esri: {
      type: "raster",
      scheme: "xyz",
      tiles: [
        "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?blankTile=false",
        "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?blankTile=false",
      ],
      tileSize: 256,
      maxzoom: 20,
      attribution: "Imagery © Esri",
    },
  },
  layers: [
    {
      id: "imagery",
      type: "raster",
      source: "esri",
    },
  ],
};

const ESRI_WORLD_IMAGERY_CLARITY_STYLE: maplibre.StyleSpecification = {
  version: 8,
  sources: {
    esri: {
      type: "raster",
      scheme: "xyz",
      tiles: [
        "https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?blankTile=false",
      ],
      tileSize: 256,
      maxzoom: 20,
      attribution: "Imagery © Esri",
    },
  },
  layers: [
    {
      id: "imagery",
      type: "raster",
      source: "esri",
    },
  ],
};

const OPENSTREETMAP_CARTO_STYLE: maplibre.StyleSpecification = {
  version: 8,
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

const BASEMAP_STYLES = {
  bing: BING_AERIAL_IMAGERY_STYLE,
  esri: ESRI_WORLD_IMAGERY_STYLE,
  "esri-clarity": ESRI_WORLD_IMAGERY_CLARITY_STYLE,
  carto: OPENSTREETMAP_CARTO_STYLE,
};

const DEFAULT_BASEMAP_STYLE = BING_AERIAL_IMAGERY_STYLE;

interface CMapProps {
  changesetId: number | null;
  className: string;
  showElements: Array<string>;
  showActions: Array<string>;
  mapRef: React.MutableRefObject<{
    map: maplibre.Map;
    adiffViewer: MapLibreAugmentedDiffViewer;
  } | null>;
  setSelected: (action: any) => void;
  setCamera: (camera: any) => void;
}

function CMap(props: CMapProps) {
  const { token } = useAuth();
  const style = useMapStore((state) => state.style);
  const changesetQuery = useChangesetMap(props.changesetId);
  const overpass = useChangesetMapFromOverpass();
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<maplibre.Map | null>(null);
  const adiffViewerRef = useRef<MapLibreAugmentedDiffViewer | null>(null);

  const changeset = changesetQuery.data;

  const handleClick = useCallback(
    (event: any, action: any) => {
      props.setSelected(action);

      if (action) {
        const element = action.new ?? action.old;
        adiffViewerRef.current?.select(element.type, element.id);
      } else {
        adiffViewerRef.current?.deselect();
      }
    },
    [props.setSelected],
  );

  // Initialize map when changeset data is loaded.
  // Only recreate the map when token or changeset changes.
  useEffect(() => {
    if (!token || !changeset) {
      return;
    }

    const container = document.getElementById("container");
    if (!container) {
      return;
    }

    // Clean up previous map if it exists
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      adiffViewerRef.current = null;
    }

    setLoading(true);

    props.setSelected(null);

    const currentStyleId = useMapStore.getState().style;
    const style = BASEMAP_STYLES[currentStyleId] ?? DEFAULT_BASEMAP_STYLE;

    const map = new maplibre.Map({
      container,
      style,
      maxZoom: 22,
      hash: false,
      attributionControl: false,
    });

    map.addControl(new maplibre.AttributionControl(), "bottom-left");

    map.setMaxPitch(0);
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();

    const { adiff } = changeset;
    adiff.note =
      "Map data from <a href=https://openstreetmap.org/copyright>OpenStreetMap</a>";
    const adiffViewer = new MapLibreAugmentedDiffViewer(adiff, {
      onClick: handleClick,
    });

    map.on("load", async () => {
      setLoading(false);
      adiffViewer.addTo(map);

      if (adiff.actions.length > 0) {
        const camera = map.cameraForBounds(adiffViewer.bounds(), {
          padding: 200,
          maxZoom: 18,
        });
        if (camera) {
          map.jumpTo(camera);
        }
      } else {
        toast.error("Problem loading augmented diff file", {
          description: "The augmented diff contains no elements",
        });
      }
    });

    map.on("moveend", () => {
      props.setCamera({
        center: map.getCenter(),
        zoom: map.getZoom(),
      });
    });

    mapRef.current = map;
    adiffViewerRef.current = adiffViewer;

    if (props.mapRef) {
      props.mapRef.current = {
        map: map,
        adiffViewer: adiffViewer,
      };
    }

    return () => {
      if (props.mapRef) {
        props.mapRef.current = null;
      }
    };
  }, [
    token,
    changeset,
    handleClick,
    props.setCamera,
    props.setSelected,
    props.mapRef,
  ]);

  // Remove the previous changeset's map if this one fails to load, so it isn't
  // left visible behind the error message.
  useEffect(() => {
    if (!changesetQuery.isError || !mapRef.current) return;

    mapRef.current.remove();
    mapRef.current = null;
    adiffViewerRef.current = null;
    if (props.mapRef) {
      props.mapRef.current = null;
    }
  }, [changesetQuery.isError, props.mapRef]);

  // Update map when style or filter options change (including initial setup)
  useEffect(() => {
    if (!mapRef.current || !adiffViewerRef.current) return;

    const basemapStyle = BASEMAP_STYLES[style] ?? DEFAULT_BASEMAP_STYLE;
    mapRef.current.setStyle(basemapStyle);

    adiffViewerRef.current.options = {
      onClick: handleClick,
      showElements: props.showElements,
      showActions: props.showActions,
    };

    adiffViewerRef.current.refresh();
  }, [style, props.showElements, props.showActions, handleClick]);

  if (!token) {
    return <SignIn />;
  }

  // The mutation isn't keyed by changeset, so ignore its state if it was for a
  // different changeset than the one currently displayed.
  const isCurrent = overpass.variables === props.changesetId;
  const overpassPending = isCurrent && overpass.isPending;
  const overpassError = isCurrent ? overpass.error : null;
  const error = overpassError ?? changesetQuery.error;
  const busy = overpassPending || changesetQuery.isFetching;

  let overlay: React.ReactNode = null;
  if (error instanceof AdiffNotFoundError) {
    overlay = (
      <Overlay z="z2">
        <div className="bg-white round px18 py12 mx12 wmax600 prose">
          <div className="txt-l txt-bold pb12">
            Failed to load changeset map
          </div>
          <p>OSMCha could not find an augmented diff for this changeset.</p>
          <p>
            If the changeset is very recent, it may still be processing; try
            again in a few minutes. If it's older, it may not have been
            processed correctly, or may predate OSMCha's diff archive.
          </p>
          <p>
            You can try again, or try loading the data from the Overpass API
            instead.
          </p>
          <div className="flex-parent flex-parent--wrap">
            <button
              type="button"
              className="btn btn--s round mr6 mb6"
              disabled={busy}
              onClick={() => changesetQuery.refetch()}
            >
              {changesetQuery.isFetching ? "Trying again..." : "Try again"}
            </button>
            <button
              type="button"
              className="btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition mb6"
              disabled={busy}
              onClick={() =>
                props.changesetId && overpass.mutate(props.changesetId)
              }
            >
              {overpassPending
                ? "Loading from Overpass..."
                : "Load from Overpass"}
            </button>
          </div>
        </div>
      </Overlay>
    );
  } else if (error) {
    overlay = (
      <Overlay z="z2">
        <div className="bg-white round px18 py12 align-center">
          <div className="txt-bold txt-l pb6">Failed to load changeset map</div>
          <div>{error.message}</div>
        </div>
      </Overlay>
    );
  } else if (loading || changesetQuery.isLoading) {
    overlay = (
      <Overlay>
        <Loading height="100%" className="" />
      </Overlay>
    );
  }

  return (
    <React.Fragment>
      <div id="container" className="w-full h-full" />
      {overlay}
    </React.Fragment>
  );
}

/// A dimmed overlay covering the map
function Overlay({
  z = "z0",
  children,
}: {
  z?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute ${z} flex-parent flex-parent--column flex-parent--center-cross flex-parent--center-main`}
      style={{
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: "rgba(0, 0, 0, 0.5)",
      }}
    >
      {children}
    </div>
  );
}

export { CMap };
