// @flow
import React from 'react';
import { Map, List, fromJS } from 'immutable';
import CSSGroup from 'react-transition-group/CSSTransitionGroup';
import Mousetrap from 'mousetrap';

import { getUserDetails } from '../../network/openstreetmap';
import { Floater } from './floater';
import { Header } from './header';
import { User } from './user';
import { Features } from './features';
import { Box } from './box';
import { Discussions } from './discussions';
import { Control } from './control';
import { MapOptions } from './map_options';

import { cancelablePromise } from '../../utils/promise';

import { osmCommentsApi, whosThat } from '../../config/constants';
import {
  CHANGESET_DETAILS_SHOW_ALL,
  CHANGESET_DETAILS_DETAILS,
  CHANGESET_DETAILS_SUSPICIOUS,
  CHANGESET_DETAILS_USER,
  CHANGESET_DETAILS_DISCUSSIONS,
  CHANGESET_DETAILS_MAP
} from '../../config/bindings';

// presentational component for view/changeset.js
export class Changeset extends React.PureComponent {
  state = {
    width: 0,
    left: 0,
    discussions: false,
    features: false,
    user: false,
    details: true,
    mapOptions: false,
    discussionsData: List(),
    userDetails: new Map()
  };
  props: {
    filterChangesetsByUser: () => any,
    changesetId: number,
    currentChangeset: Map<string, *>
  };
  ref = null;
  getOsmCommentsPromise: Promise<*>;
  getUserDetailsPromise: Promise<*>;
  getWhosThatPromise: Promise<*>;
  componentWillReceiveProps(nextProps: Object) {
    if (this.props.changesetId !== nextProps.changesetId)
      this.getData(nextProps.changesetId, nextProps.currentChangeset);
  }
  componentDidMount() {
    Mousetrap.bind(CHANGESET_DETAILS_SUSPICIOUS, () => {
      this.toggleFeatures();
    });
    Mousetrap.bind(CHANGESET_DETAILS_DISCUSSIONS, () => {
      this.toggleDiscussions();
    });
    Mousetrap.bind(CHANGESET_DETAILS_DETAILS, () => {
      this.toggleDetails();
    });
    Mousetrap.bind(CHANGESET_DETAILS_USER, () => {
      this.toggleUser();
    });
    Mousetrap.bind(CHANGESET_DETAILS_MAP, () => {
      this.toggleMapOptions();
    });
    this.getData(this.props.changesetId, this.props.currentChangeset);
  }
  componentWillUnmount() {
    this.getOsmCommentsPromise && this.getOsmCommentsPromise.cancel();
    this.getUserDetailsPromise && this.getUserDetailsPromise.cancel();
  }
  setRef = (r: any) => {
    if (!r) return;
    var rect = r.parentNode.parentNode.parentNode.getBoundingClientRect();
    this.setState({
      width: parseInt(rect.width, 10),
      left: parseInt(rect.left, 10)
    });
  };
  getData = (changesetId: number, currentChangeset: Map<string, *>) => {
    const uid: number = parseInt(
      currentChangeset.getIn(['properties', 'uid']),
      10
    );
    const user: string = currentChangeset.getIn(['properties', 'user']);
    const getUserDetailsPromise = cancelablePromise(getUserDetails(uid));
    const getOsmCommentsPromise = cancelablePromise(
      fetch(`${osmCommentsApi}/${changesetId}`).then(r => r.json())
    );
    const getWhosThatPromise = cancelablePromise(
      fetch(`${whosThat}${user}`).then(r => r.json())
    );

    this.getUserDetailsPromise = getUserDetailsPromise;
    this.getOsmCommentsPromise = getOsmCommentsPromise;
    this.getWhosThatPromise = getWhosThatPromise;

    getUserDetailsPromise.promise
      .then(userDetails => {
        this.setState({
          userDetails: this.state.userDetails.merge(userDetails)
        });
      })
      .catch(e => {});

    getOsmCommentsPromise.promise
      .then(x => {
        if (x && x.properties && Array.isArray(x.properties.comments)) {
          this.setState({
            discussionsData: fromJS(x.properties.comments)
          });
        }
      })
      .catch(e => {});

    getWhosThatPromise.promise.then(d => {
      console.log(d);
      if (Array.isArray(d) && d[0] && d[0].names) {
        let userDetails = new Map();
        userDetails = userDetails.set('otherNames', fromJS(d[0].names));
        this.setState({
          userDetails: this.state.userDetails.merge(userDetails)
        });
      }
    });
  };

