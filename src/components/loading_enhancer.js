// @flow
import React from 'react';
import { Loading } from './loading';

type propTypes = {
  loading: boolean
};

export function loadingEnhancer<P: {}, S: {}>(
  WrappedComponent: Class<React.PureComponent<any, P, S>>
): Class<React.PureComponent<void, P & propTypes, *>> {
  return class PureRendered extends React.PureComponent<
    void,
    P & propTypes,
    *
  > {
    render() {
      return this.props.loading
        ? <Loading />
        : <WrappedComponent {...this.props} />;
    }
  };
}
