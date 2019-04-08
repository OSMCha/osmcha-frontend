// @flow
import React from 'react';
import { Async } from 'react-select';
import { getUsers } from '../../network/whosthat';

export class UserAutocomplete extends React.PureComponent {
  state = {
    value: null
  };
  props: {
    name: string,
    placeholder?: string,
    className?: string,
    onChange: (value: any) => void,
    value: any,
    multi?: boolean
  };
  getAsyncOptions = (input: string, cb: (e: ?Error, any) => void) => {
    return getUsers(input)
      .then(json => {
        if (!Array.isArray(json)) return cb(null, { options: [] });

        const data = json.map(d => ({
          label: d.names.slice(-1)[0],
          value: d.id
        }));
        return cb(null, { options: data });
      })
      .catch(e => cb(e, null));
  };
  //   onChange = (value: ?Array<Object>) => {
  //     if (Array.isArray(value) && value.length === 0)
  //       return this.setState({ value: null });
  //     this.setState({
  //       value
  //     });
  //   };

  render() {
    return (
      <Async
        className={this.props.className}
        multi={this.props.multi}
        name={this.props.name || 'user_autocomplete'}
        cache={false}
        value={this.props.value || null}
        onChange={this.props.onChange}
        loadOptions={this.getAsyncOptions}
        placeholder={this.props.placeholder || 'users'}
        autoload={false}
      />
    );
  }
}
