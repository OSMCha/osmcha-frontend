import { call, put, select } from 'redux-saga/effects';

import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { push } from 'react-router-redux';
import { validateFilters, getDefaultFromDate } from '../utils/filters';

import { fromJS, Map } from 'immutable';
import { delay } from 'redux-saga';

import { modal } from './modal_actions';

import {
  action,
  filtersSaga,
  validateFiltersSaga,
  fetchChangesetsPageSaga,
  modifyChangesetPageSaga,
  locationSelector,
  filtersAndPageIndexSelector,
  currentPageAndIndexSelector,
  tokenSelector,
  FILTERS,
  CHANGESETS_PAGE
} from './changesets_page_actions';
import { fetchChangesetsPage } from '../network/changesets_page';

describe('changesets_page filtersSaga', () => {
  const newFilters = fromJS({
    date__gte: [
      {
        label: '2017-06-28',
        value: '2017-06-28'
      }
    ],
    is_suspect: [
      {
        label: 'Yes',
        value: 'True'
      }
    ],
    reasons: [
      {
        label: 'possible import',
        value: 3
      }
    ],
    harmful: [
      {
        label: 'Show Bad only',
        value: 'True'
      }
    ],
    modify__gte: [
      {
        label: '0',
        value: '0'
      }
    ]
  });
  const location = {
    pathname: '/filters',
    search: '',
    hash: '',
    key: 'zyi6uj'
  };
  const newLocation = {
    pathname: '/',
    search:
      'filters=%7B%22date__gte%22%3A%5B%7B%22label%22%3A%222017-06-28%22%2C%22value%22%3A%222017-06-28%22%7D%5D%2C%22is_suspect%22%3A%5B%7B%22label%22%3A%22Yes%22%2C%22value%22%3A%22True%22%7D%5D%2C%22reasons%22%3A%5B%7B%22label%22%3A%22possible%20import%22%2C%22value%22%3A3%7D%5D%2C%22harmful%22%3A%5B%7B%22label%22%3A%22Show%20Bad%20only%22%2C%22value%22%3A%22True%22%7D%5D%2C%22modify__gte%22%3A%5B%7B%22label%22%3A%220%22%2C%22value%22%3A%220%22%7D%5D%7D',
    hash: '',
    key: 'zyi6uj'
  };
  it('resetting of filters', async () => {
    return await expectSaga(filtersSaga, { filters: Map() })
      .provide([[select(locationSelector), location]])
      .put(
        push({
          pathname: '/filters',
          search: '',
          hash: '',
          key: 'zyi6uj'
        })
      )
      .put(
        action(FILTERS.set, {
          filters: getDefaultFromDate()
        })
      )
      .put.actionType(CHANGESETS_PAGE.fetch)
      .run();
  });
  it('applying new filter', async () => {
    return await expectSaga(filtersSaga, {
      filters: newFilters,
      pathname: '/'
    })
      .provide([[select(locationSelector), location]])
      .put(push(newLocation))
      .put(
        action(FILTERS.set, {
          filters: newFilters
        })
      )
      .put.actionType(CHANGESETS_PAGE.fetch)
      .run();
  });
});

