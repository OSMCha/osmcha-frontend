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
      .delay(100)
      .dispatch({
        type: AUTH.saveToken,
        token,
        code
      })
      .run();
    const { effects, storeState } = result;
    expect(effects.call).toHaveLength(5);
    expect(effects.put).toHaveLength(1);
    expect(effects.call[0]).toEqual(call(postTokensOSMCha));
    expect(effects.call[1]).toEqual(call(postFinalTokensOSMCha, code));
    const finalStore = fromJS({
      error: null,
      token,
      userDetails: null
    });
    expect(storeState).toEqual(finalStore);
    expect(result.toJSON()).toMatchSnapshot();
  });

  it('test watchAuth with token', async () => {
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
  it('test watchAuth without token', async () => {
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
  it('test watchauth should handle errors', async () => {
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
