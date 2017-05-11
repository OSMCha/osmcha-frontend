// @flow
import React from 'react';
import {Map} from 'immutable';

import {dispatchEvent} from '../../utils/dispatch_event';
import {Details} from './details';
import {Header} from './header';

import {CMap} from './map';
import {Loading} from '../loading';
import {Comment} from './comment';
import {Features} from './features';
import {Box} from './box';
import {Discussions} from './discussions';

// presentational component for view/changeset.js
export function Changeset(
  {
    changesetId,
    currentChangeset,
    errorChangeset,
    currentChangesetMap,
    errorChangesetMap,
    scrollDown,
    scrollUp,
  }: {
    changesetId: number,
    currentChangeset: ?Map<string, *>,
    currentChangesetMap: ?Object,
    errorChangeset: ?Object,
    errorChangesetMap: ?Object,
    scrollDown: () => void,
    scrollUp: () => void,
  },
) {
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

  return (
    <div className="flex-child flex-child--grow wmax960 transition mt12 mx18">
      <Box>
        <Header changesetId={changesetId} properties={properties} />
      </Box>
      <div className="grid grid--gut12">
        <Box className="col col--6">
          <Comment changesetId={changesetId} properties={properties} />
        </Box>
        <Box className="col col--6">
          <Details changesetId={changesetId} properties={properties} />
        </Box>
        <Box className="col col--6">
          <Features changesetId={changesetId} properties={properties} />
        </Box>
        <Box className="col col--6">
          <Discussions changesetId={changesetId} properties={properties} />
        </Box>
      </div>
      <Box
        className="wmin480 wmax920"
        pullDown={
          <span style={{position: 'relative', top: 2}}>
            <button
              className="btn btn--s btn--gray btn--pill-vt border-b cursor-pointer"
              onClick={scrollDown}
            >
              Show Map
              <svg className="inline icon--s icon-white">
                <use xlinkHref="#icon-chevron-down" />
              </svg>
            </button>
          </span>
        }
        pullUp={
          <span
            style={{position: 'relative', bottom: 2}}
            className="flex-parent flex-parent--row"
          >
            <button
              className="btn btn--s btn--gray btn--pill-vb border-b cursor-pointer"
              onClick={scrollUp}
            >
              Go Up
              <svg className="inline icon--s">
                <use xlinkHref="#icon-chevron-up" />
              </svg>
            </button>
          </span>
        }
      >
        {currentChangesetMap
          ? <CMap changesetId={changesetId} adiffResult={currentChangesetMap} />
          : <Loading height={parseInt(window.innerHeight * 0.5, 10)} />}
      </Box>
    </div>
  );
}
