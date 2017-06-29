// @flow
import React from 'react';
import { Map, OrderedMap } from 'immutable';

import Mousetrap from 'mousetrap';
import { getDisplayName } from '../utils/component';
window.O = OrderedMap;
export function keyboardToggleEnhancer(
  exclusive: boolean,
  bindings: Array<{ label: string, bindings: Array<string> }>,
  WrappedComponent: Class<React.PureComponent<*, *, *>>
) {
  return class wrapper extends React.PureComponent {
    static displayName = `HOCKeyboard${getDisplayName(WrappedComponent)}`;
    state = { bindings: Map(), lastKeyStroke: Map() };

    componentDidMount() {
      bindings.forEach(item =>
        Mousetrap.bind(item.bindings, (e: Event) => {
          e.preventDefault();
          if (exclusive) {
            return this.exclusiveKeyToggle(item.label);
          }
          this.toggleKey(item.label);
        })
      );
    }

    // allow toggling the state of a particular key
    toggleKey = (label: string) => {
      let prev = this.state.bindings;
      let lastKeyStroke = Map().set(label, !prev.get(label));
      prev = prev.set(label, !prev.get(label));
      this.setState({
        bindings: prev,
        lastKeyStroke
      });
    };

    // exclusively toggle this label and switch off others
    exclusiveKeyToggle = (label: string) => {
      let newBindingState = Map();
      const prevBindingValue = this.state.bindings.get(label);
      newBindingState = newBindingState.set(label, !prevBindingValue);
      // !replaces the entire binding state
      this.setState({
        bindings: newBindingState,
        lastKeyStroke: newBindingState // since it will be a Map of 1 recent key stroke
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
          lastKeyStroke={this.state.lastKeyStroke}
          toggleKey={this.toggleKey}
          exclusiveKeyToggle={this.exclusiveKeyToggle}
        />
      );
    }
  };
}
