import React from 'react';
import { fromJS, Map } from 'immutable';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { StaticRouter } from 'react-router';
import MockDate from 'mockdate';
import { loadingEnhancer } from '../loading_enhancer';
import { Loading } from '../loading';

describe('test fetch_data_enhancer HOC', () => {
  var TestComponent = () =>
    <div>
      <div>Test Component</div>
    </div>;
  it('should work correctly loading=true', async () => {
    const Enhanced = loadingEnhancer(TestComponent);
    var rendered = shallow(<Enhanced loading={true} />, {
      lifecycleExperimental: true
    });
    expect(rendered.find(Loading)).toHaveLength(1);
  });
  it('should work correctly', async () => {
    const Enhanced = loadingEnhancer(TestComponent);
    var rendered = shallow(<Enhanced loading={false} />, {
      lifecycleExperimental: true
    });
    expect(rendered.find(Loading)).toHaveLength(0);
  });
});
