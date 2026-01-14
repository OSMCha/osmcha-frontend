import { Map } from "immutable";
import Mousetrap from "mousetrap";
import React from "react";

import { getDisplayName } from "../utils/component";

type stateType = {
  bindings: Map<string, any>;
  lastKeyStroke: Map<string, any>;
};

/**
 * @param exclusive - flag to toggle one key and switch off all other keys
 * @prop `bindingsState` - immutable Map containing toggleState(true/false) for each of the bindings.
 * @prop `lastKeyStroke` - immutable Map containg the state of last key pressed only.
 */
export function keyboardToggleEnhancer<P extends {}, S extends {}>(
  exclusive: boolean,
  bindings: Array<{
    label: string;
    bindings: Array<string>;
  }>,
  WrappedComponent: React.ComponentClass<P, S>,
): React.ComponentClass<P, stateType> {
  return class wrapper extends React.PureComponent<P, stateType> {
    static displayName = `HOCKeyboard${getDisplayName(WrappedComponent)}`;

    state: stateType = {
      bindings: Map<string, any>(),
      lastKeyStroke: Map<string, any>(),
    };
    componentDidMount() {
      bindings.forEach((item) =>
        Mousetrap.bind(item.bindings, (e: Event) => {
          e.preventDefault();
          if (exclusive) {
            return this.exclusiveKeyToggle(item.label);
          }
          this.toggleKey(item.label);
        }),
      );
    }

    componentWillUnmount() {
      // unbind all bindings
      bindings.forEach((item) =>
        item.bindings.forEach((b) => {
          Mousetrap.unbind(b);
        }),
      );
    }

    // allow toggling the state of a particular key
    toggleKey = (label: string) => {
      let prev = this.state.bindings;
      const lastKeyStroke = Map<string, any>().set(label, !prev.get(label));
      prev = prev.set(label, !prev.get(label));
      this.setState({
        bindings: prev,
        lastKeyStroke,
      });
    };

    // exclusively toggle this label and switch off others
    exclusiveKeyToggle = (label: string) => {
      let newBindingState = Map<string, any>();
      const prevBindingValue = this.state.bindings.get(label);
      newBindingState = newBindingState.set(label, !prevBindingValue);
      this.setState({
        bindings: newBindingState,
        lastKeyStroke: newBindingState, // will be same as state.bindings as size=1
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
