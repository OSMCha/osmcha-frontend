import { fromJS, Map } from "immutable";
import { expectSaga } from "redux-saga-test-plan";

import {
  action,
  CHANGESETS_PAGE,
  FILTERS,
  filtersSaga,
} from "../filters_actions";

describe("filters", () => {
  const newFilters = fromJS({
    date__gte: [
      {
        label: "2017-06-28",
        value: "2017-06-28",
      },
    ],
    is_suspect: [
      {
        label: "Yes",
        value: "True",
      },
    ],
    reasons: [
      {
        label: "possible import",
        value: 3,
      },
    ],
    harmful: [
      {
        label: "Show Bad only",
        value: "True",
      },
    ],
    modify__gte: [
      {
        label: "0",
        value: "0",
      },
    ],
  });
  const location = {
    pathname: "/filters",
    search: "",
    hash: "",
    key: "zyi6uj",
  };
  const newLocation = {
    pathname: "/",
    search:
      "filters=%7B%22date__gte%22%3A%5B%7B%22label%22%3A%222017-06-28%22%2C%22value%22%3A%222017-06-28%22%7D%5D%2C%22is_suspect%22%3A%5B%7B%22label%22%3A%22Yes%22%2C%22value%22%3A%22True%22%7D%5D%2C%22reasons%22%3A%5B%7B%22label%22%3A%22possible%20import%22%2C%22value%22%3A3%7D%5D%2C%22harmful%22%3A%5B%7B%22label%22%3A%22Show%20Bad%20only%22%2C%22value%22%3A%22True%22%7D%5D%2C%22modify__gte%22%3A%5B%7B%22label%22%3A%220%22%2C%22value%22%3A%220%22%7D%5D%7D",
    hash: "",
    key: "zyi6uj",
  };
  it(" x resetting of filters", async () => {
    return await expectSaga(filtersSaga, location)
      .put(
        action(FILTERS.set, {
          filters: Map(),
        }),
      )
      .put.actionType(CHANGESETS_PAGE.fetch)
      .run();
  });
  it("applying new filter", async () => {
    return await expectSaga(filtersSaga, newLocation)
      // .provide([[select(locationSelector), location]])
      // .put(push(newLocation))
      .put(
        action(FILTERS.set, {
          filters: newFilters,
        }),
      )
      .put.actionType(CHANGESETS_PAGE.fetch)
      .run();
  });
});

// convert to unit test for validateFilters
// describe.skip(' validateFiltersSaga', () => {
//   const newFilters = fromJS({
//     date__gte: [
//       {
//         label: '2017-06-28',
//         value: '2017-06-28'
//       }
//     ],
//     is_suspect: [
//       {
//         label: 'Yes',
//         value: 'True'
//       }
//     ],
//     reasons: [
//       {
//         label: 'possible import',
//         value: 3
//       }
//     ],
//     harmful: [
//       {
//         label: 'Show Bad only',
//         value: 'True'
//       }
//     ],
//     modify__gte: [
//       {
//         label: '0',
//         value: '0'
//       }
//     ]
//   });
//   const location = {
//     pathname: '/filters',
//     search: '',
//     hash: '',
//     key: 'zyi6uj'
//   };
//   const newLocation = {
//     pathname: '/',
//     search:
//       'filters=%7B%22date__gte%22%3A%5B%7B%22label%22%3A%222017-06-28%22%2C%22value%22%3A%222017-06-28%22%7D%5D%2C%22is_suspect%22%3A%5B%7B%22label%22%3A%22Yes%22%2C%22value%22%3A%22True%22%7D%5D%2C%22reasons%22%3A%5B%7B%22label%22%3A%22possible%20import%22%2C%22value%22%3A3%7D%5D%2C%22harmful%22%3A%5B%7B%22label%22%3A%22Show%20Bad%20only%22%2C%22value%22%3A%22True%22%7D%5D%2C%22modify__gte%22%3A%5B%7B%22label%22%3A%220%22%2C%22value%22%3A%220%22%7D%5D%7D',
//     hash: '',
//     key: 'zyi6uj'
//   };
//   it('validates correctly a valid filter', async () => {
//     return await expectSaga(validateFiltersSaga, newFilters)
//       .returns()
//       .run();
//   });
//   it('invalidates an invalid filter', async () => {
//     const invalidFilter = newFilters.setIn(['date__gte'], null);
//     return await expectSaga(validateFiltersSaga, invalidFilter)
//       .provide([[select(locationSelector), location]])
//       // .returns(newFilters)
//       .put(push(location))
//       .put.actionType('INIT_MODAL')
//       .returns()
//       .run();
//   });
//   it('invalidates an invalid filter 2', async () => {
//     const invalidFilter = newFilters.setIn(
//       ['date__gte'],
//       fromJS([
//         {
//           labe: '',
//           value: 3
//         }
//       ])
//     );
//     return await expectSaga(validateFiltersSaga, invalidFilter)
//       .provide([[select(locationSelector), location]])
//       // .returns(newFilters)
//       .put(push(location))
//       .put.actionType('INIT_MODAL')
//       .run();
//   });
// });
