import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Button } from '../button';
import { cancelablePromise } from '../../utils/promise';
import {
  postUserToWhiteList,
  deleteFromWhiteList
} from '../../network/osmcha_whitelist';

class WhitelistUser extends React.PureComponent {
  props: {
    token: string,
    whitelisted: Map<string, *>,
    user_to_whitelist: string
  };
  constructor(props) {
    super(props);
    this.state = {
      is_whitelisted: this.props.whitelisted
        ? this.props.whitelisted.indexOf(props.user_to_whitelist) !== -1
        : false,
      hover: false
    };
  }
  _ref;

  addToWhiteList = event => {
    this.addToWhiteListPromise = cancelablePromise(
      postUserToWhiteList(this.props.token, this.props.user_to_whitelist)
    );

    this.addToWhiteListPromise.promise
      .then(r => {
        this.setState({ is_whitelisted: true });
      })
      .catch(e => {
        console.error(e);
      });
  };
  removeFromWhiteList = event => {
    this.deleteFromWhiteListPromise = cancelablePromise(
      deleteFromWhiteList(this.props.token, this.props.user_to_whitelist)
    );
    this.deleteFromWhiteListPromise.promise
      .then(r => {
        this.setState({ is_whitelisted: false });
      })
      .catch(e => {
        console.error(e);
      });
  };

  onClick = event => {
    if (this.state.is_whitelisted) {
      this.removeFromWhiteList();
    } else {
      this.addToWhiteList();
    }
  };

  handleMouseOver = event => {
    this.setState({ hover: true });
  };

  handleMouseOut = event => {
    this.setState({ hover: false });
  };

  render() {
    return (
      <div onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        {this.state.is_whitelisted ? (
          <Button
            className="bg-green-light btn btn--s border--green-light"
            onClick={this.onClick}
          >
            <svg
              className={`icon inline-block align-middle pl3 pb3 pointer ${this
                .state.hover
                ? 'color-red'
                : 'color-green'}`}
            >
              <use
                xlinkHref={`${this.state.hover
                  ? '#icon-close'
                  : '#icon-check'}`}
              />
            </svg>
            {`${this.state.hover
              ? 'Remove user from whitelist'
              : 'Whitelisted User'}`}
          </Button>
        ) : (
          <Button
            onClick={this.onClick}
            className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
          >
            <svg className="icon inline-block align-middle pl3 pb3 pointer">
              <use xlinkHref="#icon-plus" />
            </svg>
            Add user to your whitelist
          </Button>
        )}
      </div>
    );
  }
}

WhitelistUser = connect((state: RootStateType, props) => ({
  token: state.auth.get('token'),
  whitelisted: state.auth.getIn(['userDetails', 'whitelists'])
}))(WhitelistUser);
export { WhitelistUser };
