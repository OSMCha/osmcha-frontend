// @flow
import { Map, List, fromJS } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';

import { cancelablePromise } from '../../utils/promise';
import { Floater } from './floater';
import { Header } from './header';
import { User } from './user';
import { Features } from './features';
import { TagChanges } from './tag_changes';
import { OtherFeatures } from './other_features';
import { GeometryChanges } from './geometry_changes';
import { Box } from './box';
import { Discussions } from './discussions';
import { MapOptions } from './map_options';
import { ControlLayout } from './control_layout';
import { keyboardToggleEnhancer } from '../keyboard_enhancer';
import { withFetchDataSilent } from '../fetch_data_enhancer';
import { getUserDetails } from '../../network/openstreetmap';
import { getUsers } from '../../network/whosthat';
import {
  CHANGESET_DETAILS_DETAILS,
  CHANGESET_DETAILS_SUSPICIOUS,
  CHANGESET_DETAILS_TAGS,
  CHANGESET_DETAILS_GEOMETRY_CHANGES,
  CHANGESET_DETAILS_OTHER_FEATURES,
  CHANGESET_DETAILS_USER,
  CHANGESET_DETAILS_DISCUSSIONS,
  CHANGESET_DETAILS_MAP
} from '../../config/bindings';
import ElementInfo from '../element_info';

// | denote strict props
type propsType = {|
  changesetId: number,
  currentChangeset: Map<string, any>,
  showElements: Array<string>,
  showActions: Array<string>,
  setShowElements: (elements: Array<string>) => any,
  setShowActions: (actions: Array<string>) => any,
  mapRef: React.RefObject<{
    map: maplibre.Map,
    adiffViewer: MapLibreAugmentedDiffViewer
  }>,
  selected: Map<string, any>,
  setSelected: (selected: Map<string, any>) => void,
  // The props below come from HOCs, they are not optional!
  // to circumvent the $Diff bug  ref: https://github.com/facebook/flow/issues/1601
  // have to make them optional for flow to not throw error.
  data?: Map<string, *>,
  bindingsState?: Map<string, ?boolean>,
  exclusiveKeyToggle?: (label: string) => any
|};

/**
 * This is the UI overlay that appears on top of the map in the changeset view.
 * It displays information about the changeset in the upper left, and may also display
 * information about the currently selected element in the lower right.
 */
export class _Changeset extends React.PureComponent<*, propsType, *> {
  getUserDetailsPromise;
  getWhosThatPromise;

  state = {
    userDetails: null,
    whosThat: null
  };

