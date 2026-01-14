import { fromJS, Map } from "immutable";
import debounce from "lodash.debounce";
import React from "react";
import { getDisplayName } from "../utils/component";

type stateType = {
  data: Map<string, any>;
};

/**
 * @desc If any network request fails it silents it
 * It also sets state on first come first serve basis.
 * @param  onUpdate - decides whether to do the network calls on not
 */
export function withFetchDataSilent<P extends {}, S extends {}>(
  dataToFetch: (props: P) => any,
  onUpdate: (b: P, a: P) => boolean,
  WrappedComponent: React.ComponentClass<P, S>,
): React.ComponentClass<P, stateType> {
  return class FetchDataEnhancer extends React.PureComponent<P, stateType> {
    static displayName = `HOCFetchData${getDisplayName(WrappedComponent)}`;
    state: stateType = {
      data: Map<string, any>(),
    };
    fetchedData: any;
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
      Object.keys(this.fetchedData).forEach((k) => {
        var prom = this.fetchedData[k];
        prom.promise
          .then((x) => {
            let data = this.state.data;
            data = data.set(k, fromJS(x));
            this.setState({ data });
          })
          .catch((e) => console.error(e));
      });
    };
    reloadData = () => {
      this.initFetching(this.props);
    };
    componentWillUnmount() {
      this.fetchedData &&
        Object.keys(this.fetchedData).forEach((k) => {
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
