import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import simplify from "@turf/simplify";
import truncate from "@turf/truncate";
import * as maplibre from "maplibre-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  TerraDraw,
  TerraDrawPolygonMode,
  TerraDrawRectangleMode,
  TerraDrawRenderMode,
} from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";

import { type Area, lookupArea, searchAreas } from "../../network/nominatim.ts";

const EMPTY: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

/**
 * Convert a location filter value (a GeoJSON polygon or a WSEN bbox string)
 * to a GeoJSON geometry, or null if the value is empty.
 */
function toGeometry(value): GeoJSON.Geometry | null {
  const geometry = value?.[0]?.value;
  if (geometry && typeof geometry === "object") return geometry;
  if (geometry && typeof geometry === "string") {
    const bounds = geometry.split(",").map(Number);
    return bboxPolygon(bounds as [number, number, number, number]).geometry;
  }
  return null;
}

function setData(map: maplibre.Map, source: string, data) {
  (map.getSource(source) as maplibre.GeoJSONSource).setData(data ?? EMPTY);
}

function fitTo(map: maplibre.Map, geometry: GeoJSON.Geometry | null) {
  if (!geometry) return;
  const [w, s, e, n] = bbox(geometry);
  map.fitBounds(
    [
      [w, s],
      [e, n],
    ],
    { padding: 40, animate: false },
  );
}

type Ring = GeoJSON.Position[];

function extentOf(ring: Ring) {
  const [w, s, e, n] = bbox({ type: "LineString", coordinates: ring });
  return Math.max(e - w, n - s);
}

const MAX_VERTICES = 300;

/**
 * Simplify an area with a tolerance proportional to its size (`extent`, in
 * degrees). Rings (islands or holes) smaller than the tolerance are dropped.
 * If the result has more than MAX_VERTICES, the tolerance is increased.
 */
function simplifyArea(
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon,
  extent: number,
): GeoJSON.Polygon | GeoJSON.MultiPolygon {
  const polygons =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  const largest = polygons.reduce((a, b) =>
    extentOf(b[0]) > extentOf(a[0]) ? b : a,
  );

  if (!(extent > 0)) throw new Error(`Invalid area extent: ${extent}`);
  for (let tolerance = extent / 1000; ; tolerance *= 1.5) {
    const kept = polygons
      .filter((p) => p === largest || extentOf(p[0]) >= tolerance)
      .map(([outer, ...holes]) => [
        outer,
        ...holes.filter((h) => extentOf(h) >= tolerance),
      ]);
    const result = simplify(
      kept.length === 1
        ? { type: "Polygon", coordinates: kept[0] }
        : { type: "MultiPolygon", coordinates: kept },
      { tolerance, highQuality: true },
    ) as GeoJSON.Polygon | GeoJSON.MultiPolygon;

    const vertices = result.coordinates.flat(result.type === "Polygon" ? 1 : 2);
    if (vertices.length <= MAX_VERTICES) {
      // Enough decimal places to be accurate to a tenth of the tolerance
      const precision = Math.min(6, Math.ceil(1 - Math.log10(tolerance)));
      return truncate(result, { precision, coordinates: 2 });
    }
  }
}

function buttonClass(active = false) {
  return `btn btn--s round color-gray border border--1 border--gray-light border--gray-on-hover transition ${active ? "bg-gray-faint" : "bg-white"}`;
}

