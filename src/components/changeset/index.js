// @flow
import React from 'react';
import { Map, List } from 'immutable';
import CSSGroup from 'react-transition-group/CSSTransitionGroup';
import { cancelablePromise, cancelableFetchJSON } from '../../utils/promise';

import { getUserDetails } from '../../network/openstreetmap';
import { Floater } from './floater';
import { Header } from './header';
import { User } from './user';
import { Features } from './features';
import { TagChanges } from './tag_changes';
import { Box } from './box';
import { Discussions } from './discussions';
import { MapOptions } from './map_options';
import { ControlLayout } from './control_layout';
import { keyboardToggleEnhancer } from '../keyboard_enhancer';
import { withFetchDataSilent } from '../fetch_data_enhancer';

import { osmCommentsApi, whosThat } from '../../config/constants';
import {
  CHANGESET_DETAILS_DETAILS,
  CHANGESET_DETAILS_SUSPICIOUS,
  CHANGESET_DETAILS_TAGS,
  CHANGESET_DETAILS_USER,
  CHANGESET_DETAILS_DISCUSSIONS,
  CHANGESET_DETAILS_MAP
} from '../../config/bindings';

// | denote strict props
type propsType = {|
  changesetId: number,
  currentChangeset: Map<string, any>,
  // The props below come from HOCs, they are not optional!
  // to circumvent the $Diff bug  ref: https://github.com/facebook/flow/issues/1601
  // have to make them optional for flow to not throw error.
  data?: Map<string, *>,
  bindingsState?: Map<string, ?boolean>,
  exclusiveKeyToggle?: (label: string) => any
|};

// presentational component for view/changeset.js
export class _Changeset extends React.PureComponent<*, propsType, *> {
  static defaultProps = {
    data: Map()
  };
  componentDidMount() {
    this.toggleDetails();
  }
  showFloaters = () => {
    const { changesetId, currentChangeset, bindingsState, data } = this.props;
    if (!bindingsState || !data) return;
    const properties = currentChangeset.get('properties');
    return (
      <CSSGroup
        name="floaters"
        transitionName="floaters"
        transitionAppearTimeout={300}
        transitionAppear={true}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={250}
      >
        {bindingsState.get(CHANGESET_DETAILS_DETAILS.label) && (
          <Box key={3} className=" responsive-box round-tr round-br">
            <Header
              toggleUser={this.toggleUser}
              changesetId={changesetId}
              properties={properties}
              userEditCount={data.getIn(['userDetails', 'count'], 0)}
            />
          </Box>
        )}
        {bindingsState.get(CHANGESET_DETAILS_SUSPICIOUS.label) && (
          <Box key={2} className=" responsive-box round-tr round-br">
            <Features changesetId={changesetId} properties={properties} />
          </Box>
        )}
        {bindingsState.get(CHANGESET_DETAILS_TAGS.label) && (
          <Box key={5} className=" responsive-box round-tr round-br">
            <TagChanges />
          </Box>
        )}
        {bindingsState.get(CHANGESET_DETAILS_DISCUSSIONS.label) && (
          <Box key={1} className=" responsive-box  round-tr round-br">
            <Discussions
              changesetId={changesetId}
              discussions={data.getIn(
                ['osmComments', 'properties', 'comments'],
                List()
              )}
            />
          </Box>
        )}
        {bindingsState.get(CHANGESET_DETAILS_USER.label) && (
          <Box key={0} className=" responsive-box  round-tr round-br">
            <User
              userDetails={data.getIn(['userDetails'], Map())}
              whosThat={data.getIn(['whosThat', 0, 'names'], List())}
            />
          </Box>
        )}
        {bindingsState.get(CHANGESET_DETAILS_MAP.label) && (
          <Box key={4} className=" responsive-box  round-tr round-br">
            <MapOptions />
          </Box>
        )}
      </CSSGroup>
    );
  };

  toggleFeatures = () => {
    this.props.exclusiveKeyToggle &&
      this.props.exclusiveKeyToggle(CHANGESET_DETAILS_SUSPICIOUS.label);
  };
  toggleTags = () => {
    this.props.exclusiveKeyToggle &&
      this.props.exclusiveKeyToggle(CHANGESET_DETAILS_TAGS.label);
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

  render() {
    const { data, bindingsState, currentChangeset } = this.props;
    const features = currentChangeset.getIn(['properties', 'features']);
    return (
      <div className="flex-child clip">
        <ControlLayout
          toggleDetails={this.toggleDetails}
          toggleFeatures={this.toggleFeatures}
          toggleTags={this.toggleTags}
          toggleDiscussions={this.toggleDiscussions}
          toggleUser={this.toggleUser}
          toggleMapOptions={this.toggleMapOptions}
          features={features}
          bindingsState={bindingsState}
          discussions={
            data &&
            data.getIn(['osmComments', 'properties', 'comments'], List())
          }
        />
        <Floater
          style={{
            marginTop: 5,
            marginLeft: 41
          }}
        >
          {this.showFloaters()}
        </Floater>
      </div>
    );
  }
}

let Changeset = keyboardToggleEnhancer(
  true,
  [
    CHANGESET_DETAILS_DETAILS,
    CHANGESET_DETAILS_SUSPICIOUS,
    CHANGESET_DETAILS_TAGS,
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
      getUserDetails(props.currentChangeset.getIn(['properties', 'uid'], null))
    ),
    osmComments: cancelableFetchJSON(`${osmCommentsApi}/${props.changesetId}`),
    whosThat: cancelableFetchJSON(
      `${whosThat}${props.currentChangeset.getIn(['properties', 'uid'], '')}`
    )
  }),
  (nextProps: propsType, props: propsType) =>
    props.changesetId !== nextProps.changesetId,
  Changeset
);

export { Changeset };
