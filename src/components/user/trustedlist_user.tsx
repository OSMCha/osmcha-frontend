import React from "react";
import { Button } from "../button.tsx";

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

  onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const username = this.state.username;
    if (username && username.length > 0) {
      this.props.onSave(username);
      this.setState({ username: "" });
    }
  };

  render() {
    return (
      <form className="flex-parent flex-parent--row" onSubmit={this.onSubmit}>
        <input
          className="input"
          value={this.state.username}
          onChange={(e) => this.setState({ username: e.target.value })}
          placeholder="Username"
          type="text"
        />
        <Button className="btn wmax120 ml12" type="submit">
          Add
        </Button>
      </form>
    );
  }
}
