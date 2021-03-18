import React from 'react';

import { Button } from '../button';
import { WatchListUser } from './watchlist_user';
import { TrustedListUser } from './trustedlist_user';

export class SaveUser extends React.PureComponent {
  state = {
    showInput: false
  };
  onSave = (username, uid) => {
    if (this.props.forWatchlist) {
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
            {this.props.forWatchlist ? (
              <WatchListUser onSave={this.onSave} />
            ) : (
              <TrustedListUser onSave={this.onSave} />
            )}
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
