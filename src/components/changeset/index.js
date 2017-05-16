// @flow
import React from 'react';
import Collapsible from 'react-collapsible';
import {Map, List, fromJS} from 'immutable';
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
      <div style={{height}}>
        <Box className="wmin480" bg="bg-black">
          {currentChangesetMap
            ? <CMap
                changesetId={changesetId}
                adiffResult={currentChangesetMap}
              />
            : <Loading height={parseInt(window.innerHeight, 10)} />}
        </Box>
      </div>
    </div>
  );
} //  <div> //         <div className="grid grid--gut6"> //           <Box className="col col--6-mxl col--12 scroll-auto" style={{height}}> //             <Collapsible //               open //               trigger={ //                 <Heading> //                   Changeset Details //                 </Heading> //               } //             > //               <Details changesetId={changesetId} properties={properties} /> //             </Collapsible> //             {window.innerWidth <= 1200 && //               <div> //                 <div> //                   <Collapsible //                     open //                     trigger={ //                       <Heading> //                         Features //                       </Heading> //                     } //                   > //                     <Features changesetId={changesetId} features={features} /> //                   </Collapsible> //                 </div> //                 <Collapsible //                   trigger={ //                     <Heading> //                       Discussions //                     </Heading> //                   } //                 > //                   <Discussions //                     changesetId={changesetId} //                     properties={properties} //                   /> //                 </Collapsible> //                 <span>&nbsp;</span> //               </div>} //           </Box> //           {window.innerWidth > 1200 && //             <Box //               className="col col--6-mxl col--12 scroll-auto" //               style={{ //                 height, //               }} //             > //               <Collapsible //                 trigger={ //                   <Heading> //                     Discussions //                   </Heading> //                 } //               > //                 <Discussions //                   changesetId={changesetId} //                   properties={properties} //                 /> //               </Collapsible> //               <Collapsible //                 open //                 trigger={ //                   <Heading> //                     Features ({features.size}) //                   </Heading> //                 } //               > //                 <Features changesetId={changesetId} features={features} /> //               </Collapsible> //             </Box>} //         </div> //       </div>
