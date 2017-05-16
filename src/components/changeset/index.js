// @flow
import React from 'react';
import Collapsible from 'react-collapsible';
import {Map, List, fromJS} from 'immutable';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import {Navbar} from '../navbar';
import {Tooltip} from 'react-tippy';
import {Floater} from './floater';

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
import {dispatchEvent} from '../../utils/dispatch_event';
import {Details} from './details';
import {Header} from './header';

import {CMap} from './map';
import {Loading} from '../loading';
import {Comment} from './comment';
import {Features} from './features';
import {Box} from './box';
import {Discussions} from './discussions';

const Heading = ({children}) => (
  <h2
    className="cursor-pointer txt-l txt-bold mb6 pl12 bg-gray-light border border--gray-light"
  >
    {children}
  </h2>
); // presentational component for view/changeset.js

export class Changeset extends React.PureComponent {
  setRef = (r: any) => {
    if (!r) return;
    var rect = r.getBoundingClientRect();
    this.setState({
      width: parseInt(rect.width, 10),
      left: parseInt(rect.left, 10),
    });
  };
  ref = null;
  state = {
    width: 0,
    left: 0,
    comment: false,
    discussions: false,
    features: false,
    details: false,
  };
  props: {
    changesetId: number,
    currentChangeset: ?Map<string, *>,
    currentChangesetMap: ?Object,
    errorChangeset: ?Object,
    errorChangesetMap: ?Object,
    dimensions: Object,
    scrollDown: () => void,
    scrollUp: () => void,
  };
  componentDidMount() {
    console.log(this.ref);
    if (this.ref) {
    }
  }
  showFloaters = () => {
    const {
      changesetId,
      currentChangeset,
    } = this.props;
    const properties = currentChangeset && currentChangeset.get('properties');

    return (
      <CSSTransitionGroup
        transitionName="floaters"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={150}
      >
        {this.state.comment &&
          <Box key={0} className="transition w480 my3">
            <Comment changesetId={changesetId} properties={properties} />
          </Box>}
        {this.state.discussions &&
          <Box key={1} className="transition w480 my3">
            <Discussions changesetId={changesetId} properties={properties} />
          </Box>}
        {this.state.features &&
          <Box key={2} className="transition w480 my3">
            <Features changesetId={changesetId} properties={properties} />
          </Box>}
        {this.state.details &&
          <Box key={3} className="transition w480 my3">
            <Details changesetId={changesetId} properties={properties} />
          </Box>}
      </CSSTransitionGroup>
    );
  };
  overview = true;
  toggleAll = () => {
    this.setState({
      features: this.overview,
      discussions: this.overview,
      comment: this.overview,
      details: this.overview,
    });
    this.overview = !this.overview;
  };
  toggleFeatures = () => {
    this.setState({
      features: !this.state.features,
    });
  };
  toggleDiscussions = () => {
    this.setState({
      discussions: !this.state.discussions,
    });
  };
  toggleComment = () => {
    this.setState({
      comment: !this.state.comment,
    });
  };
  toggleDetails = () => {
    this.setState({
      details: !this.state.details,
    });
  };
  render() {
    const {
      changesetId,
      currentChangeset,
      errorChangeset,
      currentChangesetMap,
      errorChangesetMap,
      scrollDown,
      scrollUp,
    } = this.props;
    if (errorChangeset) {
      console.log('error');
      dispatchEvent('showToast', {
        title: 'changeset failed to load',
        content: 'Try reloading osmcha',
        timeOut: 5000,
        type: 'error',
      });
      console.error(errorChangeset);
      return null;
    }
    if (!currentChangeset) return null;
    const height = parseInt(window.innerHeight - 55, 10);

    return (
      <div className="flex-child w-full transition clip">
        <div style={{height}} ref={this.setRef}>
          <Navbar
            className="bg-white color-gray border-b border--gray-light border--1"
            title={
              <div
                className="flex-parent flex-parent--row flex-parent--center-main flex-parent--wrap"
              >
                <a
                  className={
                    ` active mx6 cursor-pointer txt-s color-gray inline-block txt-bold transition round p6  bg-gray-faint-on-hover`
                  }
                  onClick={this.toggleAll}
                >
                  Overview
                </a>
                <a
                  className={
                    `mx6  cursor-pointer txt-s color-gray inline-block txt-bold transition round p6  bg-gray-faint-on-hover`
                  }
                  onClick={this.toggleComment}
                >
                  Comments
                </a>
                <a
                  className={
                    `mx6 cursor-pointer txt-s color-gray inline-block txt-bold transition round p6  bg-gray-faint-on-hover`
                  }
                  onClick={this.toggleDiscussions}
                >
                  Discussions
                </a>
                <a
                  className={
                    `mx6 cursor-pointer txt-s color-gray inline-block txt-bold transition round p6  bg-gray-faint-on-hover`
                  }
                  onClick={this.toggleFeatures}
                >
                  Suspicious
                </a>
                <a
                  onClick={this.toggleDetails}
                  className={
                    `mx6 cursor-pointer txt-s color-gray inline-block txt-bold transition round p6  bg-gray-faint-on-hover`
                  }
                >
                  Details
                </a>

              </div>
            }
          />
          <Box className="wmin480" bg="bg-black">
            {currentChangesetMap && this.state.width
              ? <CMap
                  changesetId={changesetId}
                  adiffResult={currentChangesetMap}
                  width={this.state.width}
                />
              : <Loading height={parseInt(window.innerHeight, 10)} />}
          </Box>
          <Floater
            style={{
              top: 55 * 2,
              width: 480,
              left: this.state.left + (this.state.width - 480) / 2,
            }}
          >
            {this.showFloaters()}
          </Floater>
        </div>
      </div>
    );
  }
} //  <Box className="wmin480 my3" bg="bg-white"> //               <Header changesetId={changesetId} properties={properties} /> //             </Box>
