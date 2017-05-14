// @flow
import React from 'react';
import {Map, List, fromJS} from 'immutable';
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
    className="flex-parent flex-parent--row justify--space-between px6 flex-parent--wrap border-b border--gray-light pb3"
  >
    <span className="wmin120">
      <a title={data.get('osm_id')}> Name: {data.get('name')}</a>
    </span>
    <span className="wmin240"><Reasons reasons={data.get('reasons')} /></span>

  </div>
);
export function Features(
  {
    features,
    changesetId,
  }: {
    features: List<*>,
    changesetId: number,
  },
) {
  return (
    <div className="p12">
      <div>
        <div className="flex-child txt-subhead my3 txt-em ml6">
          {features.map((f, k) => <Feature key={k} data={f} />)}
        </div>
      </div>
    </div>
  );
}
