import React from "react";

import { Button } from "../button.tsx";
import { TrustedListUser } from "./trustedlist_user.tsx";
import { WatchListUser } from "./watchlist_user.tsx";

interface SaveUserProps {
  forWatchlist?: boolean;
  onCreate: (data: any) => void;
}

interface SaveUserState {
  showInput: boolean;
}

export class SaveUser extends React.PureComponent<
  SaveUserProps,
  SaveUserState
> {
  state: SaveUserState = {
    showInput: false,
  };
  onSave = (username: string, uid?: number | string) => {
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
            className="input wmax120 ml12 mt12"
            onClick={() => this.setState({ showInput: true })}
          >
            <svg className={"icon txt-m mb3 inline-block align-middle"}>
              <use xlinkHref="#icon-plus" />
            </svg>
            Add User
          </Button>
        )}
      </span>
    );
  }
}
