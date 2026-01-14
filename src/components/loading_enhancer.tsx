import React from "react";
import { Loading } from "./loading";

type propTypes = {
  loading: boolean;
};

export function loadingEnhancer<P extends {}, S extends {}>(
  WrappedComponent: React.ComponentClass<P, S>,
): React.ComponentClass<P & propTypes> {
  return class PureRendered extends React.PureComponent<P & propTypes> {
    render() {
      return this.props.loading ? (
        <Loading />
      ) : (
        <WrappedComponent {...this.props} />
      );
    }
  };
}
