// @flow
import React from 'react';
import Mousetrap from 'mousetrap';
import { Map } from 'immutable';

import { getDisplayName } from '../utils/component';

type stateType = {
  bindings: Map<string, *>,
  lastKeyStroke: Map<string, *>
};

/**
 * @param exclusive - flag to toggle one key and switch off all other keys
 * @prop `bindingsState` - immutable Map containing toggleState(true/false) for each of the bindings.
 * @prop `lastKeyStroke` - immutable Map containg the state of last key pressed only.
 */
export function keyboardToggleEnhancer<P: {}, S: {}>(
  exclusive: boolean,
  bindings: Array<{ label: string, bindings: Array<string> }>,
  WrappedComponent: Class<React.PureComponent<*, P, S>>
): Class<React.PureComponent<void, P, stateType>> {
  return class wrapper extends React.PureComponent<void, P, stateType> {
    static displayName = `HOCKeyboard${getDisplayName(WrappedComponent)}`;

    state = {
      bindings: Map(),
      lastKeyStroke: Map()
    };
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

    componentWillUnmount() {
      // unbind all bindings
      bindings.forEach(item =>
        item.bindings.forEach(b => {
          Mousetrap.unbind(b);
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
      this.setState({
        bindings: newBindingState,
        lastKeyStroke: newBindingState // will be same as state.bindings as size=1
      });
    };

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
