import area from "@turf/area";
import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import simplify from "@turf/simplify";
import truncate from "@turf/truncate";
import debounce from "lodash.debounce";
import maplibre from "maplibre-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import {
  TerraDraw,
  TerraDrawPolygonMode,
  TerraDrawRectangleMode,
  TerraDrawRenderMode,
} from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";

import { nominatimSearch } from "../../network/nominatim";

const LocationSelect = (props) => {
  const { name, value, placeholder, onChange } = props;

  const [queryType, setQueryType] = useState("q");
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeMode, setActiveMode] = useState("render");

  const mapRef = useRef<maplibre.Map | null>(null);
  const drawRef = useRef<TerraDraw | null>(null);

  const queryTypeOptions = [
    { value: "q", label: "Any" },
    { value: "city", label: "City" },
    { value: "county", label: "County" },
    { value: "state", label: "State" },
    { value: "country", label: "Country" },
  ];

  const updateMap = useCallback((data) => {
    const map = mapRef.current;
    if (!map) return;

    // called with geojson polygon of a feature that was retrieved by
    // name from Nominatim
    if (map.getSource("feature")) {
      (map.getSource("feature") as any).setData(data);
    } else {
      map.addSource("feature", { type: "geojson", data });
    }

    if (map.getLayer("geometry") === undefined) {
      map.addLayer({
        id: "geometry",
        type: "fill",
        source: "feature",
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.3,
        },
      });
    }

    const bounds = bbox(data);
    map.fitBounds(
      [
        bounds.slice(0, 2) as [number, number],
        bounds.slice(2, 4) as [number, number],
      ],
      { padding: 20 },
    );
  }, []);

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

    mapRef.current = map;
    drawRef.current = draw;

    map.on("load", () => {
      draw.start();

      draw.on("finish", (id,) => {
        const snapshot = draw.getSnapshot();
        const feature = snapshot.find((f) => f.id === id);

        if (!feature) return;

        if (feature.geometry.type === "Polygon") {
          if (draw.getMode() === "rectangle") {
            const bounds = bbox(feature);
            const wsen = bounds.map((v) => v.toFixed(4)).join(",");
            onChange("geometry", null);
            onChange("in_bbox", [{ label: wsen, value: wsen }]);
          } else {
            onChange("geometry", [
              { label: feature.geometry, value: feature.geometry },
            ]);
            onChange("in_bbox", null);
          }
        }

        // Set mode back to render after completing a shape
        draw.setMode("render");
        setActiveMode("render");
        updateMap(feature.geometry);
      });
    });

    map.on("style.load", () => {
      map.setProjection({ type: "globe" });

      // Display initial bbox or polygon (if it exists) on the map
      if (value && value.length > 0) {
        const { value: geometry } = value[0];
        if (geometry && typeof geometry === "object") {
          // geometry is a GeoJSON polygon
          updateMap(geometry);
        } else if (geometry && typeof geometry === "string") {
          // geometry is a bbox string (WSEN, comma-separated)
          const bounds = geometry.split(",").map(Number);
          updateMap(
            bboxPolygon(bounds as [number, number, number, number]).geometry,
          );
        }
      }
    });

    return () => map?.remove();
  }, []);

  // Check if one character input is allowed (for East Asian languages)
  const isOneCharInputAllowed = useCallback((input) => {
    // Allowing one character input if it contains characters from certain scripts while
    // guarding against browsers that don't support this kind of regular expression
    try {
      return /\p{scx=Han}|\p{scx=Hangul}|\p{scx=Hiragana}|\p{scx=Katakana}/u.test(
        input,
      );
    } catch {
      // Allowing always is better than never allowing for the above-mentioned scripts
      return true;
    }
  }, []);

  // Load options from server
  const loadOptions = useCallback(
    async (inputValue) => {
      setIsLoading(true);

      if (inputValue.length >= 2 || isOneCharInputAllowed(inputValue)) {
        try {
          const json = await nominatimSearch(inputValue, queryType);

          if (!Array.isArray(json)) {
            setIsLoading(false);
            return [];
          }

          const data = json.map((d) => ({
            label: d.display_name,
            value: d.geojson,
          }));

          setIsLoading(false);
          return data;
        } catch (_e) {
          setIsLoading(false);
          return [];
        }
      } else {
        setIsLoading(false);
        return [];
      }
    },
    [queryType, isOneCharInputAllowed],
  );

  const debouncedLoadOptions = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then(callback);
    }, 500),
    [],
  );

  const handleChange = useCallback(
    (selectedOption) => {
      if (selectedOption) {
        const draw = drawRef.current;
        if (draw) {
          draw.clear();
        }

        const tolerance =
          area(selectedOption.value) / 10 ** 6 < 1000 ? 0.01 : 0.1;
        const simplified_geometry = simplify(selectedOption.value, {
          tolerance: tolerance,
          highQuality: true,
        });

        onChange("geometry", [
          { label: simplified_geometry, value: simplified_geometry },
        ]);
        onChange("in_bbox", null);

        updateMap(
          truncate(simplified_geometry, { precision: 6, coordinates: 2 }),
        );
      }
    },
    [updateMap, onChange],
  );

  const handleQueryTypeChange = useCallback((selectedOption) => {
    setQueryType(selectedOption.value);
  }, []);

  const handleInputChange = useCallback((newValue) => {
    setInputValue(newValue);
  }, []);

  const handleModeChange = useCallback((mode) => {
    const draw = drawRef.current;
    if (draw) {
      draw.clear();
      draw.setMode(mode);
      setActiveMode(mode);
    }
  }, []);

  const handleClear = useCallback(() => {
    const draw = drawRef.current;
    const map = mapRef.current;
    if (draw) {
      draw.clear();
      draw.setMode("render");
      setActiveMode("render");
    }
    if (map && map.getSource("feature")) {
      (map.getSource("feature") as any).setData({
        type: "Feature",
        geometry: null,
      });
    }
    onChange("geometry", null);
    onChange("in_bbox", null);
  }, [onChange]);

  return (
    <div>
      <div className="grid grid--gut12">
        <div className="col col--4">
          <Select
            onChange={handleQueryTypeChange}
            options={queryTypeOptions}
            value={queryTypeOptions.find(
              (option) => option.value === queryType,
            )}
            placeholder="Place Type"
          />
        </div>
        <div className="col col--8 pl3">
          <AsyncSelect
            name={name}
            className="react-select"
            loadOptions={debouncedLoadOptions}
            onChange={handleChange}
            onInputChange={handleInputChange}
            inputValue={inputValue}
            isLoading={isLoading}
            placeholder={placeholder}
            cacheOptions={false}
            defaultOptions={false}
          />
        </div>
      </div>
      <div className="grid grid--gut12 pt6">
        <div className="col col--12">
          <div className="flex-parent flex-parent--row flex-parent--center-cross mb6">
            <div className="flex-child flex-child--no-shrink mr6">
              <button
                className={`btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition ${
                  activeMode === "rectangle"
                    ? "bg-darken25 bg-darken25-on-hover"
                    : ""
                }`}
                onClick={() => handleModeChange("rectangle")}
              >
                <svg className="icon h18 w18 inline-block align-middle">
                  <use xlinkHref="#icon-polygon" />
                </svg>
                Box
              </button>
            </div>
            <div className="flex-child flex-child--no-shrink mr6">
              <button
                className={`btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition ${
                  activeMode === "polygon"
                    ? "bg-darken25 bg-darken25-on-hover"
                    : ""
                }`}
                onClick={() => handleModeChange("polygon")}
              >
                <svg className="icon h18 w18 inline-block align-middle">
                  <use xlinkHref="#icon-pencil" />
                </svg>
                Polygon
              </button>
            </div>
            <div className="flex-child flex-child--no-shrink">
              <button
                className="btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
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
          <div id="geometry-map" />
        </div>
      </div>
      <p>
        {activeMode === "rectangle" &&
          "Click two corners to draw a bounding box."}
        {activeMode === "polygon" &&
          "Click a series of points to draw a polygon; click back on the first point to finish."}
      </p>
    </div>
  );
};

export { LocationSelect };
