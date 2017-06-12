// @flow
import React from 'react';
import Select, { Creatable, Async } from 'react-select';
import { Wrapper } from './wrapper';
import { Map, List, fromJS } from 'immutable';
import type { InputType } from './';

export class Range extends React.PureComponent {
  props: {
    gte: List<InputType>,
    lte: List<InputType>,
    name: string,
    display: string,
    type: string,
    placeholder: string,
    onChange: (string, ?List<InputType>) => any
  };
  handleFormChange = (event: any) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if (!value || value === '') {
      return this.props.onChange(name, null);
    }
    this.props.onChange(
      name,
      fromJS([
        // allways sends 1 size array to keep things consistent
        {
          label: value,
          value
        }
      ])
    );
  };
  showForm = () => {
    const { name, gte, lte, onChange, type } = this.props;
    return (
      <span className="flex-parent flex-parent--row  ">
        <input
          type={type}
          onChange={this.handleFormChange}
          className="input mr3"
          name={`${name}__gte`}
          placeholder="min"
          value={gte && gte.getIn([0, 'value'])} // always takes 1st item array to keep things consistent with multiselect InputTypes
        />
        {' '}
        <input
          type={type}
          onChange={this.handleFormChange}
          className="input"
          value={lte && lte.getIn([0, 'value'])} // always takes 1st item array to keep things consistent with multiselect InputTypes
          name={`${name}__lte`}
          placeholder="max"
        />
        {' '}
      </span>
    );
  };
  render() {
    return (
      <Wrapper display={this.props.display}>
        {this.showForm()}
      </Wrapper>
    );
  }
}
