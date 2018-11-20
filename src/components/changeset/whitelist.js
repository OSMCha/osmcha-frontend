import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { Button } from '../button';
import {
  addToWhitelist,
  removeFromWhitelist
} from '../../store/whitelist_actions';

class WhitelistUser extends React.PureComponent {
  props: {
    token: string,
    whitelisted: Map<string, *>,
    user_to_whitelist: string,
    addToWhitelist: string => void,
    removeFromWhitelist: string => void
  };
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }
  _ref;

  onClick = event => {
    if (this.props.whitelisted.indexOf(this.props.user_to_whitelist) !== -1) {
      this.props.removeFromWhitelist(this.props.user_to_whitelist);
    } else {
      this.props.addToWhitelist(this.props.user_to_whitelist);
    }
  };

  handleMouseOver = event => {
    this.setState({ hover: true });
  };

  handleMouseOut = event => {
    this.setState({ hover: false });
  };

  render() {
    const is_whitelisted =
      this.props.whitelisted.indexOf(this.props.user_to_whitelist) !== -1;
    return (
      <div onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        {is_whitelisted ? (
          <Button className="btn btn--s" onClick={this.onClick}>
            <svg
              className={`icon inline-block align-middle w18 h18 pointer ${
                this.state.hover ? 'color-red' : 'color-green'
              }`}
            >
              <use
                xlinkHref={`${
                  this.state.hover ? '#icon-close' : '#icon-check'
                }`}
              />
            </svg>
            {`${
              this.state.hover
                ? 'Remove user from whitelist'
                : 'Whitelisted User'
            }`}
          </Button>
        ) : (
          <Button
            onClick={this.onClick}
            className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
          >
            <svg className="icon inline-block align-middle w18 h18 pointer">
              <use xlinkHref="#icon-plus" />
            </svg>
            Add user to your whitelist
          </Button>
        )}
      </div>
    );
  }
}

WhitelistUser = connect(
  (state: RootStateType, props) => ({
    token: state.auth.get('token'),
    whitelisted: state.whitelist.get('whitelist')
  }),
  {
    addToWhitelist,
    removeFromWhitelist
  }
)(WhitelistUser);
export { WhitelistUser };
