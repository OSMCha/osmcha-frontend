/* eslint-disable import/first */
jest.mock('lodash.debounce', () => {
  return fn => fn;
});

import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import { withFetchDataSilent } from '../fetch_data_enhancer';

describe('test fetch_data_enhancer HOC', () => {
  var TestComponent = () => (
    <div>
      <div>Test Component</div>
    </div>
  );
  it('should work correctly', async () => {
    var userDetailsProm = Promise.resolve({ test: 'userDetails' });
    var osmCommentsProm = Promise.resolve({ test: 'osmComments' });
    var cancelUserDetails = jest.fn();
    var cancelOsmComments = jest.fn();
    const Enhanced = withFetchDataSilent(
      props => ({
        userDetails: {
          promise: userDetailsProm,
          cancel: cancelUserDetails
        },
        osmComments: {
          promise: osmCommentsProm,
          cancel: cancelOsmComments
        }
      }),
      (nextProps, props) => props.changesetId !== nextProps.changesetId,
      TestComponent
    );
    var rendered = shallow(<Enhanced changesetId={331111} />, {
      lifecycleExperimental: true
    });
    await userDetailsProm.then(() => {
      expect(rendered.props().data).toEqual(
        fromJS({
          userDetails: { test: 'userDetails' },
          osmComments: { test: 'osmComments' }
        })
      );
    });
    rendered.unmount();
    // should call cancel on unmount
    expect(cancelUserDetails.mock.calls).toHaveLength(1);
    expect(cancelOsmComments.mock.calls).toHaveLength(1);
  });
});
