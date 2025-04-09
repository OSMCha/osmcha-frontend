// @flow
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fromJS } from 'immutable';
import debounce from 'lodash.debounce';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

import maplibre from 'maplibre-gl';
import {
  TerraDraw,
  TerraDrawRectangleMode,
  TerraDrawRenderMode
} from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
import area from '@turf/area';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import simplify from '@turf/simplify';
import truncate from '@turf/truncate';

import { nominatimSearch } from '../../network/nominatim';

const LocationSelect = props => {
  const { name, value, placeholder, onChange } = props;

  // State
  const [queryType, setQueryType] = useState('q');
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Refs
  const mapRef = useRef(null);
  const drawRef = useRef(null);

  // Query type options
  const queryTypeOptions = [
    { value: 'q', label: 'Any' },
    { value: 'city', label: 'City' },
    { value: 'county', label: 'County' },
    { value: 'state', label: 'State' },
    { value: 'country', label: 'Country' }
  ];

  // Update map with new data
  const updateMap = useCallback(
    data => {
      const map = mapRef.current;
      if (!map) return;

      // called with geojson polygon of a feature that was retrieved by
      // name from Nominatim
      if (map.getSource('feature')) {
        map.getSource('feature').setData(data);
      } else {
        map.addSource('feature', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: data
          }
        });
      }

      if (map.getLayer('geometry') === undefined) {
        map.addLayer({
          id: 'geometry',
          type: 'fill',
          source: 'feature',
          paint: {
            'fill-color': '#088',
            'fill-opacity': 0.6
          }
        });
      }

      onChange('in_bbox', undefined);
      onChange('geometry', fromJS([{ label: data, value: data }]));

      const bounds = bbox(data);
      map.fitBounds([bounds.slice(0, 2), bounds.slice(2)], { padding: 20 });
    },
    [onChange]
  );

  // Initialize map and draw
  useEffect(() => {
    // Create map
    const map = new maplibre.Map({
      container: 'geometry-map',
      style: '/positron.json'
    });

    map.setMaxPitch(0);
    map.dragRotate.disable();
    map.boxZoom.disable();
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();

    // Create draw
    const draw = new TerraDraw({
      adapter: new TerraDrawMapLibreGLAdapter({ map, lib: maplibre }),
      modes: [
        new TerraDrawRectangleMode(),
        new TerraDrawRenderMode({ modeName: 'render' })
      ]
    });

    draw.start();

    draw.on('finish', (id, context) => {
      const snapshot = draw.getSnapshot();
      const feature = snapshot.find(f => f.id === id);
      const bounds = bbox(feature); // even though the user drew a box, 'feature' is a Polygon
      const wsen = bounds.map(v => v.toFixed(4)).join(',');

      onChange('geometry', undefined);
      onChange('in_bbox', fromJS([{ label: wsen, value: wsen }]));
    });

    // Store refs
    mapRef.current = map;
    drawRef.current = draw;

    // Set up event listeners
    const handleKeyDown = event => {
      if (event.key === 'Shift') {
        draw.clear();
        map.getSource('feature')?.setData({
          type: 'Feature',
          geometry: null
        });
        draw.setMode('rectangle');
      }
    };

    const handleKeyUp = event => {
      if (event.key === 'Shift') {
        draw.setMode('render');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    map.on('style.load', () => {
      map.setProjection({ type: 'globe' });

      // Display initial bbox or polygon (if it exists) on the map
      if (value && value.size > 0) {
        const { value: geometry } = value.get(0).toJS();
        console.log('geometry', geometry);
        if (geometry && typeof geometry === 'object') {
          // geometry is a GeoJSON polygon
          updateMap(geometry);
        } else if (geometry && typeof geometry === 'string') {
          // geometry is a bbox string (WSEN, comma-separated)
          const bounds = geometry.split(',').map(Number);
          console.log('bounds', bounds);
          console.log('bboxPolygon', bboxPolygon(bounds));
          updateMap(bboxPolygon(bounds).geometry);
        }
      }
    });

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);

      if (map) {
        map.remove();
      }
    };
  }, [onChange, updateMap]);

  // Check if one character input is allowed (for East Asian languages)
  const isOneCharInputAllowed = useCallback(input => {
    // Allowing one character input if it contains characters from certain scripts while
    // guarding against browsers that don't support this kind of regular expression
    try {
      return /\p{scx=Han}|\p{scx=Hangul}|\p{scx=Hiragana}|\p{scx=Katakana}/u.test(
        input
      );
    } catch {
      // Allowing always is better than never allowing for the above-mentioned scripts
      return true;
    }
  }, []);

  // Load options from server
  const loadOptions = useCallback(
    async inputValue => {
      setIsLoading(true);

      if (inputValue.length >= 2 || isOneCharInputAllowed(inputValue)) {
        try {
          const json = await nominatimSearch(inputValue, queryType);

          if (!Array.isArray(json)) {
            setIsLoading(false);
            return [];
          }

          const data = json.map(d => ({
            label: d.display_name,
            value: d.geojson
          }));

          setIsLoading(false);
          return data;
        } catch (e) {
          setIsLoading(false);
          return [];
        }
      } else {
        setIsLoading(false);
        return [];
      }
    },
    [queryType, isOneCharInputAllowed]
  );

  // Create debounced version of loadOptions
  const debouncedLoadOptions = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then(callback);
    }, 500),
    [loadOptions]
  );

  // Handle selection change
  const handleChange = useCallback(
    selectedOption => {
      if (selectedOption) {
        const draw = drawRef.current;
        if (draw) {
          draw.clear();
        }

        const tolerance =
          area(selectedOption.value) / 10 ** 6 < 1000 ? 0.01 : 0.1;
        const simplified_bounds = simplify(selectedOption.value, {
          tolerance: tolerance,
          highQuality: true
        });

        updateMap(
          truncate(simplified_bounds, { precision: 6, coordinates: 2 })
        );
      }
    },
    [updateMap]
  );

  // Handle query type change
  const handleQueryTypeChange = useCallback(selectedOption => {
    setQueryType(selectedOption.value);
  }, []);

  // Handle input change
  const handleInputChange = useCallback(newValue => {
    setInputValue(newValue);
  }, []);

  return (
    <div>
      <div className="grid grid--gut12">
        <div className="col col--4">
          <Select
            onChange={handleQueryTypeChange}
            options={queryTypeOptions}
            value={queryTypeOptions.find(option => option.value === queryType)}
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
            minimumInput={2}
          />
        </div>
      </div>
      <div className="grid grid--gut12 pt6">
        <div className="col col--12 map-select">
          <div id="geometry-map" />
        </div>
      </div>
      <p>
        Hold <kbd>Shift</kbd> and click to draw a bounding box.
      </p>
    </div>
  );
};

export { LocationSelect };
