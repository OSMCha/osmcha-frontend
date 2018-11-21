// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import moment from 'moment';

import { CreateDeleteModify } from '../create_delete_modify';
import { Details } from './details';

class Header extends React.PureComponent {
  props: {
    properties: Map<string, *>,
    changesetId: number,
    userEditCount: number,
    toggleUser: () => mixed,
    whitelisted: Map<string, *>
  };
  render() {
    const user = this.props.properties.get('user');
    const date = this.props.properties.get('date');
    const create = this.props.properties.get('create');
    const modify = this.props.properties.get('modify');
    const destroy = this.props.properties.get('delete');
    const is_whitelisted = this.props.whitelisted.indexOf(user) !== -1;

    return (
      <div className="px12 py6">
        <div className="flex-parent flex-parent--column flex-parent--start flex-parent--wrap">
          <div className="flex-parent flex-parent--row justify--space-between">
            <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">Details</h2>
            <div>
              <CreateDeleteModify
                showZero
                className="mr3 mt3"
                create={create}
                modify={modify}
                delete={destroy}
              />
            </div>
          </div>
          <div className="flex-parent flex-parent--row justify--space-between flex-parent--wrap">
            <span className="txt-s">
              <span className="txt-underline-on-hover pointer txt-bold">
                <a dir="ltr" onClick={this.props.toggleUser}>
                  {user}
                </a>
              </span>
              {is_whitelisted && (
                <svg className="icon inline-block align-middle pl3 w18 h18 color-gray">
                  <use xlinkHref="#icon-star" />
                </svg>
              )}
              {this.props.userEditCount > 0 && (
                <span className="txt-s txt-em">
                  &nbsp;({this.props.userEditCount} edits)&nbsp;
                </span>
              )}
              created&nbsp;{moment(date).fromNow()}
            </span>
          </div>
        </div>
        <Details
          changesetId={this.props.changesetId}
          properties={this.props.properties}
        />
      </div>
    );
  }
}

Header = connect((state: RootStateType, props) => ({
  whitelisted: state.whitelist.get('whitelist')
}))(Header);
export { Header };
