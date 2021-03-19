// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Row } from './row';
import { SignInButton } from '../changeset/sign_in_button.js';
import { elementInViewport } from '../../utils/element_in_view';
import { loadingEnhancer } from '../loading_enhancer';

type propTypes = {
  currentPage: ?Map<string, *>,
  activeChangesetId: ?number,
  pageIndex: number
};

class List extends React.Component<void, propTypes, *> {
  shouldComponentUpdate(nextProps: propTypes) {
    return (
      nextProps.activeChangesetId !== this.props.activeChangesetId ||
      nextProps.currentPage !== this.props.currentPage
    );
  }
  handleScroll = (r: HTMLElement) => {
    if (!r) return;
    if (!elementInViewport(r)) {
      r.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  };
  render() {
    if (
      !this.props.token &&
      ['/about', '/filters', '/user', '/'].includes(this.props.location)
    ) {
      return (
        <div className="flex-parent flex-parent--column scroll-styled flex-child--grow py36">
          <div className="flex-parent flex-parent--column flex-parent--center-cross">
            <svg className="icon h60 w60 inline-block align-middle pb3">
              <use xlinkHref="#icon-osm" />
            </svg>
          </div>
          <div className="flex-parent flex-parent--center-main align-center txt-l pt36">
            <SignInButton text="Sign in with your OpenStreetMap account" />
          </div>
        </div>
      );
    }
    return (
      <ul className="flex-parent flex-parent--column scroll-styled flex-child--grow">
        <div>
          {this.props.currentPage &&
            this.props.currentPage.get('features').map((f, k) => (
              <Row
                active={f.get('id') === this.props.activeChangesetId}
                properties={f.get('properties')}
                changesetId={f.get('id')}
                inputRef={
                  f.get('id') === this.props.activeChangesetId // only saves the ref of currently active changesetId
                    ? this.handleScroll
                    : null
                }
                key={k}
              />
            ))}
        </div>
      </ul>
    );
  }
}

List = loadingEnhancer(List);
List = connect((state: RootStateType, props) => ({
  token: state.auth.get('token')
}))(List);

export { List };
