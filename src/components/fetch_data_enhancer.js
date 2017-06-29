// @flow
import React from 'react';
import { Map, fromJS } from 'immutable';

import { cancelablePromise } from '../utils/promise';
import { getDisplayName } from '../utils/component';

// If any network request fails it silents it
// It also set states on first come first serve
// basis.
// @onUpdate a function which is equivalent to shouldComponentUpdate
// on which fetching should rework
export function withFetchDataSilent(
  dataToFetch: Object,
  onUpdate: (nextProps: Object, props: Object) => boolean,
  WrappedComponent: Class<React.PureComponent<*, *, *>>
) {
  class FetchDataEnhancer extends React.PureComponent {
    state = {
      data: Map()
    };
    static displayName = `HOCFetchData${getDisplayName(WrappedComponent)}`;
    promises: Array<*>;
    componentDidMount() {
      this.initFetching(this.props);
    }

    componentWillReceiveProps(nextProps: Object) {
      if (onUpdate(nextProps, this.props)) {
        this.initFetching(nextProps);
      }
    }
    initFetching(props: Object) {
      console.log('initialize fetching');
      const keys = Object.keys(dataToFetch);
      // Collect array of promises, one for each api request
      this.promises = keys.map(key =>
        cancelablePromise(dataToFetch[key](props))
      );
      this.promises.forEach((p, i) => {
        p.promise
          .then(x => {
            console.log('zappening', keys[i]);
            let data = this.state.data;
            data = data.set(keys[i], fromJS(x));
            this.setState({ data });
          })
          .catch(e => console.error(e));
      });
    }
    componentWillUnmount() {
      console.log('unmounting');
      this.promises.forEach(p => p && p.cancel());
    }
    render() {
      return <WrappedComponent {...this.props} data={this.state.data} />;
    }
  }

  return FetchDataEnhancer;
}
