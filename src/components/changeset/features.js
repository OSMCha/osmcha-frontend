// @flow
import React from 'react';
import { Map, List } from 'immutable';
import { Reasons } from '../reasons';
import { selectFeature } from '../../views/map';

const Feature = ({
  data,
  changesetReasons
}: {
  data: Map<string, any>,
  changesetReasons: Map<string, any>
}) => {
  let reasons;
  // operation necessary to the change
  if (
    data.get('reasons').size &&
    typeof data.get('reasons').get(0) === 'number'
  ) {
    reasons = changesetReasons.filter(reason =>
      data.get('reasons').contains(reason.get('id'))
    );
  } else {
    reasons = data.get('reasons');
  }
  return (
    <tr className="txt-s">
      <td>{data.get('osm_id')}</td>
      <td>{data.get('name')}</td>
      <td>
        {data.get('note') ? (
          <abbr title={data.get('note')}>
            <Reasons reasons={reasons} underline={true} color="blue" />
          </abbr>
        ) : (
          <Reasons reasons={reasons} color="blue" />
        )}
      </td>
      <td>
        <span
          className="cursor-pointer txt-underline-on-hover txt-bold mr6"
          role="button"
          tabIndex="0"
          onFocus={() => selectFeature(parseInt(data.get('osm_id'), 10))}
        >
          Map
        </span>
        <strong className="cursor-pointer txt-underline-on-hover">
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`http://localhost:8111/load_object?objects=${data
              .getIn(['url'], '')
              .charAt(0)}${data.get('osm_id')}`}
          >
            JOSM
          </a>
        </strong>
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
          Flagged Features
          {features.size > 0 && (
            <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
              {features.size}
            </strong>
          )}
        </h2>
        {features.size === 0 ? (
          <div className="flex-parent flex-parent--column flex-parent--center-cross mb12">
            <svg className="icon icon--xxl color-darken25">
              <use xlinkHref="#icon-alert" />
            </svg>
            <p className="txt-m">{`No features were flagged for ${changesetId}.`}</p>
          </div>
        ) : (
          <table className="table osmcha-custom-table my12">
            <thead>
              <tr className="txt-s txt-uppercase">
                <th>OSM Id</th>
                <th>Name</th>
                <th>Reasons</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, k) => (
                <Feature
                  key={k}
                  data={f}
                  changesetReasons={properties.get('reasons')}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
