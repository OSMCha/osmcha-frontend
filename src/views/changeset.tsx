import React from 'react';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import Mousetrap from 'mousetrap';
import * as maplibre from 'maplibre-gl';
import { MapLibreAugmentedDiffViewer } from '@osmcha/maplibre-adiff-viewer';

import { Changeset as ChangesetOverlay } from '../components/changeset';
import { CMap } from '../views/map';
import { NavbarChangeset } from '../views/navbar_changeset';

import { dispatchEvent } from '../utils/dispatch_event';

import { applyFilters } from '../store/filters_actions';
import { FILTER_BY_USER } from '../config/bindings';
import type { RootStateType } from '../store';

/**
 * This is the main component for the changeset view.
 * It displays the changeset details and the map.
 */
interface ChangesetProps {
  errorChangeset: any | undefined | null;
  location: any;
  loading: boolean;
  currentChangeset?: Map<string, any>;
  changesetId: number;
  token: string;
  applyFilters: (a: Map<string, any>) => unknown;
}

interface ChangesetState {
  camera: any;
  selected: any;
  showElements: Array<string>;
  showActions: Array<string>;
  basemapStyle: string;
}

class _Changeset extends React.PureComponent<ChangesetProps, ChangesetState> {
  state: ChangesetState = {
    // map camera parameters, updated when the map moves, and used to construct
    // external editor urls. either null or { center: [lng, lat], zoom: number }.
    camera: null,
    // the currently selected element on the map; either null or an 'action' object
    // from @osmcha/maplibre-adiff-viewer ({ type, old, new })
    selected: null,
    // map configuration state (set in the map options panel and used in the CMap view)
    showElements: ['node', 'way', 'relation'],
    showActions: ['create', 'modify', 'delete', 'noop'],
    basemapStyle: 'bing',
  };

  // This ref is passed to CMap, which updates it with references to the MapLibre map
  // and AdiffViewer instance. Other components can use this ref to imperatively update
  // the map state.
  mapRef: React.MutableRefObject<{
    map: maplibre.Map;
    adiffViewer: MapLibreAugmentedDiffViewer;
  } | null> = React.createRef() as any;

  componentDidMount() {
    Mousetrap.bind(FILTER_BY_USER.bindings, this.filterChangesetsByUser);
  }

  componentDidUpdate(prevProps: any) {
    if (
      this.props.token !== prevProps.token ||
      this.props.changesetId !== prevProps.changesetId
    ) {
      // reset selected element and filter choices when switching between changesets
      this.setState({
        selected: null,
        showElements: ['node', 'way', 'relation'],
        showActions: ['create', 'modify', 'delete', 'noop'],
      });
    }
  }

  componentWillUnmount() {
    FILTER_BY_USER.bindings.forEach((k) => Mousetrap.unbind(k));
  }

  filterChangesetsByUser = () => {
    if (this.props.currentChangeset) {
      const userName = this.props.currentChangeset.getIn([
        'properties',
        'user',
      ]);
      this.props.applyFilters(
        Map<string, any>().set(
          'users',
          fromJS([
            {
              label: userName,
              value: userName,
            },
          ])
        )
      );
    }
  };

  showChangeset = () => {
    const { loading, errorChangeset, currentChangeset, changesetId, token } =
      this.props;

    if (loading || !currentChangeset) {
      return null;
    }

    if (errorChangeset) {
      dispatchEvent('showToast', {
        title: `changeset:${changesetId} failed to load`,
        content: 'Try reloading osmcha',
        timeOut: 5000,
        type: 'error',
      });
      console.error(errorChangeset);
      return null;
    }
    return (
      <ChangesetOverlay
        changesetId={changesetId}
        currentChangeset={currentChangeset}
        token={token}
        showElements={this.state.showElements}
        showActions={this.state.showActions}
        setShowElements={(showElements) => this.setState({ showElements })}
        setShowActions={(showActions) => this.setState({ showActions })}
        mapRef={this.mapRef}
        selected={this.state.selected}
        setSelected={(selected) => this.setState({ selected })}
      />
    );
  };

  render() {
    return (
      <div className="flex-parent flex-parent--column h-full">
        <NavbarChangeset camera={this.state.camera} />
        <div className="flex-child flex-child--grow relative">
          <CMap
            mapRef={this.mapRef}
            className="z0 fixed bottom right"
            showElements={this.state.showElements}
            showActions={this.state.showActions}
            setSelected={(selected) => this.setState({ selected })}
            setCamera={(camera) => this.setState({ camera })}
          />

          {this.showChangeset()}
        </div>
      </div>
    );
  }
}

const Changeset = connect(
  (state: RootStateType, props) => ({
    changeset: state.changeset,
    location: props.location,
    changesetId: parseInt(props.match.params.id, 10),
    currentChangeset: state.changeset.getIn([
      'changesets',
      parseInt(props.match.params.id, 10),
    ]),
    errorChangeset: state.changeset.get('errorChangeset'),
    loading: state.changeset.get('loading'),
    token: state.auth.get('token'),
  }),
  { applyFilters }
)(_Changeset);

export { Changeset };
