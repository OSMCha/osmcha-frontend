// @flow
import React from 'react';
import { Map } from 'immutable';

import Mousetrap from 'mousetrap';
import { getDisplayName } from '../utils/component';

export function keyboardToggleEnhancer(
  exclusive: boolean,
  bindings: Array<{ label: string, bindings: Array<string> }>,
  WrappedComponent: Class<React.PureComponent<*, *, *>>
) {
  return class wrapper extends React.PureComponent {
    static displayName = `HOCKeyboard${getDisplayName(WrappedComponent)}`;
    state = { bindings: Map() };
    componentDidMount() {
      bindings.forEach(item =>
        Mousetrap.bind(item.bindings, () => {
          if (exclusive) {
            return this.exclusiveKeyToggle(item.label);
          }
          this.toggleKey(item.label);
        })
      );
    }

    // allow toggling the state of a particular key
    toggleKey = label => {
      let prev = this.state.bindings;
      prev = prev.set(label, !prev.get(label));
      this.setState({
        bindings: prev
      });
    };

    // exclusively toggle this label and switch off others
    exclusiveKeyToggle = label => {
      let newBindingState = Map();
      const prevBindingValue = this.state.bindings.get(label);
      newBindingState = newBindingState.set(label, !prevBindingValue);
      this.replaceKeysState(newBindingState);
    };

    // DANGEROUS! replaces the entire binding state with whatever is provided
    replaceKeysState = (bindings: Map<string, boolean>) => {
      this.setState({
        bindings
      });
    };

    componentWillUnmount() {
      // unbind all bindings
      bindings.forEach(item => item.bindings.forEach(b => Mousetrap.unbind(b)));
    }
    render() {
      return (
        <WrappedComponent
          {...this.props}
          bindingsState={this.state.bindings}
          replaceKeysState={this.replaceKeysState}
          toggleKey={this.toggleKey}
          exclusiveKeyToggle={this.exclusiveKeyToggle}
        />
      );
    }
  };
}
