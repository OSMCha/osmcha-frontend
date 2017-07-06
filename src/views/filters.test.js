import React from 'react';
import { _Filters as Filters } from './filters';
import renderer from 'react-test-renderer';
import { fromJS } from 'immutable';
import { StaticRouter } from 'react-router';
import MockDate from 'mockdate';

beforeEach(() => {
  MockDate.set(1499224971614);
});

afterEach(() => {
  MockDate.reset();
});

test('renders correctly without filter', () => {
  const tree = renderer
    .create(
      <StaticRouter>
        <Filters
          filters={fromJS({})}
          location={{ search: '' }}
          lastChangesetID={49425586}
          applyFilters={() => {}}
        />
      </StaticRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
test('renders correctly with 1 filter', () => {
  const tree = renderer
    .create(
      <StaticRouter>
        <Filters
          filters={fromJS({
            reasons: [
              {
                label: 'mass modification',
                value: 1
              }
            ]
          })}
          location={{ search: '' }}
          lastChangesetID={49425586}
          applyFilters={() => {}}
        />
      </StaticRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
test('renders correctly with 2 filters', () => {
  const tree = renderer
    .create(
      <StaticRouter>
        <Filters
          filters={fromJS({
            reasons: [
              {
                label: 'mass modification',
                value: 1
              }
            ],
            checked: [
              {
                label: 'True',
                value: 'True'
              }
            ]
          })}
          location={{ search: '' }}
          lastChangesetID={49425586}
          applyFilters={() => {}}
        />
      </StaticRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly with 4 filters', () => {
  const tree = renderer
    .create(
      <StaticRouter>
        <Filters
          filters={fromJS({
            reasons: [
              {
                label: 'mass modification',
                value: 1
              },
              {
                label: 'new mapper edits',
                value: 6
              }
            ],
            checked: [
              {
                label: 'True',
                value: 'True'
              }
            ],
            date__gte: [
              {
                label: '2017-06-04',
                value: '2017-06-04'
              }
            ],
            is_suspect: [
              {
                label: 'True',
                value: 'True'
              }
            ]
          })}
          location={{ search: '' }}
          lastChangesetID={49425586}
          applyFilters={() => {}}
        />
      </StaticRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
