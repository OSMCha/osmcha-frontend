import React from 'react';
import { fromJS, Map } from 'immutable';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { StaticRouter } from 'react-router';
import MockDate from 'mockdate';
import { _Changeset } from '../changeset/index';
import { keyboardToggleEnhancer } from '../keyboard_enhancer';
import { delayPromise } from '../../utils/promise';

import {
  CHANGESET_DETAILS_DETAILS,
  CHANGESET_DETAILS_SUSPICIOUS,
  CHANGESET_DETAILS_USER,
  CHANGESET_DETAILS_DISCUSSIONS,
  CHANGESET_DETAILS_MAP
} from '../../config/bindings';

jest.mock('mousetrap', () => ({
  bind: jest.fn(),
  unbind: jest.fn()
}));

var moustrap = require('mousetrap');

describe('test keyboard_enhancer HOC', () => {
  var TestComponent = () =>
    <div>
      <div>Test Component</div>
    </div>;
  it('should work correctly', async () => {
    const strokes = [
      CHANGESET_DETAILS_DETAILS,
      CHANGESET_DETAILS_SUSPICIOUS,
      CHANGESET_DETAILS_USER,
      CHANGESET_DETAILS_DISCUSSIONS,
      CHANGESET_DETAILS_MAP
    ];
    const Enhanced = keyboardToggleEnhancer(true, strokes, TestComponent);
    var rendered = shallow(<Enhanced changesetId={331111} />, {
      lifecycleExperimental: true
    });
    expect(moustrap.bind.mock.calls).toHaveLength(5);
    rendered.unmount();
    expect(moustrap.unbind.mock.calls).toHaveLength(
      strokes.reduce((sum, x) => sum + x.bindings.length, 0)
    );
  });
});
