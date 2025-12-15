// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Row } from './row';
import { SignInButton } from '../changeset/sign_in_button.js';
import { Button } from '../button';
import { elementInViewport } from '../../utils/element_in_view';
import { loadingEnhancer } from '../loading_enhancer';

type propTypes = {
  currentPage: ?Map<string, *>,
  activeChangesetId: ?number,
  pageIndex: number
};

class List extends React.Component<void, propTypes, *> {
  state = {
    displayCount: 10 // Start by showing 10 changesets
  };

  shouldComponentUpdate(nextProps: propTypes, nextState) {
    return (
      nextProps.activeChangesetId !== this.props.activeChangesetId ||
      nextProps.currentPage !== this.props.currentPage ||
      nextState.displayCount !== this.state.displayCount
    );
  }

  componentDidUpdate(prevProps) {
    // Reset display count when page changes
    if (prevProps.currentPage !== this.props.currentPage) {
      this.setState({ displayCount: 10 });
    }
  }

  handleScroll = (r: HTMLElement) => {
    if (!r) return;
    if (!elementInViewport(r)) {
      r.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  };

  handleLoadMore = () => {
    this.setState(prevState => ({
      displayCount: prevState.displayCount + 10
    }));
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

    // Handle case when currentPage is null/undefined (during initial load)
    if (!this.props.currentPage) {
      return (
        <div className="flex-parent flex-parent--column flex-child--grow">
          <ul className="flex-parent flex-parent--column scroll-styled flex-child--grow">
            <div />
          </ul>
        </div>
      );
    }

    const features = this.props.currentPage.get('features');
    const totalCount = features?.size || 0;

    // Handle case when features is null/undefined or empty
    if (!features || totalCount === 0) {
      return (
        <div className="flex-parent flex-parent--column flex-child--grow">
          <ul className="flex-parent flex-parent--column scroll-styled flex-child--grow">
            <div className="flex-parent flex-parent--column flex-parent--center-cross flex-parent--center-main py36">
              <svg className="icon icon--xxl color-darken25">
                <use xlinkHref="#icon-contact" />
              </svg>
              <p className="txt-m mt12">No changesets found.</p>
            </div>
          </ul>
        </div>
      );
    }

    const displayedFeatures = features.slice(0, this.state.displayCount);
    const hasMore = this.state.displayCount < totalCount;

    return (
      <div className="flex-parent flex-parent--column flex-child--grow">
        <ul className="flex-parent flex-parent--column scroll-styled flex-child--grow">
          <div>
            {displayedFeatures.map((f, k) => (
              <Row
                active={f.get('id') === this.props.activeChangesetId}
                properties={f.get('properties')}
                changesetId={f.get('id')}
                inputRef={
                  f.get('id') === this.props.activeChangesetId
                    ? this.handleScroll
                    : null
                }
                key={k}
              />
            ))}
          </div>
        </ul>

        {hasMore && (
          <div className="flex-parent flex-parent--center-main p12 border-t border--gray-light bg-gray-faint">
            <Button onClick={this.handleLoadMore} className="wmin180">
              Load More ({this.state.displayCount} of {totalCount})
            </Button>
          </div>
        )}
      </div>
    );
  }
}

List = loadingEnhancer(List);
List = connect((state: RootStateType, props) => ({
  token: state.auth.get('token')
}))(List);

export { List };
