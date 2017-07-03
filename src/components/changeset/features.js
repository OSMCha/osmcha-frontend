// @flow
import React from 'react';
import { Map, fromJS, List } from 'immutable';
import { Reasons } from '../reasons';
import { selectFeature } from '../../views/map';

const Feature = ({ data }: { data: Map<string, any> }) => {
  const Li = data.get('reasons');
  return (
    <tr className="txt-s">
      <td>{data.get('osm_id')}</td>
      <td>{data.get('name')}</td>
      <td><Reasons reasons={data.get('reasons')} color="blue" /></td>
      <td>
        <span
          onClick={() => selectFeature(parseInt(data.get('osm_id'), 10))}
          className="cursor-pointer txt-bold txt-underline-on-hover mr6"
        >
          Map
        </span>
        <span className="cursor-pointer txt-bold txt-underline-on-hover">
          <a
            target="_blank"
            href={`https://localhost:8112/load_object?new_layer=true&objects=${data
              .getIn(['url'], '')
              .charAt(0)}${data.get('osm_id')}`}
          >
            JOSM
          </a>
        </span>
      </td>
    </tr>
  );
};

export function Features({
  properties,
  changesetId
}: {
  properties: Map<string, *>,
  changesetId: number
}) {
  const features: List<Map<string, *>> = properties.get('features');
  return (
    <div className="px12 py6">
      <div>
        <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">
          Flagged Features {features.size !== 0 ? `(${features.size})` : ''}
        </h2>
        {features.size === 0
          ? <div className="flex-parent flex-parent--column flex-parent--center-cross mb12">
              <svg className="icon icon--xxl color-darken25">
                <use xlinkHref="#icon-alert" />
              </svg>
              <p className="txt-m">{`No features were flagged for ${changesetId}.`}</p>
            </div>
          : <table className="table osmcha-custom-table my12">
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
