// @flow
import React from 'react';
import { connect } from 'react-redux';
import { parse } from 'date-fns';
import AnchorifyText from 'react-anchorify-text';

import AssemblyAnchor from '../assembly_anchor';
import { CommentForm } from './comment';
import TranslateButton from './translate_button';
import { RelativeTime } from '../relative_time';
import { SignInButton } from './sign_in_button';
import { UserOSMLink } from './user_osm_link';

class Discussions extends React.PureComponent {
  props: {
    discussions: List<*>,
    changesetId: number,
    changesetAuthor: string,
    changesetIsHarmful: boolean
  };

  renderComments() {
    const { discussions, changesetAuthor } = this.props;

    if (discussions.size === 0) {
      return (
        <div className="flex-parent flex-parent--column flex-parent--center-cross mb12">
          <svg className="icon icon--xxl color-darken25">
            <use xlinkHref="#icon-contact" />
          </svg>
          <p className="txt-m">{'No discussions, yet.'}</p>
        </div>
      );
    } else {
      return (
        <div className="">
          {discussions.map((comment, i) => (
            <div
              key={i}
              className="flex-parent flex-parent--column justify--space-between border border--gray-light round p6 my6 mt12"
            >
              <div className="flex-parent flex-parent--row justify--space-between txt-s ">
                <span>
                  By{' '}
                  <strong>
                    <UserOSMLink
                      userName={comment.get('user')}
                      linkClasses={'txt-underline-on-hover cursor-pointer'}
                    >
                      {comment.get('user')}
                    </UserOSMLink>{' '}
                  </strong>
                  {changesetAuthor === comment.get('user') && (
                    <span style={{ color: '#aaa' }}>(changeset author)</span>
                  )}
                </span>
                <span>
                  <RelativeTime
                    datetime={
                      // eslint-disable-next-line
                      parse(
                        comment.get('date'),
                        "yyyy-MM-dd'T'HH:mm:ssX",
                        new Date()
                      )
                    }
                  />
                </span>
              </div>
              <div className="flex-parent flex-parent--column mt6 mb3">
                <p className="txt-break-url">
                  <AnchorifyText text={comment.get('text')}>
                    <AssemblyAnchor />
                  </AnchorifyText>
                </p>
              </div>
              <div className="flex-parent justify--flex-end">
                <TranslateButton text={comment.get('text')} />
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
  render() {
    const {
      discussions,
      changesetId,
      changesetIsHarmful,
      changesetAuthor
    } = this.props;

    return (
      <div className="px12 py6">
        <h2 className="txt-m mr6 mb3">
          <span className="txt-uppercase txt-bold">Discussions </span>
          for changeset by {changesetAuthor}
        </h2>
        {this.props.token ? (
          this.renderComments()
        ) : (
          <div>
            <div className="flex-parent flex-parent--column flex-parent--center-cross mb12">
              <svg className="icon icon--xxl color-darken25">
                <use xlinkHref="#icon-contact" />
              </svg>
            </div>
            <div className="flex-parent flex-parent--inline flex-parent--center-main mt6 mb3">
              <SignInButton text="Sign in to read and post comments" />
            </div>
          </div>
        )}
        {this.props.token && (
          <div className="flex-parent flex-parent--column justify--space-between my6 mt12">
            <CommentForm
              changesetId={changesetId}
              changesetIsHarmful={changesetIsHarmful}
              discussions={discussions}
              token={this.props.token}
              userDetails={this.props.userDetails}
            />
          </div>
        )}
      </div>
    );
  }
}

Discussions = connect((state: RootStateType) => ({
  token: state.auth.get('token'),
  userDetails: state.auth.get('userDetails')
}))(Discussions);

export { Discussions };
