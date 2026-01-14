import React from "react";
import { Button } from "../button";

interface TrustedListUserProps {
  onSave: (username: string) => void;
}

interface TrustedListUserState {
  username: string;
}

export class TrustedListUser extends React.Component<
  TrustedListUserProps,
  TrustedListUserState
> {
  state: TrustedListUserState = {
    username: "",
  };

  onAdd = () => {
    const username = this.state.username;
    if (username && username.length > 0) {
      this.props.onSave(username);
      this.setState({ username: "" });
    }
  };

  render() {
    return (
      <span className="flex-parent flex-parent--row">
        <input
          className="input"
          onChange={(e) => this.setState({ username: e.target.value })}
          placeholder="Username"
          type="text"
        />
        <Button className="btn wmax120 ml12" onClick={this.onAdd}>
          Add
        </Button>
      </span>
    );
  }
}