  static defaultProps = {
    data: Map()
  };
  componentDidMount() {
    this.toggleDetails();
  }
  componentDidUpdate(prevProps) {
    if (
      !prevProps.currentChangeset.getIn(['properties', 'uid']) &&
      this.props.currentChangeset.getIn(['properties', 'uid'])
    ) {
      this.getUserDetailsPromise = cancelablePromise(
        getUserDetails(
          this.props.currentChangeset.getIn(['properties', 'uid'], null),
          this.props.token
        )
      );
      this.getUserDetailsPromise.promise
        .then(r => {
          this.setState({ userDetails: r });
        })
        .catch(e => console.log(e));

      this.getWhosThatPromise = cancelablePromise(
        getUsers(this.props.currentChangeset.getIn(['properties', 'uid'], ''))
      );
      this.getWhosThatPromise.promise
        .then(r => {
          this.setState({ whosThat: List(r[0].names) });
        })
        .catch(e => console.log(e));
    }
  }
  showFloaters = () => {
    const {
      changesetId,
      currentChangeset,
      showElements,
      showActions,
      setShowElements,
      setShowActions,
      bindingsState,
      data
    } = this.props;

    if (!bindingsState || !data) return;
    const properties = currentChangeset.get('properties');
    return (
      <React.Fragment>
        {bindingsState.get(CHANGESET_DETAILS_DETAILS.label) && (
          <Box key={3} className=" responsive-box round-tr round-br">
            <Header
              toggleUser={this.toggleUser}
              changesetId={changesetId}
              properties={properties}
              userEditCount={
                this.state.userDetails != null
                  ? this.state.userDetails.get('count')
                  : 0 || data.getIn(['userDetails', 'count'], 0)
              }
            />
          </Box>
        )}
        {bindingsState.get(CHANGESET_DETAILS_SUSPICIOUS.label) && (
          <Box key={2} className=" responsive-box round-tr round-br">
            <Features
              changesetId={changesetId}
              properties={properties}
              setHighlight={this.setHighlight}
              zoomToAndSelect={this.zoomToAndSelect}
            />
          </Box>
        )}
        {bindingsState.get(CHANGESET_DETAILS_TAGS.label) && (
          <Box key={5} className=" responsive-box round-tr round-br">
            <TagChanges
              changesetId={changesetId}
              setHighlight={this.setHighlight}
              zoomToAndSelect={this.zoomToAndSelect}
            />
          </Box>
        )}
        {bindingsState.get(CHANGESET_DETAILS_GEOMETRY_CHANGES.label) && (
          <Box key={5} className=" responsive-box round-tr round-br">
            <GeometryChanges
              changesetId={changesetId}
              setHighlight={this.setHighlight}
              zoomToAndSelect={this.zoomToAndSelect}
            />
          </Box>
        )}
        {bindingsState.get(CHANGESET_DETAILS_OTHER_FEATURES.label) && (
          <Box key={5} className=" responsive-box round-tr round-br">
            <OtherFeatures
              changesetId={changesetId}
              setHighlight={this.setHighlight}
              zoomToAndSelect={this.zoomToAndSelect}
            />
          </Box>
        )}
        {bindingsState.get(CHANGESET_DETAILS_DISCUSSIONS.label) && (
          <Box key={1} className=" responsive-box  round-tr round-br">
            <Discussions
              changesetAuthor={currentChangeset.get('properties').get('user')}
              discussions={
                this.props.osmInfo?.getIn([
                  'metadata',
                  'changeset',
                  'comments'
                ]) ?? List()
              }
              changesetIsHarmful={properties.get('harmful')}
              changesetId={changesetId}
            />
          </Box>
        )}
        {bindingsState.get(CHANGESET_DETAILS_USER.label) && (
          <Box key={0} className="responsive-box round-tr round-br">
            <User
              userDetails={
                data.getIn(['userDetails', 'name'])
                  ? data.getIn(['userDetails'], Map())
                  : Map([
                      [
                        'uid',
                        this.props.currentChangeset.getIn(['properties', 'uid'])
                      ],
                      [
                        'name',
                        this.props.currentChangeset.getIn([
                          'properties',
                          'user'
                        ])
                      ],
                      [
                        'harmful_changesets',
                        data.getIn(['userDetails', 'harmful_changesets'])
                      ],
                      [
                        'checked_changesets',
                        data.getIn(['userDetails', 'checked_changesets'])
                      ],
                      [
                        'changesets_in_osmcha',
                        data.getIn(['userDetails', 'changesets_in_osmcha'])
                      ]
                    ])
              }
              whosThat={
                data.getIn(['userDetails', 'name'])
                  ? data.getIn(['whosThat', 0, 'names'], List())
                  : this.state.whosThat || List()
              }
              changesetUsername
            />
          </Box>
        )}
        {bindingsState.get(CHANGESET_DETAILS_MAP.label) && (
          <Box key={4} className="responsive-box round-tr round-br">
            <MapOptions
              showElements={showElements}
              showActions={showActions}
              setShowElements={setShowElements}
              setShowActions={setShowActions}
            />
          </Box>
        )}
      </React.Fragment>
    );
  };

  toggleFeatures = () => {
    this.props.exclusiveKeyToggle &&
      this.props.exclusiveKeyToggle(CHANGESET_DETAILS_SUSPICIOUS.label);
  };
  toggleOtherFeatures = () => {
    this.props.exclusiveKeyToggle &&
      this.props.exclusiveKeyToggle(CHANGESET_DETAILS_OTHER_FEATURES.label);
  };
  toggleTags = () => {
    this.props.exclusiveKeyToggle &&
      this.props.exclusiveKeyToggle(CHANGESET_DETAILS_TAGS.label);
  };
  toggleGeometryChanges = () => {
    this.props.exclusiveKeyToggle &&
      this.props.exclusiveKeyToggle(CHANGESET_DETAILS_GEOMETRY_CHANGES.label);
  };
  toggleDiscussions = () => {
    this.props.exclusiveKeyToggle &&
      this.props.exclusiveKeyToggle(CHANGESET_DETAILS_DISCUSSIONS.label);
  };
  toggleDetails = () => {
    this.props.exclusiveKeyToggle &&
      this.props.exclusiveKeyToggle(CHANGESET_DETAILS_DETAILS.label);
  };
  toggleUser = () => {
    this.props.exclusiveKeyToggle &&
      this.props.exclusiveKeyToggle(CHANGESET_DETAILS_USER.label);
  };
  toggleMapOptions = () => {
    this.props.exclusiveKeyToggle &&
      this.props.exclusiveKeyToggle(CHANGESET_DETAILS_MAP.label);
  };

