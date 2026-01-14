import { fromJS } from "immutable";
import { call, select } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import * as matchers from "redux-saga-test-plan/matchers";
import { throwError } from "redux-saga-test-plan/providers";
import { fetchChangesetsPage } from "../../network/changesets_page";
import {
  action,
  aoiIdSelector,
  CHANGESETS_PAGE,
  currentPageAndIndexSelector,
  fetchChangesetsPageSaga,
  modifyChangesetPageSaga,
  pageIndexSelector,
  tokenSelector,
} from "../changesets_page_actions";
import { filtersSelector } from "../filters_actions";

describe("changesets_page fetchChangesetsPageSaga", () => {
  const token = "2d2289bd78985b2b46af29607ee50fa37cb1723a";
  const filters = fromJS({
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
    modify__gte: [
      {
        label: "0",
        value: "0",
      },
    ],
  });
  const payload =
    '{"type":"FeatureCollection","count":2,"next":null,"previous":null,"features":[{"id":50052312,"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[1.5862644,48.5788668],[1.6081769,48.5788668],[1.6081769,48.5963037],[1.5862644,48.5963037],[1.5862644,48.5788668]]]},"properties":{"check_user":"kepta","reasons":[{"id":2,"name":"suspect_word"}],"tags":[],"features":[],"user":"vincentxavier","uid":"15739","editor":"JOSM/1.5 (12145 SVN fr)","comment":"Osmose fix","source":"Relevé de terrain","imagery_used":"Not reported","date":"2017-07-05T08:16:18Z","create":0,"modify":1,"delete":0,"area":0.000382086071249997,"is_suspect":true,"harmful":false,"checked":true,"check_date":"2017-07-05T08:24:21.066836Z"}},{"id":50050252,"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[30.6490382,-17.8805404],[30.6495366,-17.8805404],[30.6495366,-17.8801242],[30.6490382,-17.8801242],[30.6490382,-17.8805404]]]},"properties":{"check_user":"kepta","reasons":[{"id":2,"name":"suspect_word"}],"tags":[],"features":[],"user":"marthaleena","uid":"5659851","editor":"JOSM/1.5 (12450 en)","comment":"Fixing the overlapping and crossing buildings in Zimbabwe, HOT task (https://osmlab.github.io/to-fix/#/task/crossingbuildinginzimbabwe)","source":"ZIMBAMBWE","imagery_used":"Not reported","date":"2017-07-05T06:39:41Z","create":2,"modify":6,"delete":1,"area":2.07434080000649e-07,"is_suspect":true,"harmful":false,"checked":true,"check_date":"2017-07-05T06:45:08.594769Z"}}]}';
  it("follows correct async flow", async () => {
    var result = await expectSaga(fetchChangesetsPageSaga, 0)
      .provide([
        [select(filtersSelector), filters],
        [select(pageIndexSelector), 0],
        [select(aoiIdSelector), null],
        [select(tokenSelector), token],
        [matchers.call.fn(fetchChangesetsPage), JSON.parse(payload)],
        // [matchers.call.fn(validateFiltersSaga), filters]
      ])
      .put(
        action(CHANGESETS_PAGE.fetched, {
          data: fromJS(JSON.parse(payload)),
          pageIndex: 0,
        }),
      )
      .put.actionType(CHANGESETS_PAGE.loading)
      .run();
    const { effects } = result;
    expect(effects.call[0]).toEqual(
      call(fetchChangesetsPage, 0, filters, token, undefined),
    );
  });

  it("follows correct async flow when error is thrown", async () => {
    return await expectSaga(fetchChangesetsPageSaga, 0, true)
      .provide([
        [select(filtersSelector), filters],
        [select(pageIndexSelector), 0],
        [select(aoiIdSelector), null],
        [select(tokenSelector), token],
        [matchers.call.fn(fetchChangesetsPage), throwError(new Error("error"))],
        // [matchers.call.fn(validateFiltersSaga), filters]
      ])
      .put.actionType(CHANGESETS_PAGE.error)
      .put.actionType("INIT_MODAL")
      .run();
  });
});

describe("changesets_page modifyChangesetPageSaga", () => {
  const changesetId = 50052312;
  const changeset = fromJS(
    JSON.parse(
      '{"id":50052312,"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[1.5862644,48.5788668],[1.6081769,48.5788668],[1.6081769,48.5963037],[1.5862644,48.5963037],[1.5862644,48.5788668]]]},"properties":{"check_user":"kepta","reasons":[{"id":2,"name":"suspect_word"}],"tags":[],"features":[],"user":"vincentxavier","uid":"15739","editor":"JOSM/1.5 (12145 SVN fr)","comment":"Osmose fix","source":"Relevé de terrain","imagery_used":"Not reported","date":"2017-07-05T08:16:18Z","create":0,"modify":1,"delete":0,"area":0.000382086071249997,"is_suspect":true,"harmful":false,"checked":true,"check_date":"2017-07-05T08:24:21.066836Z"}}',
    ),
  );
  const changesetPage = fromJS(
    JSON.parse(
      '{"type":"FeatureCollection","count":2,"next":null,"previous":null,"features":[{"id":50052312,"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[1.5862644,48.5788668],[1.6081769,48.5788668],[1.6081769,48.5963037],[1.5862644,48.5963037],[1.5862644,48.5788668]]]},"properties":{"check_user":"kepta","reasons":[{"id":2,"name":"suspect_word"}],"tags":[],"features":[],"user":"vincentxavier","uid":"15739","editor":"JOSM/1.5 (12145 SVN fr)","comment":"Osmose fix","source":"Relevé de terrain","imagery_used":"Not reported","date":"2017-07-05T08:16:18Z","create":0,"modify":1,"delete":0,"area":0.000382086071249997,"is_suspect":true,"harmful":false,"checked":true,"check_date":"2017-07-05T08:24:21.066836Z"}},{"id":50050252,"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[30.6490382,-17.8805404],[30.6495366,-17.8805404],[30.6495366,-17.8801242],[30.6490382,-17.8801242],[30.6490382,-17.8805404]]]},"properties":{"check_user":"kepta","reasons":[{"id":2,"name":"suspect_word"}],"tags":[],"features":[],"user":"marthaleena","uid":"5659851","editor":"JOSM/1.5 (12450 en)","comment":"Fixing the overlapping and crossing buildings in Zimbabwe, HOT task (https://osmlab.github.io/to-fix/#/task/crossingbuildinginzimbabwe)","source":"ZIMBAMBWE","imagery_used":"Not reported","date":"2017-07-05T06:39:41Z","create":2,"modify":6,"delete":1,"area":2.07434080000649e-07,"is_suspect":true,"harmful":false,"checked":true,"check_date":"2017-07-05T06:45:08.594769Z"}}]}',
    ),
  );
  it("follows correct async flow", async () => {
    const newChangeset = changeset.setIn(["properties", "checked"], false);
    const newChangesetPage = changesetPage.setIn(["features", 0], newChangeset);
    return await expectSaga(modifyChangesetPageSaga, {
      changesetId,
      changeset: newChangeset,
    })
      .provide([[select(currentPageAndIndexSelector), [changesetPage, 0]]])
      .put(action(CHANGESETS_PAGE.checkNew))
      .put(
        action(CHANGESETS_PAGE.fetched, {
          data: newChangesetPage,
          pageIndex: 0,
        }),
      )
      .run();
  });
});