describe('changesets_page validateFiltersSaga', () => {
  const newFilters = fromJS({
    date__gte: [
      {
        label: '2017-06-28',
        value: '2017-06-28'
      }
    ],
    is_suspect: [
      {
        label: 'Yes',
        value: 'True'
      }
    ],
    reasons: [
      {
        label: 'possible import',
        value: 3
      }
    ],
    harmful: [
      {
        label: 'Show Bad only',
        value: 'True'
      }
    ],
    modify__gte: [
      {
        label: '0',
        value: '0'
      }
    ]
  });
  const location = {
    pathname: '/filters',
    search: '',
    hash: '',
    key: 'zyi6uj'
  };
  const newLocation = {
    pathname: '/',
    search:
      'filters=%7B%22date__gte%22%3A%5B%7B%22label%22%3A%222017-06-28%22%2C%22value%22%3A%222017-06-28%22%7D%5D%2C%22is_suspect%22%3A%5B%7B%22label%22%3A%22Yes%22%2C%22value%22%3A%22True%22%7D%5D%2C%22reasons%22%3A%5B%7B%22label%22%3A%22possible%20import%22%2C%22value%22%3A3%7D%5D%2C%22harmful%22%3A%5B%7B%22label%22%3A%22Show%20Bad%20only%22%2C%22value%22%3A%22True%22%7D%5D%2C%22modify__gte%22%3A%5B%7B%22label%22%3A%220%22%2C%22value%22%3A%220%22%7D%5D%7D',
    hash: '',
    key: 'zyi6uj'
  };
  it('validates correctly a valid filter', async () => {
    return await expectSaga(validateFiltersSaga, newFilters)
      .returns(newFilters)
      .run();
  });
  it('invalidates an invalid filter', async () => {
    const invalidFilter = newFilters.setIn(['date__gte'], null);
    return await expectSaga(validateFiltersSaga, invalidFilter)
      .provide([[select(locationSelector), location]])
      // .returns(newFilters)
      .returns(getDefaultFromDate())
      .run();
  });
  it('invalidates an invalid filter 2', async () => {
    const invalidFilter = newFilters.setIn(
      ['date__gte'],
      fromJS([
        {
          labe: '',
          value: 3
        }
      ])
    );
    return await expectSaga(validateFiltersSaga, invalidFilter)
      .provide([[select(locationSelector), location]])
      // .returns(newFilters)
      .returns(getDefaultFromDate())
      .run();
  });
});

describe('changesets_page fetchChangesetsPageSaga', () => {
  const token = '2d2289bd78985b2b46af29607ee50fa37cb1723a';
  const filters = fromJS({
    date__gte: [
      {
        label: '2017-06-28',
        value: '2017-06-28'
      }
    ],
    is_suspect: [
      {
        label: 'Yes',
        value: 'True'
      }
    ],
    modify__gte: [
      {
        label: '0',
        value: '0'
      }
    ]
  });
  const payload = `{"type":"FeatureCollection","count":2,"next":null,"previous":null,"features":[{"id":50052312,"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[1.5862644,48.5788668],[1.6081769,48.5788668],[1.6081769,48.5963037],[1.5862644,48.5963037],[1.5862644,48.5788668]]]},"properties":{"check_user":"kepta","reasons":[{"id":2,"name":"suspect_word"}],"tags":[],"features":[],"user":"vincentxavier","uid":"15739","editor":"JOSM/1.5 (12145 SVN fr)","comment":"Osmose fix","source":"Relevé de terrain","imagery_used":"Not reported","date":"2017-07-05T08:16:18Z","create":0,"modify":1,"delete":0,"area":0.000382086071249997,"is_suspect":true,"harmful":false,"checked":true,"check_date":"2017-07-05T08:24:21.066836Z"}},{"id":50050252,"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[30.6490382,-17.8805404],[30.6495366,-17.8805404],[30.6495366,-17.8801242],[30.6490382,-17.8801242],[30.6490382,-17.8805404]]]},"properties":{"check_user":"kepta","reasons":[{"id":2,"name":"suspect_word"}],"tags":[],"features":[],"user":"marthaleena","uid":"5659851","editor":"JOSM/1.5 (12450 en)","comment":"Fixing the overlapping and crossing buildings in Zimbabwe, HOT task (https://osmlab.github.io/to-fix/#/task/crossingbuildinginzimbabwe)","source":"ZIMBAMBWE","imagery_used":"Not reported","date":"2017-07-05T06:39:41Z","create":2,"modify":6,"delete":1,"area":2.07434080000649e-07,"is_suspect":true,"harmful":false,"checked":true,"check_date":"2017-07-05T06:45:08.594769Z"}}]}`;
  it('follows correct async flow', async () => {
    var result = await expectSaga(fetchChangesetsPageSaga, 0)
      .provide([
        [select(filtersAndPageIndexSelector), [filters, 0]],
        [select(tokenSelector), token],
        [matchers.call.fn(fetchChangesetsPage), JSON.parse(payload)],
        [matchers.call.fn(validateFiltersSaga), filters]
      ])
      .put(
        action(CHANGESETS_PAGE.fetched, {
          data: fromJS(JSON.parse(payload)),
          pageIndex: 0
        })
      )
      .put.actionType(CHANGESETS_PAGE.loading)
      .run();
    const { effects } = result;
    expect(effects.call[0]).toEqual(call(validateFiltersSaga, filters));
    expect(effects.call[1]).toEqual(
      call(fetchChangesetsPage, 0, filters, token, undefined)
    );
  });

  it('follows correct async flow when error is thrown', async () => {
    return await expectSaga(fetchChangesetsPageSaga, 0, true)
      .provide([
        [select(filtersAndPageIndexSelector), [filters, 0]],
        [select(tokenSelector), token],
        [matchers.call.fn(fetchChangesetsPage), throwError(new Error('error'))],
        [matchers.call.fn(validateFiltersSaga), filters]
      ])
      .put.actionType(CHANGESETS_PAGE.error)
      .put.actionType('INIT_MODAL')
      .run();
  });
});

