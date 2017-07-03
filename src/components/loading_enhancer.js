// @flow
import React from 'react';
import { Loading } from './loading';

export function loadingEnhancer(WrappedComponent: any) {
  return ({ loading, ...props }: Object) =>
    loading ? <Loading /> : <WrappedComponent {...props} />;
}
