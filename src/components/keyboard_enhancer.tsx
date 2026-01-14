import Mousetrap from "mousetrap";
import React from "react";

import { getDisplayName } from "../utils/component";

type stateType = {
  bindings: Record<string, boolean>;
  lastKeyStroke: Record<string, boolean>;
};

/**
 * @param exclusive - flag to toggle one key and switch off all other keys
 * @prop `bindingsState` - object containing toggleState(true/false) for each of the bindings.
 * @prop `lastKeyStroke` - object containing the state of last key pressed only.
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
      bindings: {},
      lastKeyStroke: {},
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
      bindings.forEach((item) =>
        item.bindings.forEach((b) => {
          Mousetrap.unbind(b);
        }),
      );
    }

    toggleKey = (label: string) => {
      const prev = this.state.bindings;
      const lastKeyStroke = { [label]: !prev[label] };
      const newBindings = { ...prev, [label]: !prev[label] };
      this.setState({
        bindings: newBindings,
        lastKeyStroke,
      });
    };

    exclusiveKeyToggle = (label: string) => {
      const prevBindingValue = this.state.bindings[label];
      const newBindingState = { [label]: !prevBindingValue };
      this.setState({
        bindings: newBindingState,
        lastKeyStroke: newBindingState,
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
