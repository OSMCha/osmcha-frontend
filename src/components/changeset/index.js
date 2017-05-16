// @flow
import React from 'react';
import Collapsible from 'react-collapsible';
import {Map, List, fromJS} from 'immutable';
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
    });
  };
  ref = null;
  state = {
    width: undefined,
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
    const properties = currentChangeset.get('properties');
    const height = parseInt(window.innerHeight - 55, 10);

    const features = fromJS(
      shuffle([
        {
          osm_id: 2593918603,
          url: 'node-2593918603',
          name: 'HDFC Bank ATM',
          reasons: ['Deleted a wikidata/wikipedia tag'],
        },
        {
          osm_id: 2412772337,
          url: 'node-2412772337',
          name: 'HDFC ATM',
          reasons: ['Deleted a wikidata/wikipedia tag'],
        },
        {
          osm_id: 2593876995,
          url: 'node-2593876995',
          name: 'Andhra Bank ATM',
          reasons: ['Deleted a wikidata/wikipedia tag'],
        },
        {
          osm_id: 2412772336,
          url: 'node-2412772336',
          name: 'ICICI ATM',
          reasons: ['Deleted a wikidata/wikipedia tag'],
        },
        {
          osm_id: 4557677889,
          url: 'node-4557677889',
          name: 'Hitch city',
          reasons: ['edited a name tag'],
        },
        {
          osm_id: 3593876995,
          url: 'node-2593876995',
          name: 'Guj Bank ATM',
          reasons: ['Deleted a wikidata/wikipedia tag'],
        },
        {
          osm_id: 2412772336,
          url: 'node-2412772336',
          name: 'ATM',
          reasons: ['Is too cool 😎'],
        },
      ]).slice(0, parseInt(Math.random() * 100, 10) % 7),
    );
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
                    `mx6 cursor-pointer txt-s color-gray inline-block txt-bold transition round p6  bg-gray-faint-on-hover`
                  }
                >
                  Overview
                </a>
                <a
                  className={
                    `mx6  cursor-pointer txt-s color-gray inline-block txt-bold transition round p6  bg-gray-faint-on-hover`
                  }
                >
                  Comments
                </a>
                <a
                  className={
                    `mx6 cursor-pointer txt-s color-gray inline-block txt-bold transition round p6  bg-gray-faint-on-hover`
                  }
                >
                  Discussions
                </a>
                <a
                  className={
                    `mx6 cursor-pointer txt-s color-gray inline-block txt-bold transition round p6  bg-gray-faint-on-hover`
                  }
                >
                  Suspicious
                </a>
                <a
                  className={
                    `mx6 cursor-pointer txt-s color-gray inline-block txt-bold transition round p6  bg-gray-faint-on-hover`
                  }
                >
                  Other
                </a>

              </div>
            }
          />
          <Box className="wmin480" bg="bg-black">
            {currentChangesetMap
              ? <CMap
                  changesetId={changesetId}
                  adiffResult={currentChangesetMap}
                />
              : <Loading height={parseInt(window.innerHeight, 10)} />}
          </Box>
          <Floater style={{top: 55 * 2, width: this.state.width}}>
            <Box className="wmin480 my3" bg="bg-white">
              <Header changesetId={changesetId} properties={properties} />
            </Box>
          </Floater>
        </div>
      </div>
    );
  }
}