describe('changesets_page modifyChangesetPageSaga', () => {
  const changesetId = 50052312;
  const changeset = fromJS(
    JSON.parse(
      `{"id":50052312,"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[1.5862644,48.5788668],[1.6081769,48.5788668],[1.6081769,48.5963037],[1.5862644,48.5963037],[1.5862644,48.5788668]]]},"properties":{"check_user":"kepta","reasons":[{"id":2,"name":"suspect_word"}],"tags":[],"features":[],"user":"vincentxavier","uid":"15739","editor":"JOSM/1.5 (12145 SVN fr)","comment":"Osmose fix","source":"Relevé de terrain","imagery_used":"Not reported","date":"2017-07-05T08:16:18Z","create":0,"modify":1,"delete":0,"area":0.000382086071249997,"is_suspect":true,"harmful":false,"checked":true,"check_date":"2017-07-05T08:24:21.066836Z"}}`
    )
  );
  const changesetPage = fromJS(
    JSON.parse(
      `{"type":"FeatureCollection","count":2,"next":null,"previous":null,"features":[{"id":50052312,"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[1.5862644,48.5788668],[1.6081769,48.5788668],[1.6081769,48.5963037],[1.5862644,48.5963037],[1.5862644,48.5788668]]]},"properties":{"check_user":"kepta","reasons":[{"id":2,"name":"suspect_word"}],"tags":[],"features":[],"user":"vincentxavier","uid":"15739","editor":"JOSM/1.5 (12145 SVN fr)","comment":"Osmose fix","source":"Relevé de terrain","imagery_used":"Not reported","date":"2017-07-05T08:16:18Z","create":0,"modify":1,"delete":0,"area":0.000382086071249997,"is_suspect":true,"harmful":false,"checked":true,"check_date":"2017-07-05T08:24:21.066836Z"}},{"id":50050252,"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[30.6490382,-17.8805404],[30.6495366,-17.8805404],[30.6495366,-17.8801242],[30.6490382,-17.8801242],[30.6490382,-17.8805404]]]},"properties":{"check_user":"kepta","reasons":[{"id":2,"name":"suspect_word"}],"tags":[],"features":[],"user":"marthaleena","uid":"5659851","editor":"JOSM/1.5 (12450 en)","comment":"Fixing the overlapping and crossing buildings in Zimbabwe, HOT task (https://osmlab.github.io/to-fix/#/task/crossingbuildinginzimbabwe)","source":"ZIMBAMBWE","imagery_used":"Not reported","date":"2017-07-05T06:39:41Z","create":2,"modify":6,"delete":1,"area":2.07434080000649e-07,"is_suspect":true,"harmful":false,"checked":true,"check_date":"2017-07-05T06:45:08.594769Z"}}]}`
    )
  );
  it('follows correct async flow', async () => {
    const newChangeset = changeset.setIn(['properties', 'checked'], false);
    const newChangesetPage = changesetPage.setIn(['features', 0], newChangeset);
    return await expectSaga(modifyChangesetPageSaga, {
      changesetId,
      changeset: newChangeset
    })
      .provide([[select(currentPageAndIndexSelector), [changesetPage, 0]]])
      .put(action(CHANGESETS_PAGE.checkNew))
      .put(
        action(CHANGESETS_PAGE.fetched, {
          data: newChangesetPage,
          pageIndex: 0
        })
      )
      .run();
  });
});
