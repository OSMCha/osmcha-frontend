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
    <div className="flex-child flex-child--grow wmax960 transition">
      <Box>
        <Header changesetId={changesetId} properties={properties} />
      </Box>

      <div
        className="flex-parent flex-parent--row flex-parent--start flex-parent--wrap"
      >
        <Box>
          <Comment changesetId={changesetId} properties={properties} />
        </Box>
        <Box>
          <Details changesetId={changesetId} properties={properties} />
        </Box>
        <Box>
          <Features changesetId={changesetId} properties={properties} />
        </Box>
      </div>
      <Box
        pullDown={
          <span style={{position: 'relative', top: 2}}>
            <button
              className="btn btn--s btn--gray btn--pill-vt border-b"
              onClick={scrollDown}
            >
              Show Map
            </button>
          </span>
        }
        pullUp={
          <span style={{position: 'relative', bottom: 2}}>
            <button
              className="btn btn--s btn--gray btn--pill-vb border-b"
              onClick={scrollUp}
            >
              Go Up
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
