// @flow
import React from 'react';
import { Map, fromJS } from 'immutable';
import debounce from 'lodash.debounce';
import { getDisplayName } from '../utils/component';

type stateType = {
  data: Map<string, *>
};

/**
 * @desc If any network request fails it silents it
 * It also sets state on first come first serve basis.
 * @param  onUpdate - decides whether to do the network calls on not
 */
export function withFetchDataSilent<P: {}, S: {}>(
  dataToFetch: (props: P) => Object,
  onUpdate: (P, P) => boolean,
  WrappedComponent: Class<React.PureComponent<*, P, S>>
): Class<React.PureComponent<void, P, stateType>> {
  return class FetchDataEnhancer extends React.PureComponent<
    void,
    P,
    stateType
  > {
    static displayName = `HOCFetchData${getDisplayName(WrappedComponent)}`;
    state = {
      data: Map()
    };
    fetchedData: Object;
    initFetching: (props: P) => void;
    constructor(props) {
      super(props);
      this.initFetching = debounce(this._initFetching, 500);
    }
    componentDidMount() {
      this.initFetching(this.props);
    }
    componentWillReceiveProps(nextProps: P) {
      if (onUpdate(nextProps, this.props)) {
        this.initFetching(nextProps);
      }
    }
    _initFetching = (props: P) => {
      this.fetchedData = dataToFetch(props);
      // iterate through all of cancelable promises, one for each api request
      Object.keys(this.fetchedData).forEach(k => {
        var prom = this.fetchedData[k];
        prom.promise
          .then(x => {
            let data = this.state.data;
            data = data.set(k, fromJS(x));
            this.setState({ data });
          })
          .catch(e => console.error(e));
      });
    };
    reloadData = () => {
      this.initFetching(this.props);
    };
    componentWillUnmount() {
      this.fetchedData &&
        Object.keys(this.fetchedData).forEach(k => {
          this.fetchedData[k] && this.fetchedData[k].cancel();
        });
    }
    render() {
      return (
        <WrappedComponent
          {...this.props}
          data={this.state.data}
          reloadData={this.reloadData}
        />
      );
    }
  };
}
