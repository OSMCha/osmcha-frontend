import { MapLibreAugmentedDiffViewer } from "@osmcha/maplibre-adiff-viewer";
import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loading } from "../components/loading.tsx";
import { SignIn } from "../components/sign_in.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { useChangesetMap } from "../query/hooks/useChangesetMap.ts";
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

    const map = new maplibre.Map({
      container,
      style: DEFAULT_BASEMAP_STYLE,
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

  return (
    <React.Fragment>
      <div id="container" className="w-full h-full" />
      {(loading || changesetQuery.isLoading) && (
        <div
          className="absolute z0"
          style={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Loading height="100%" className="" />
        </div>
      )}
    </React.Fragment>
  );
}

export { CMap };
