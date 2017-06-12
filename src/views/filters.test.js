import React from 'react';
import { _Filters as Filters } from './filters';
import renderer from 'react-test-renderer';
import { fromJS } from 'immutable';
import { StaticRouter } from 'react-router';
it('renders correctly without filter', () => {
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
it('renders correctly with 1 filter', () => {
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
it('renders correctly with 2 filters', () => {
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
            checked: {
              label: 'True',
              value: 'True'
            }
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
