import React from 'react';

import { Button } from '../button';
import { BlackListUser } from './blacklist_user';
import { WhiteListUser } from './whitelist_user';

export class SaveUser extends React.PureComponent {
  state = {
    showInput: false
  };
  // onUserChange = (value: ?Array<Object>) => {
  //   if (Array.isArray(value) && value.length === 0)
  //     return this.setState({ userValues: null });
  //   this.setState({
  //     userValues: value
  //   });
  // };
  // onSave = () => {
  //   this.setState({
  //     showInput: false
  //   });
  //   if (this.state.userValues) {
  //     this.props.onCreate(this.state.userValues);
  //   }
  // };
  onSave = (username, uid) => {
    if (this.props.forBlacklist) {
      if (!username || !uid) return;
      this.props.onCreate({ username, uid });
      this.setState({ showInput: false });
    } else {
      if (!username) return;
      this.props.onCreate({ username });
      this.setState({ showInput: false });
    }
  };
  render() {
    return (
      <span>
        {this.state.showInput ? (
          <span className="flex-parent flex-parent--row ">
            {this.props.forBlacklist ? (
              <BlackListUser onSave={this.onSave} />
            ) : (
              <WhiteListUser onSave={this.onSave} />
            )}

            {/* <UserAutocomplete
                placeholder="user"
                className="wmin180"
                onChange={this.onUserChange}
                value={this.state.userValues}
                name="blacklist_user"
              /> */}
          </span>
        ) : (
          <Button
            className="input wmax120 ml12"
            onClick={() => this.setState({ showInput: true })}
          >
            Add+
          </Button>
        )}
      </span>
    );
  }
}
