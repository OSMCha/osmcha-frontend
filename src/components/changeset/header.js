// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import moment from 'moment';

import { CreateDeleteModify } from '../create_delete_modify';
import { Details } from './details';
import { useIsUserListed } from '../../hooks/UseIsUserListed';

type propsType = {|
  properties: Map<string, *>,
  changesetId: number,
  userEditCount: number,
  toggleUser: () => mixed,
  trustedlist: Map<string, *>,
  watchlisted: Map<object, *>
|};

function HeaderComponent({
  properties,
  changesetId,
  userEditCount,
  toggleUser,
  trustedlist,
  watchlisted
}: propsType) {
  const user = properties.get('user');
  const date = properties.get('date');
  const create = properties.get('create');
  const modify = properties.get('modify');
  const destroy = properties.get('delete');
  const [isInTrustedlist, isInWatchlist] = useIsUserListed(
    user,
    properties.get('uid'),
    trustedlist,
    watchlisted
  );

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
            <strong className="txt-underline-on-hover pointer">
              <span dir="ltr pointer" onClick={toggleUser}>
                {user}
              </span>
            </strong>
            {isInTrustedlist && (
              <svg className="icon inline-block align-middle pl3 w18 h18 color-yellow">
                <use xlinkHref="#icon-star" />
              </svg>
            )}
            {isInWatchlist && (
              <svg className="icon inline-block align-middle pl3 w18 h18 color-red">
                <use xlinkHref="#icon-alert" />
              </svg>
            )}
            {userEditCount > 0 && (
              <span className="txt-s txt-em">
                &nbsp;({userEditCount} edits)
              </span>
            )}
            &nbsp;created&nbsp;{moment(date).fromNow()}
          </span>
        </div>
      </div>
      <Details changesetId={changesetId} properties={properties} />
    </div>
  );
}

const Header = connect((state: RootStateType, props) => ({
  trustedlist: state.trustedlist.get('trustedlist'),
  watchlisted: state.watchlist.get('watchlist')
}))(HeaderComponent);
export { Header };
