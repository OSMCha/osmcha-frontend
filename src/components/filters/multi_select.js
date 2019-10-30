// @flow
import React from 'react';
import { fromJS } from 'immutable';
import { Creatable, Async } from 'react-select';
import { API_URL, OSM_TEAMS_API_URL, isOsmTeamsEnabled } from '../../config';
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
    allToggle: this.props.name.slice(0, 4) === 'all_'
  };
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
        const data = json
          .filter(d => d.for_changeset)
          .map(d => ({ ...d, label: d.name, value: d.id }));
        return { options: data };
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
    if (dataURL)
      return (
        <Async
          multi
          promptTextCreator={label => `Add ${label} to ${display}`}
          name={name}
          className=""
          value={value && value.toJS()}
          loadOptions={this.getAsyncOptions}
          onChange={this.onChangeLocal} // have to add an identifier for filter name
          placeholder={placeholder}
        />
      );
    return (
      <Creatable
        multi
        promptTextCreator={label => `Add ${label} to ${display}`}
        name={name}
        value={value && value.toJS()}
        options={options}
        onChange={this.onChangeLocal}
        placeholder={placeholder}
      />
    );
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
  getAsyncOptions = async () => {
    if (!this.props.dataURL) return;
    if (isOsmTeamsEnabled) {
      const teams = await fetch(OSM_TEAMS_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json());
      const teams_with_members = await Promise.all(
        teams.map(team =>
          fetch(`${OSM_TEAMS_API_URL}/${team.id}`).then(response =>
            response.json()
          )
        )
      );
      const data = teams_with_members.map(team => {
        return {
          ...team,
          label: `${team.name} (verified)`,
          value: team.members.map(member => parseInt(member.id, 10))
        };
      });
      return { options: data };
    } else {
      return await fetch(`${API_URL}/${this.props.dataURL}/`, {
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
          const data = json.map(d => {
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
          return { options: data };
        });
    }
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
