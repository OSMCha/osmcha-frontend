// @flow
import React from 'react';
import { Map, fromJS } from 'immutable';
import { Reasons } from '../reasons';

const Feature = ({ data }) => (
  <tr className="txt-s">
    <td>{data.get('osm_id')}</td>
    <td>{data.get('name')}</td>
    <td><Reasons reasons={data.get('reasons')} /></td>
    <td>
      <span className="cursor-pointer txt-bold txt-underline-on-hover mr6">
        Map
      </span>
      <span className="cursor-pointer txt-bold txt-underline-on-hover">
        JOSM
      </span>
    </td>
  </tr>
);

export function Features({
  properties,
  changesetId
}: {
  properties: Map<string, *>,
  changesetId: number
}) {
  const features = properties.get('features');
  return (
    <div className="p18">
      <div>
        <h2 className="txt-l mr6 txt-bold">
          Suspicious Features ({features.size})
        </h2>
        {features.size === 0
          ? `No suspicious features for ${changesetId}.`
          : <table className="table osmcha-custom-table mt12">
              <thead>
                <tr className="txt-s txt-uppercase">
                  <th>OSM Id</th>
                  <th>Name</th>
                  <th>Reasons</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, k) => <Feature key={k} data={f} />)}
              </tbody>
            </table>}
      </div>
    </div>
  );
}
