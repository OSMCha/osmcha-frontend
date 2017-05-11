// @flow
import React from 'react';
import {Map, fromJS} from 'immutable';
import {Reasons} from '../reasons';
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

const Feature = ({data}) => (
  <div
    className="flex-parent flex-parent--row justify--space-between px42 flex-parent--wrap"
  >
    <span className="wmin120">ID: {data.get('osm_id')}</span>
    <span className="wmin240">Name: {data.get('name')}</span>
    <span className="wmin240"><Reasons reasons={data.get('reasons')} /></span>

  </div>
);
export function Features(
  {
    properties,
    changesetId,
  }: {properties: Map<string, *>, changesetId: number, expanded?: boolean},
) {
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
    <div className="p12">
      <div>
        <h2 className="txt-l mr6">Suspicious Features ({features.size})</h2>
        <p className="flex-child txt-subhead my3 txt-em ml6">
          {features.map((f, k) => <Feature key={k} data={f} />)}
        </p>
      </div>
    </div>
  );
}
