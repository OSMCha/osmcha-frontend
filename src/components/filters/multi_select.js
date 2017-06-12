// @flow
import React from 'react';
import { List, fromJS, Map } from 'immutable';
import { Creatable } from 'react-select';
import { Wrapper } from './wrapper';
import type { InputType } from './';

export class MultiSelect extends React.PureComponent {
  props: {
    name: string,
    display: string,
    value: List<InputType>,
    type: string,
    placeholder: string,
    options: Array<Object>,
    onChange: (string, List<InputType>) => any
  };
  onChangeLocal = (data: ?Array<Object>) => {
    if (!Array.isArray(data)) return;
    var processed = data.map(o => ({ label: o.label, value: o.value })); // remove any bogus keys
    this.props.onChange(this.props.name, fromJS(processed));
  };
  render() {
    const { name, options, placeholder, value, display } = this.props;
    return (
      <Wrapper display={display}>
        <Creatable
          multi
          promptTextCreator={label => `Add ${label} to ${display}`}
          name={name}
          value={value && value.toJS()}
          options={options}
          onChange={this.onChangeLocal}
          placeholder={placeholder}
        />
      </Wrapper>
    );
  }
}

//  options={
//             name === 'users' || name === 'checked_by'
//               ? this.props.usersAutofill
//               : []
//           }
