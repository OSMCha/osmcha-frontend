// @flow
import React from 'react';
import { Map, List } from 'immutable';
import { Reasons } from '../reasons';

const Feature = ({
  data,
  changesetReasons,
  setHighlight,
  zoomToAndSelect
}: {
  data: Map<string, any>,
  changesetReasons: Map<string, any>,
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void,
  zoomToAndSelect: (type: string, id: number) => void
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
            <Reasons
              reasons={reasons}
              userFlag={data.get('user_flag')}
              underline={true}
              color="blue"
            />
          </abbr>
        ) : (
          <Reasons
            reasons={reasons}
            color="blue"
            userFlag={data.get('user_flag')}
          />
        )}
      </td>
      <td>
        <span
          className="cursor-pointer txt-underline-on-hover txt-bold mr6"
          role="button"
          tabIndex="0"
          onMouseEnter={() =>
            setHighlight(data.get('type'), data.get('id'), true)
          }
          onMouseLeave={() =>
            setHighlight(data.get('type'), data.get('id'), false)
          }
          onFocus={() => setHighlight(data.get('type'), data.get('id'), true)}
          onBlur={() => setHighlight(data.get('type'), data.get('id'), false)}
          onClick={() => zoomToAndSelect(data.get('type'), data.get('id'))}
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
  changesetId,
  setHighlight,
  zoomToAndSelect
}: {
  properties: Map<string, *>,
  changesetId: number,
  setHighlight: (type: string, id: number, isHighlighted: boolean) => void,
  zoomToAndSelect: (type: string, id: number) => void
}) {
  let features: List<Map<string, *>> = properties.get('features');
  const reviewedFeatures: List<Map<string, *>> = properties
    .get('reviewed_features')
    .map(feature =>
      Map({
        url: feature.get('id'),
        user_flag: `Flagged by ${feature.get('user')}`,
        osm_id: feature.get('id').split('-')[1],
        reasons: []
      })
    );
  const reviewedIds = reviewedFeatures.map(feature => feature.get('url'));
  const featuresIds = features.map(feature => feature.get('url'));
  const intersection = features
    .filter(feature => reviewedIds.includes(feature.get('url')))
    .map((feature, k) => [k, feature.get('url')]);
  intersection.forEach(item => {
    features = features.setIn(
      [item[0], 'user_flag'],
      reviewedFeatures.find(f => f.get('url') === item[1]).get('user_flag')
    );
  });
  features = features.concat(
    reviewedFeatures.filter(
      feature => !featuresIds.includes(feature.get('url'))
    )
  );

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
                  setHighlight={setHighlight}
                  zoomToAndSelect={zoomToAndSelect}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
