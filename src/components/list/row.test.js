import React from 'react';
import renderer from 'react-test-renderer';
import { fromJS } from 'immutable';
import { StaticRouter } from 'react-router';
import { PrimaryLine } from './primary_line';
import { Row } from './row';
import MockDate from 'mockdate';

const changeset = fromJS({
  id: 49328744,
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-3.8867418, 15.0599119],
        [-3.874586, 15.0599119],
        [-3.874586, 15.0771946],
        [-3.8867418, 15.0771946],
        [-3.8867418, 15.0599119]
      ]
    ]
  },
  properties: {
    check_user: 'nammala',
    reasons: [
      { id: 4, name: 'mass deletion' },
      { id: 72, name: 'Randomized flag' }
    ],
    tags: [{ id: 1, name: 'intentional' }, { id: 2, name: 'unintentional' }],
    features: [
      {
        osm_id: 498804541,
        url: 'way-498804541',
        name: null,
        reasons: [{ id: 72, name: 'Randomized flag' }]
      }
    ],
    user: 'DaryR',
    uid: '4569402',
    editor: 'JOSM/1.5 (10966 en)',
    comment: '#hotosm-project-2999 #MissingMaps #EndMalaria #Mali',
    source:
      'tms[19]:http://{switch:a,b,c}.tiles.mapbox.com/v4/digitalglobe.316c9a2e/{zoom}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNqMmFxdGp5aTAwOWIzM3M1NDZ2eGU1a2QifQ.JN5adNxCwK_oprEwFEtjjg',
    imagery_used: 'Not reported',
    date: '2017-06-07T08:25:38Z',
    create: 1624,
    modify: 26,
    delete: 2666,
    area: 0.00021008504466001,
    is_suspect: true,
    harmful: true,
    checked: true,
    check_date: '2017-06-08T08:51:29.983657Z'
  }
});
it('renders PrimaryLine correctly', () => {
  MockDate.set(1497172627326);

  const tree = renderer
    .create(
      <PrimaryLine
        reasons={changeset.getIn(['properties', 'reasons'])}
        tags={changeset.getIn(['properties', 'tags'])}
        comment={changeset.getIn(['properties', 'comment'])}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
  MockDate.reset();
});

it('renders active row properly', () => {
  MockDate.set(1497172627326);

  const tree1 = renderer
    .create(
      <StaticRouter>
        <Row
          properties={changeset.getIn(['properties'])}
          active
          changesetId={changeset.getIn(['id'])}
          inputRef={() => {}}
        />
      </StaticRouter>
    )
    .toJSON();
  expect(tree1).toMatchSnapshot();
  MockDate.reset();
});

it('renders inactive row properly', () => {
  MockDate.set(1497172627326);

  const tree1 = renderer
    .create(
      <StaticRouter>
        <Row
          properties={changeset.getIn(['properties'])}
          active={false}
          changesetId={changeset.getIn(['id'])}
          inputRef={() => {}}
        />
      </StaticRouter>
    )
    .toJSON();
  expect(tree1).toMatchSnapshot();
  MockDate.reset();
});