  /// Given an OSM Element type (node/way/relation) and ID number,
  /// add or remove a highlight effect for the corresponding map features.
  /// (Used for indicating elements when references to them in the UI are hovered)
  setHighlight = (type: string, id: number, isHighlighted: boolean) => {
    let { adiffViewer } = this.props.mapRef.current;
    if (isHighlighted) {
      adiffViewer.highlight(type, id);
    } else {
      adiffViewer.unhighlight(type, id);
    }
  };

  /// Given an OSM Element type (node/way/relation) and ID number,
  /// zoom the map to show that element, and select it in the overlay.
  zoomToAndSelect = (type: string, id: number) => {
    let { map, adiffViewer } = this.props.mapRef.current;

    // find the feature(s) in the geojson that represent this element
    // (there may be two, the old and new versions, if the element was modified)
    let features = adiffViewer.geojson.features.filter(
      feature =>
        feature.properties.type === type && feature.properties.id === id
    );
    // zoom the map to the bounding box of the feature(s)
    let bounds = bbox({ type: 'FeatureCollection', features });
    map.jumpTo(map.cameraForBounds(bounds, { padding: 50, maxZoom: 18 }));
    // style the feature(s) on the map to indicate that they're selected
    adiffViewer.select(type, id);

    // find the action in the adiff that affects this element
    let action = adiffViewer.adiff.actions.find(action => {
      let element = action.new ?? action.old;
      return element.type === type && element.id === id;
    });

    // show the ElementInfo overlay for that action
    this.props.setSelected(action);
  };

  render() {
    const { bindingsState, currentChangeset } = this.props;
    const features = currentChangeset.getIn(['properties', 'features']);
    return (
      <React.Fragment>
        <div
          className="absolute flex-parent flex-parent--column clip"
          style={{ top: 0, left: 0 }}
        >
          <div className="flex-child clip">
            <ControlLayout
              toggleDetails={this.toggleDetails}
              toggleFeatures={this.toggleFeatures}
              toggleOtherFeatures={this.toggleOtherFeatures}
              toggleTags={this.toggleTags}
              toggleGeometryChanges={this.toggleGeometryChanges}
              toggleDiscussions={this.toggleDiscussions}
              toggleUser={this.toggleUser}
              toggleMapOptions={this.toggleMapOptions}
              features={features}
              bindingsState={bindingsState}
              discussions={
                this.props.osmInfo?.getIn([
                  'metadata',
                  'changeset',
                  'comments'
                ]) ?? List()
              }
            />
            <Floater style={{ marginTop: 5, marginLeft: 41 }}>
              {this.showFloaters()}
            </Floater>
          </div>
        </div>
        {this.props.selected && (
          <div
            className="absolute bg-white px12 py6 z5 round"
            style={{
              bottom: 0,
              right: 0,
              margin: '10px',
              minWidth: '400px',
              maxWidth: '550px',
              maxHeight: '60vh',
              overflowY: 'auto'
            }}
          >
            <ElementInfo
              action={this.props.selected}
              setHighlight={this.setHighlight}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

let Changeset = keyboardToggleEnhancer(
  true,
  [
    CHANGESET_DETAILS_DETAILS,
    CHANGESET_DETAILS_SUSPICIOUS,
    CHANGESET_DETAILS_TAGS,
    CHANGESET_DETAILS_GEOMETRY_CHANGES,
    CHANGESET_DETAILS_OTHER_FEATURES,
    CHANGESET_DETAILS_USER,
    CHANGESET_DETAILS_DISCUSSIONS,
    CHANGESET_DETAILS_MAP
  ],
  _Changeset
);

/**
 * Never use props not required by the Basecomponent in HOCs
 */
Changeset = withFetchDataSilent(
  (props: propsType) => ({
    userDetails: cancelablePromise(
      getUserDetails(
        props.currentChangeset.getIn(['properties', 'uid'], null),
        props.token
      )
    ),
    whosThat: cancelablePromise(
      getUsers(props.currentChangeset.getIn(['properties', 'uid'], ''))
    )
  }),
  (nextProps: propsType, props: propsType) =>
    props.changesetId !== nextProps.changesetId,
  Changeset
);

Changeset = connect((state: RootStateType, props) => ({
  token: state.auth.get('token'),
  osmInfo: fromJS(state.changeset.getIn(['changesetMap', props.changesetId]))
}))(Changeset);

export { Changeset };