const LocationSelect = (props) => {
  const { name, value, sizeBound, placeholder, onChange } = props;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Area[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("render");
  const [factor, setFactor] = useState(sizeBound?.[0]?.value ?? "10");

  const mapRef = useRef<maplibre.Map | null>(null);
  const drawRef = useRef<TerraDraw | null>(null);

  // onChange is not stable across renders, but the map should only be created
  // once, so the map's event handlers access it through a ref.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    const map = new maplibre.Map({
      container: "geometry-map",
      style: "/positron.json",
    });

    map.setMaxPitch(0);
    map.dragRotate.disable();
    map.boxZoom.disable();
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();

    const draw = new TerraDraw({
      adapter: new TerraDrawMapLibreGLAdapter({ map }),
      modes: [
        new TerraDrawRectangleMode(),
        new TerraDrawPolygonMode(),
        new TerraDrawRenderMode({ modeName: "render", styles: {} }),
      ],
    });

    map.on("mousedown", () => {
      setResults(null);
      setError(null);
    });

    map.on("load", () => {
      draw.start();

      draw.on("finish", (id) => {
        const snapshot = draw.getSnapshot();
        const feature = snapshot.find((f) => f.id === id);

        if (!feature) return;

        const onChange = onChangeRef.current;
        if (feature.geometry.type === "Polygon") {
          if (draw.getMode() === "rectangle") {
            const bounds = bbox(feature);
            const wsen = bounds.map((v) => v.toFixed(4)).join(",");
            onChange("geometry", null);
            onChange("in_bbox", [{ label: wsen, value: wsen }]);
          } else {
            const geometry = truncate(feature.geometry, {
              precision: 6,
              coordinates: 2,
            });
            onChange("geometry", [{ label: geometry, value: geometry }]);
            onChange("in_bbox", null);
          }
        }

        draw.setMode("render");
        setActiveMode("render");
      });
    });

    map.on("style.load", () => {
      map.setProjection({ type: "globe" });
      map.addSource("feature", { type: "geojson", data: EMPTY });
      map.addLayer({
        id: "geometry",
        type: "fill",
        source: "feature",
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.3,
        },
      });
      const geometry = toGeometry(valueRef.current);
      setData(map, "feature", geometry);
      fitTo(map, geometry);
    });

    mapRef.current = map;
    drawRef.current = draw;

    return () => {
      if (draw.enabled) draw.stop();
      map.remove();
      mapRef.current = null;
      drawRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map?.getSource("feature")) fitTo(map, toGeometry(value));

    const draw = drawRef.current;
    if (!value?.length && draw?.enabled) draw.clear();
  }, [value]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getSource("feature")) return;
    setData(map, "feature", activeMode === "render" ? toGeometry(value) : null);
  }, [value, activeMode]);

  useEffect(() => {
    if (sizeBound?.length) setFactor(sizeBound[0].value);
  }, [sizeBound]);

  const closeResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  const selectArea = useCallback(
    async (selected: Area) => {
      setIsLoading(true);
      setError(null);
      let geometry: GeoJSON.Geometry;
      try {
        const outline = await lookupArea(selected, selected.extent / 2000);
        geometry = simplifyArea(outline, selected.extent);
      } catch (e) {
        setError((e as Error).message);
        return;
      } finally {
        setIsLoading(false);
      }

      const draw = drawRef.current;
      if (draw?.enabled) {
        draw.clear();
        draw.setMode("render");
      }
      setActiveMode("render");
      onChange("geometry", [{ label: geometry, value: geometry }]);
      onChange("in_bbox", null);
      setQuery("");
      closeResults();
    },
    [onChange, closeResults],
  );

  const handleSearch = useCallback(
    async (event) => {
      event.preventDefault();
      const input = query.trim();
      if (!input) return;

      setIsLoading(true);
      closeResults();
      try {
        const areas = await searchAreas(input);
        if (areas.length === 1) {
          await selectArea(areas[0]);
        } else {
          setResults(areas);
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    },
    [query, selectArea, closeResults],
  );

  const handleModeChange = useCallback(
    (mode) => {
      const draw = drawRef.current;
      if (!draw?.enabled) return;
      const next = activeMode === mode ? "render" : mode;
      draw.clear();
      draw.setMode(next);
      setActiveMode(next);
      closeResults();
    },
    [activeMode, closeResults],
  );

  const handleClear = useCallback(() => {
    const draw = drawRef.current;
    if (draw?.enabled) {
      draw.clear();
      draw.setMode("render");
    }
    setActiveMode("render");
    closeResults();
    onChange("geometry", null);
    onChange("in_bbox", null);
    onChange("area_lt", null);
  }, [onChange, closeResults]);

  const handleFactorChange = useCallback(
    (event) => {
      const input = event.target.value;
      setFactor(input);
      if (sizeBound?.length && Number(input) >= 1) {
        onChange("area_lt", [{ label: input, value: input }]);
      }
    },
    [sizeBound, onChange],
  );

  const handleSizeBoundToggle = useCallback(
    (event) => {
      if (event.target.checked && Number(factor) >= 1) {
        onChange("area_lt", [{ label: factor, value: factor }]);
      } else {
        onChange("area_lt", null);
      }
    },
    [factor, onChange],
  );

  const hasArea = !!value?.length;

  return (
    <div>
      <div className="location-map relative">
        <div id="geometry-map" />
        <div
          className="absolute z1 flex-parent flex-parent--wrap flex-parent--start-cross"
          style={{ top: 10, left: 10, right: 10, pointerEvents: "none" }}
        >
          <form
            className="relative flex-parent mr6 mb6 w240"
            style={{ pointerEvents: "auto" }}
            onSubmit={handleSearch}
            onKeyDown={(e) => e.key === "Escape" && closeResults()}
          >
            <input
              name={name}
              aria-label="Search for a place"
              className="input input--s bg-white flex-child flex-child--grow"
              autoComplete="off"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                closeResults();
              }}
              placeholder={placeholder}
            />
            <button
              type="submit"
              className={`${buttonClass()} ml3 flex-child--no-shrink`}
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? "..." : "Search"}
            </button>
            {(results || error) && (
              <div
                className="absolute bg-white round shadow-darken25 w-full mt3"
                style={{ top: "100%", left: 0 }}
              >
                {error && (
                  <p role="alert" className="px12 py6 color-red">
                    {error}
                  </p>
                )}
                {results?.length === 0 && (
                  <p className="px12 py6 color-gray">
                    No matching cities, counties, states, or countries.
                  </p>
                )}
                {!!results?.length && (
                  <ul className="scroll-auto hmax240">
                    {results.map((r) => (
                      <li key={r.osmId}>
                        <button
                          type="button"
                          className="block w-full align-l px12 py6 txt-s bg-darken5-on-hover"
                          onClick={() => selectArea(r)}
                        >
                          {r.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="px12 py3 txt-xs color-gray border-t border--gray-faint">
                  Search provided by{" "}
                  <a
                    className="link"
                    href="https://nominatim.org/"
                    target="_blank"
                    rel="noopener"
                  >
                    Nominatim
                  </a>
                </div>
              </div>
            )}
          </form>
          <div className="flex-parent mb6" style={{ pointerEvents: "auto" }}>
            <button
              type="button"
              className={`${buttonClass(activeMode === "rectangle")} mr3`}
              aria-pressed={activeMode === "rectangle"}
              onClick={() => handleModeChange("rectangle")}
            >
              <svg className="icon h18 w18 inline-block align-middle">
                <use xlinkHref="#icon-polygon" />
              </svg>
              Box
            </button>
            <button
              type="button"
              className={`${buttonClass(activeMode === "polygon")} mr3`}
              aria-pressed={activeMode === "polygon"}
              onClick={() => handleModeChange("polygon")}
            >
              <svg className="icon h18 w18 inline-block align-middle">
                <use xlinkHref="#icon-pencil" />
              </svg>
              Polygon
            </button>
            <button
              type="button"
              className={buttonClass()}
              onClick={handleClear}
              title="Clear selection"
            >
              <svg className="icon h18 w18 inline-block align-middle">
                <use xlinkHref="#icon-close" />
              </svg>
              Clear
            </button>
          </div>
        </div>
        {activeMode !== "render" && (
          <div
            role="status"
            className="absolute z1 bg-white round shadow-darken10 px12 py6 txt-s"
            style={{ bottom: 30, left: 10, right: 10, pointerEvents: "none" }}
          >
            {activeMode === "rectangle"
              ? "Click two corners to draw a box."
              : "Click a series of points to draw a polygon; click back on the first point to finish."}{" "}
            Click {activeMode === "rectangle" ? "Box" : "Polygon"} again to
            cancel.
          </div>
        )}
      </div>
      <div
        className={`flex-parent flex-parent--center-cross flex-parent--wrap mt12 ${hasArea ? "" : "color-gray"}`}
      >
        <label className="flex-parent flex-parent--center-cross">
          <input
            type="checkbox"
            className="mr6"
            checked={!!sizeBound?.length}
            disabled={!hasArea && !sizeBound?.length}
            onChange={handleSizeBoundToggle}
          />
          Exclude changesets larger than
        </label>
        <input
          type="number"
          aria-label="Size bound"
          className="input input--s w60 mx6"
          min="1"
          step="any"
          value={factor}
          disabled={!hasArea}
          onChange={handleFactorChange}
        />
        times this area
      </div>
      <p className="txt-s color-gray mt3">
        {hasArea
          ? "Useful for hiding changesets with huge continent-spanning bounding boxes, which mappers sometimes create by accident."
          : "Select an area to enable this option."}
      </p>
    </div>
  );
};

export { LocationSelect };
