import React from 'react';
import PropTypes from 'prop-types';
import { API_URL } from '../../../config';
import { ThumbsDownIcon } from './ThumbsDownIcon';

export class FlagButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      flagState: null
    };
  }

  flagAsBad() {
    fetch(
      `${API_URL}/changesets/${this.props.changesetId}/review-feature/${this.props.type}-${this.props.id}/`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${this.props.token}`
        }
      }
    )
      .then(() => this.setState({ flagState: 'success' }))
      .catch(() => this.setState({ flagState: 'error' }));
  }

  removeFlag() {
    fetch(
      `${API_URL}/changesets/${this.props.changesetId}/review-feature/${this.props.type}-${this.props.id}/`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${this.props.token}`
        }
      }
    ).then(() => this.setState({ flagState: null }));
  }

  render() {
    return (
      <span>
        {this.state.flagState === null && (
          <button
            className="cmap-btn cmap-noselect cmap-pointer cmap-c-link-osm"
            onClick={() => this.flagAsBad()}
          >
            Add to flagged
          </button>
        )}
        {this.state.flagState === 'success' && (
          <button
            className="cmap-btn cmap-noselect cmap-pointer cmap-c-link-osm b--red bg-white"
            onClick={() => this.removeFlag()}
          >
            <ThumbsDownIcon style={{ verticalAlign: 'middle' }} />
            <span className="pl6">Flagged</span>
            <i className="gg-close"></i>
          </button>
        )}
        {this.state.flagState === 'error' && <span> Failed</span>}
      </span>
    );
  }
}

FlagButton.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  changesetId: PropTypes.number.isRequired
};
