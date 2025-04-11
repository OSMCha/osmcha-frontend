import React from 'react';
import { connect } from 'react-redux';
import maplibre from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapLibreAugmentedDiffViewer } from '@osmcha/maplibre-adiff-viewer';

import { Loading } from '../components/loading';
import { SignIn } from '../components/sign_in';
import { updateStyle } from '../store/map_controls_actions';
import { modal } from '../store/modal_actions';
import type { RootStateType } from '../store';

const BING_AERIAL_IMAGERY_STYLE = {
  version: 8,
  sources: {
    bing: {
      type: 'raster',
      tiles: [
        'https://ecn.t0.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z',
        'https://ecn.t1.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z',
        'https://ecn.t2.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z',
        'https://ecn.t3.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z'
      ],
      tileSize: 256,
      maxzoom: 20,
      attribution: 'Imagery © Microsoft Corporation'
    }
  },
  layers: [
    {
      id: 'imagery',
      type: 'raster',
      source: 'bing'
    }
  ]
};

const OPENSTREETMAP_CARTO_STYLE = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

class CMap extends React.PureComponent {
  props: {
    changesetId: number,
    className: string,
    style: string,
    showElements: Array<string>,
    showActions: Array<string>,
    mapRef: React.RefObject<{
      map: maplibre.Map,
      adiffViewer: MapLibreAugmentedDiffViewer
    }>,
    setSelected: (action: Object) => void,
    setCamera: (camera: Object) => void
  };

  state = {
    loading: true
  };

  map = null;

  componentDidMount() {
    this.initializeMap();
  }

  componentWillUnmount() {
    if (this.props.mapRef) {
      this.props.mapRef.current = null;
    }
  }

  componentDidUpdate(prevProps: Object) {
    if (
      this.props.token !== prevProps.token ||
      this.props.changesetId !== prevProps.changesetId ||
      !prevProps.changeset
    ) {
      this.setState({ loading: true });
      this.initializeMap();
    } else if (
      this.props.style !== prevProps.style ||
      this.props.showElements !== prevProps.showElements ||
      this.props.showActions !== prevProps.showActions
    ) {
      this.updateMap();
    }
  }

  initializeMap() {
    if (!this.props.changeset) {
      return;
    }

    let container = document.getElementById('container');

    if (this.map) {
      this.map.remove();
    }

    let style = BING_AERIAL_IMAGERY_STYLE;

    if (this.props.style === 'carto') {
      style = OPENSTREETMAP_CARTO_STYLE;
    }

    let map = new maplibre.Map({
      container,
      style,
      maxZoom: 22,
      hash: false,
      attributionControl: false // we're moving this to the other corner
    });

    map.addControl(new maplibre.AttributionControl(), 'bottom-left');

    map.setMaxPitch(0);
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();

    let { adiff } = this.props.changeset;
    // HACK: override attribution string (the string Overpass sends is wordier and doesn't have a hyperlink)
    adiff.note =
      'Map data from <a href=https://openstreetmap.org/copyright>OpenStreetMap</a>';
    const adiffViewer = new MapLibreAugmentedDiffViewer(adiff, {
      onClick: this.handleClick,
      showElements: this.props.showElements,
      showActions: this.props.showActions
    });

    map.on('load', async () => {
      this.setState({ loading: false });
      adiffViewer.addTo(map);

      if (adiff.actions.length > 0) {
        map.jumpTo(
          map.cameraForBounds(adiffViewer.bounds(), {
            padding: 200,
            maxZoom: 18
          })
        );
      } else {
        this.props.modal({
          kind: 'error',
          title: 'Problem loading augmented diff file',
          description: 'The augmented diff contains no elements'
        });
      }
    });

    map.on('moveend', () => {
      this.props.setCamera({
        center: map.getCenter(),
        zoom: map.getZoom()
      });
    });

    this.map = map;
    this.adiffViewer = adiffViewer;

    // Store the map and adiffViewer in the ref passed from the parent component
    // (this allows other components to imperatively update the map state)
    if (this.props.mapRef) {
      this.props.mapRef.current = {
        map: this.map,
        adiffViewer: this.adiffViewer
      };
    }
  }

  updateMap() {
    if (this.state.loading || !this.map || !this.adiffViewer) return;

    let style = BING_AERIAL_IMAGERY_STYLE;

    if (this.props.style === 'carto') {
      style = OPENSTREETMAP_CARTO_STYLE;
    }

    this.map.setStyle(style);

    this.adiffViewer.options = {
      onClick: this.handleClick,
      showElements: this.props.showElements,
      showActions: this.props.showActions
    };

    this.adiffViewer.refresh();
  }

  handleClick = (event, action) => {
    // Update the selected action in the parent component
    // (so we can render it in the element info panel)
    this.props.setSelected(action);

    // Update the selection state on the map
    // (highlighting/unhighlighting the geometry of the selected element)
    if (action) {
      let element = action.new ?? action.old;
      this.adiffViewer.select(element.type, element.id);
    } else {
      this.adiffViewer.deselect();
    }
  };

  setHighlight = (type, id, highlighted) => {
    this.adiffViewer.setHighlight(type, id, highlighted);
  };

  render() {
    if (this.props.token) {
      return (
        <React.Fragment>
          <div id="container" className="w-full h-full" />
          {this.state.loading && (
            <div
              className="absolute z0"
              style={{
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: 'rgba(0, 0, 0, 0.5)'
              }}
            >
              <Loading height="100%" />
            </div>
          )}
        </React.Fragment>
      );
    } else {
      return <SignIn />;
    }
  }
}

CMap = connect(
  (state: RootStateType, props) => ({
    changesetId: state.changeset.get('changesetId'),
    changeset: state.changeset.getIn([
      'changesetMap',
      state.changeset.get('changesetId')
    ]),
    style: state.mapControls.get('style'),
    token: state.auth.get('token')
  }),
  { updateStyle, modal }
)(CMap);

export { CMap };
