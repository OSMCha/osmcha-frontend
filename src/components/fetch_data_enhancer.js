// @flow
import React from 'react';
import { Map, fromJS } from 'immutable';

import { cancelablePromise } from '../utils/promise';
import { getDisplayName } from '../utils/component';

// If any network request fails it silents it
// It also sets state on first come first serve basis.
// @onUpdate a function to be passed by the invoker
// which decides whether to reload the network
// requests.
export function withFetchDataSilent(
  dataToFetch: Object,
  onUpdate: (Object, Object) => boolean,
  WrappedComponent: any
) {
  return class FetchDataEnhancer extends React.PureComponent {
    static displayName = `HOCFetchData${getDisplayName(WrappedComponent)}`;
    state = {
      data: Map()
    };
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
            let data = this.state.data;
            data = data.set(keys[i], fromJS(x));
            this.setState({ data });
          })
          .catch(e => console.error(e));
      });
    }
    componentWillUnmount() {
      this.promises.forEach(p => p && p.cancel());
    }
    render() {
      return <WrappedComponent {...this.props} data={this.state.data} />;
    }
  };
}