  showFloaters = () => {
    const { changesetId, currentChangeset } = this.props;
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
        {this.state.details &&
          <Box key={3} className=" w420 round-tr round-br">
            <Header
              toggleUser={this.toggleUser}
              changesetId={changesetId}
              properties={properties}
              userEditCount={this.state.userDetails.get('count')}
            />
          </Box>}
        {this.state.features &&
          <Box key={2} className=" w420 round-tr round-br">
            <Features changesetId={changesetId} properties={properties} />
          </Box>}
        {this.state.discussions &&
          <Box key={1} className=" w420  round-tr round-br">
            <Discussions
              changesetId={changesetId}
              discussions={this.state.discussionsData}
            />
          </Box>}
        {this.state.user &&
          <Box key={0} className=" w420  round-tr round-br">
            <User
              userDetails={this.state.userDetails}
              filterChangesetsByUser={this.props.filterChangesetsByUser}
            />
          </Box>}
        {this.state.mapOptions &&
          <Box key={4} className=" w420  round-tr round-br">
            <MapOptions />
          </Box>}
      </CSSGroup>
    );
  };
  toggleFeatures = () => {
    this.setState({
      discussions: false,
      details: false,
      features: !this.state.features,
      mapOptions: false,

      user: false
    });
  };
  toggleDiscussions = () => {
    this.setState({
      discussions: !this.state.discussions,
      details: false,
      features: false,
      mapOptions: false,

      user: false
    });
  };
  toggleDetails = () => {
    this.setState({
      discussions: false,
      details: !this.state.details,
      features: false,
      mapOptions: false,

      user: false
    });
  };
  toggleUser = () => {
    this.setState({
      discussions: false,
      details: false,
      features: false,
      mapOptions: false,

      user: !this.state.user
    });
  };
  toggleMapOptions = () => {
    this.setState({
      discussions: false,
      details: false,
      features: false,
      user: false,
      mapOptions: !this.state.mapOptions
    });
  };
  render() {
    const features = this.props.currentChangeset.getIn([
      'properties',
      'features'
    ]);
    return (
      <div className="flex-child clip" ref={this.setRef}>
        <Floater
          style={{
            top: 55 * 1.1,
            width: 80,
            left: this.state.left - 15
          }}
        >
          <Control
            active={this.state.details}
            onClick={this.toggleDetails}
            bg={'gray-faint'}
            className="unround-r unround-bl"
          >
            <svg className="icon inline-block align-middle ">
              <use xlinkHref="#icon-eye" />
            </svg>
          </Control>
          <Control
            active={this.state.features}
            onClick={this.toggleFeatures}
            bg={'gray-faint'}
            className="unround"
          >
            <svg
              className={`icon inline-block align-middle ${features &&
                features.size == 0
                ? 'color-darken25'
                : 'color-black'}`}
            >
              <use xlinkHref="#icon-alert" />
            </svg>
          </Control>
          <Control
            active={this.state.discussions}
            onClick={this.toggleDiscussions}
            bg={'white'}
            className="unround"
          >
            <svg
              className={`icon inline-block align-middle ${this.state
                .discussionsData.size == 0
                ? 'color-darken25'
                : 'color-black'}`}
            >
              <use xlinkHref="#icon-contact" />
            </svg>
          </Control>
          <Control
            active={this.state.user}
            onClick={this.toggleUser}
            bg={'white'}
            className="unround"
          >
            <svg className="icon inline-block align-middle">
              <use xlinkHref="#icon-user" />
            </svg>
          </Control>
          <Control
            active={this.state.mapOptions}
            onClick={this.toggleMapOptions}
            bg={'white'}
            className="unround-r unround-tl"
          >
            <svg className="icon inline-block align-middle">
              <use xlinkHref="#icon-map" />
            </svg>
          </Control>
        </Floater>
        <Floater
          style={{
            top: 55 * 1.1,
            width: 420,
            left: 40 + this.state.left
          }}
        >
          {this.showFloaters()}
        </Floater>
      </div>
    );
  }
}
