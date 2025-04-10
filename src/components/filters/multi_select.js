// @flow
import React from 'react';
import { fromJS } from 'immutable';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import { API_URL } from '../../config';
import { fetchReasons } from '../../network/reasons_tags';
import type { filterType } from './';

export class MultiSelect extends React.PureComponent {
  props: {
    name: string,
    display: string,
    value: filterType,
    type: string,
    placeholder: string,
    options: Array<Object>,
    dataURL: ?string,
    onChange: (string, value?: filterType) => any,
    showAllToggle: boolean,
    token: string
  };
  state = {
    inputValue: '',
    allToggle: this.props.name.slice(0, 4) === 'all_',
    reasons: null
  };

  componentDidMount() {
    // Special case for "Reasons for Flagging" field
    if (this.props.dataURL === 'suspicion-reasons') {
      fetchReasons(this.props.token).then(reasons => {
        this.setState({ reasons });
      });
    }
  }

  getAsyncOptions = () => {
    if (!this.props.dataURL) return;

    // Special case for "Reasons for Flagging" field
    if (this.props.dataURL === 'suspicion-reasons' && this.state.reasons) {
      return (inputValue, callback) => {
        const filteredReasons = this.state.reasons.filter(reason =>
          reason.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        const options = filteredReasons.map(d => ({
          ...d,
          label: d.name,
          value: d.id
        }));
        callback(options);
      };
    }

    return fetch(`${API_URL}/${this.props.dataURL}/?page_size=200`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.props.token ? `Token ${this.props.token}` : ''
      }
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        const data = json.results
          .filter(d => d.for_changeset)
          .map(d => ({ ...d, label: d.name, value: d.id }));
        return data;
      });
  };

  onChangeLocal = (data: ?Array<Object>) => {
    if (!Array.isArray(data)) return;
    this.sendData(this.state.allToggle, data);
  };

  sendData = (allToggle: boolean, data: Array<Object>) => {
    let name =
      this.props.name.slice(0, 4) === 'all_'
        ? this.props.name.slice(4)
        : this.props.name;

    name = `${allToggle ? 'all_' : ''}${name}`;
    if (data.length === 0) return this.props.onChange(name);
    var processed = data.map(o => ({ label: o.label, value: o.value })); // remove any bogus keys
    this.props.onChange(name, fromJS(processed));
  };

  renderSelect = () => {
    const { name, options, placeholder, value, display, dataURL } = this.props;

    const handleKeyDown: KeyboardEventHandler = event => {
      if (this.state.inputValue === '') return;
      if (event.key === 'Enter' || event.key === 'Tab') {
        const oldValues = value?.toJS() ?? [];
        const newValue = {
          value: this.state.inputValue,
          label: this.state.inputValue
        };
        this.sendData(this.state.allToggle, [...oldValues, newValue]);
        this.setState({ inputValue: '' });
        event.preventDefault();
      }
    };

    if (dataURL) {
      // Special case for "Reasons for Flagging" field, which fetches reasons list once and
      // then filters the options client-side
      if (dataURL === 'suspicion-reasons') {
        const options =
          this.state.reasons?.map(d => ({
            ...d,
            label: d.name,
            value: d.id
          })) ?? [];
        return (
          <Select
            isMulti
            name={name}
            className="react-select"
            value={value && value.toJS()}
            options={options}
            onChange={this.onChangeLocal}
            placeholder={placeholder}
            isClearable
          />
        );
      }

      return (
        <AsyncSelect
          isMulti
          formatCreateLabel={label => `Add ${label} to ${display}`}
          name={name}
          className="react-select"
          value={value && value.toJS()}
          loadOptions={this.getAsyncOptions}
          onChange={this.onChangeLocal}
          placeholder={placeholder}
        />
      );
    }

    if (options && options.length > 0) {
      // this Select has a fixed list of options that the user can search through,
      // and also permits the user to add new options
      return (
        <CreatableSelect
          className="react-select"
          isMulti
          isClearable
          formatCreateLabel={label => `Add ${label} to ${display}`}
          name={name}
          value={value && value.toJS()}
          options={options}
          onChange={this.onChangeLocal}
          placeholder={placeholder}
        />
      );
    } else {
      // this Select is a free-form input that has no pre-defined options
      // (and therefore no dropdown to pick from them); instead the user can
      // type anything they want to add it to the list of selections
      return (
        <CreatableSelect
          className="react-select"
          isMulti
          isClearable
          menuIsOpen={false}
          components={{ DropdownIndicator: null }}
          formatCreateLabel={label => `Add ${label} to ${display}`}
          name={name}
          value={value && value.toJS()}
          inputValue={this.state.inputValue}
          onChange={this.onChangeLocal}
          onInputChange={inputValue => this.setState({ inputValue })}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      );
    }
  };

  handleToggle = (e: Event) => {
    let { value } = this.props;
    value = value && value.toJS();
    if (value) {
      this.sendData(!this.state.allToggle, value);
    }
    this.setState({
      allToggle: !this.state.allToggle
    });
  };

  render() {
    return (
      <div className="">
        {this.props.showAllToggle && (
          <span className="relative fr">
            <span className="absolute" style={{ left: -95, top: -30 }}>
              <div className="toggle-group txt-s mr18">
                <label className="toggle-container">
                  <input
                    checked={!this.state.allToggle}
                    name={`toggle${this.props.name}`}
                    type="radio"
                    onClick={this.handleToggle}
                  />
                  <div className="toggle toggle--gray-light">OR</div>
                </label>
                <label className="toggle-container">
                  <input
                    name={`toggle${this.props.name}`}
                    type="radio"
                    checked={this.state.allToggle}
                    onClick={this.handleToggle}
                  />
                  <div className="toggle toggle--gray-light">AND</div>
                </label>
              </div>
            </span>
          </span>
        )}
        {this.renderSelect()}
      </div>
    );
  }
}

export class MappingTeamMultiSelect extends MultiSelect {
  getAsyncOptions = () => {
    if (!this.props.dataURL) return;
    return fetch(`${API_URL}/${this.props.dataURL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.props.token ? `Token ${this.props.token}` : ''
      }
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        const data = json.results.map(d => {
          if (d.trusted) {
            return { ...d, label: `${d.name} (verified)`, value: d.name };
          } else {
            return {
              ...d,
              label: d.name.replace('(verified)', ''),
              value: d.name
            };
          }
        });
        return data;
      });
  };

  sendData = (allToggle: boolean, data: Array<Object>) => {
    let name =
      this.props.name.slice(0, 4) === 'all_'
        ? this.props.name.slice(4)
        : this.props.name;

    name = `${allToggle ? 'all_' : ''}${name}`;
    if (data.length === 0) return this.props.onChange(name);
    var processed = data.map(o => ({ label: o.label, value: o.value })); // remove any bogus keys
    this.props.onChange(name, fromJS(processed));
  };
}
