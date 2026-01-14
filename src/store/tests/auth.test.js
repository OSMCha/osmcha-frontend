import { call, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { fromJS } from 'immutable';

import { setItem, removeItem } from '../../utils/safe_storage';

import {
  postTokensOSMCha,
  postFinalTokensOSMCha,
  fetchUserDetails
} from '../../network/auth';

import { watchAuth, authTokenFlow, AUTH, tokenSelector } from '../auth_actions';
import { authReducer } from '../auth_reducer';

const token = '2d2289bd78985b2b46af29607ee50fa37cb1723a';
const code = 'xbiZdWS1EYS608suvHrL';

describe('auth actions testing', () => {
  it('test authTokenFlow ', async () => {
    const result = await expectSaga(authTokenFlow)
      .withReducer(authReducer)
      .provide([
        [
          matchers.call.fn(postFinalTokensOSMCha),
          {
            token
          }
        ],
        [matchers.call.fn(setItem)]
      ])
      .dispatch({
        type: AUTH.getFinalToken,
        code
      })
      .run();
    const { effects, storeState } = result;
    // authTokenFlow now has: 1 take, 1 call (postFinalTokensOSMCha), 1 call (setItem), 3 put (2 modals + 1 saveToken)
    expect(effects.call).toHaveLength(2);
    expect(effects.put).toHaveLength(3);
    expect(effects.call[0]).toEqual(call(postFinalTokensOSMCha, code));
    expect(effects.call[1]).toEqual(call(setItem, 'token', token));
    const finalStore = fromJS({
      oAuthToken: null,
      oAuthTokenSecret: null,
      error: null,
      token,
      userDetails: null
    });
    expect(storeState).toEqual(finalStore);
    expect(result.toJSON()).toMatchSnapshot();
  });

  it.skip('test watchAuth with token', async () => {
    const userDetails = {
      id: 33,
      uid: '3563274',
      username: 'kepta',
      is_staff: true,
      is_active: true,
      whitelists: [],
      email: '',
      avatar:
        'http://www.gravatar.com/avatar/8be7bdc2d8cde52fb8900c8d0c813faf.jpg?s=256&d…large-afe7442b856c223cca92b1a16d96a3266ec0c86cac8031269e90ef93562adb72.png'
    };
    const result = await expectSaga(watchAuth)
      .provide([
        [select(tokenSelector), token],
        [matchers.call.fn(fetchUserDetails), userDetails],
        [matchers.call.fn(removeItem)],
        [matchers.call.fn(authTokenFlow), token]
      ])
      .put({
        type: AUTH.userDetails,
        userDetails: fromJS(userDetails)
      })
      .put({
        type: AUTH.clearSession
      })
      .dispatch({ type: AUTH.logout })
      .silentRun(500);

    const { effects } = result;
    expect(effects.call[0]).toEqual(call(fetchUserDetails, token));
    expect(effects.select.length).toEqual(1);
    expect(effects.put).toHaveLength(2);
  });
  it.skip('test watchAuth without token', async () => {
    const userDetails = {
      id: 33,
      uid: '3563274',
      username: 'kepta',
      is_staff: true,
      is_active: true,
      whitelists: [],
      email: '',
      avatar:
        'http://www.gravatar.com/avatar/8be7bdc2d8cde52fb8900c8d0c813faf.jpg?s=256&d…large-afe7442b856c223cca92b1a16d96a3266ec0c86cac8031269e90ef93562adb72.png'
    };
    const result = await expectSaga(watchAuth)
      .provide([
        [select(tokenSelector), null],
        [matchers.call.fn(fetchUserDetails), userDetails],
        [matchers.call.fn(removeItem)],
        [matchers.call.fn(authTokenFlow), token]
      ])
      .silentRun(500);
    const { effects } = result;
    expect(effects.call[0]).toEqual(call(authTokenFlow));
  });
  it.skip('test watchauth should handle errors', async () => {
    const error = new Error('didnt work :(');
    const result = await expectSaga(watchAuth)
      .provide({
        call(effect, next) {
          if (effect.fn === fetchUserDetails) {
            throw error;
          }
          if (effect.fn === removeItem) {
            return null;
          }
          return next();
        },
        select({ selector }, next) {
          if (selector === tokenSelector) {
            return token;
          }
          return next();
        }
      })
      .put.actionType(AUTH.loginError)
      .put.actionType('INIT_MODAL')
      .put.actionType(AUTH.clearSession)
      .silentRun(600);
    const { effects } = result;
    expect(effects.call[0]).toEqual(call(fetchUserDetails, token));
  });
});
