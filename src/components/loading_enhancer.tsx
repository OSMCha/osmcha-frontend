import React from "react";
import { Loading } from "./loading.tsx";

type Props = {
  loading: boolean;
};

export function loadingEnhancer<P extends {}, S extends {}>(
  WrappedComponent: React.ComponentClass<P, S>,
): React.ComponentClass<P & Props> {
  return class PureRendered extends React.PureComponent<P & Props> {
    render() {
      return this.props.loading ? (
        <Loading />
      ) : (
        <WrappedComponent {...this.props} />
      );
    }
  };
}
