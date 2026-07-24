import React from "react";
import { handleResponse } from "../../network/request.ts";
import { Button } from "../button.tsx";

interface WatchListUserProps {
  onSave: (username: string, uid: string) => void;
}

interface WatchListUserState {
  username: string;
  uid: string;
  isValidUsername: boolean;
  isValidUid: boolean;
  pending: boolean;
}

interface OsmUser {
  uid: string;
  username: string;
}

export class WatchListUser extends React.Component<
  WatchListUserProps,
  WatchListUserState
> {
  state: WatchListUserState = {
    username: "",
    uid: "",
    isValidUsername: true,
    isValidUid: true,
    pending: false,
  };
  // A username and uid identify the same OSM account 1:1. Editing one field
  // clears the other so the pair can never drift out of sync; adding re-derives
  // the missing half authoritatively from OSM.
  setUsername = (event: any) => {
    this.setState({
      username: event.target.value,
      uid: "",
      isValidUsername: true,
      isValidUid: true,
    });
  };
  setUid = (event: any) => {
    this.setState({
      uid: event.target.value,
      username: "",
      isValidUsername: true,
      isValidUid: true,
    });
  };

  fetchByUid = async (uid: string): Promise<OsmUser> => {
    const res = await fetch(
      `https://www.openstreetmap.org/api/0.6/user/${uid}.json`,
    );
    const data = await handleResponse<any>(res);
    return { uid: data.user.id.toString(), username: data.user.display_name };
  };

  fetchByUsername = async (username: string): Promise<OsmUser> => {
    const res = await fetch(
      `https://www.openstreetmap.org/api/0.6/changesets.json?display_name=${username}`,
    );
    const data = await handleResponse<any>(res);
    const changeset = data.changesets[0];
    if (!changeset) throw new Error("No changesets found for user");
    return this.fetchByUid(changeset.uid.toString());
  };

  // Resolve whichever identifier was entered to the canonical username/uid pair
  // from OSM, then hand it off. Verifying and adding are a single action.
  onAdd = async () => {
    const { uid, username, pending } = this.state;
    if (pending) return;
    const lookup =
      uid.length > 0
        ? this.fetchByUid(uid)
        : username.length > 0
          ? this.fetchByUsername(username)
          : null;
    if (!lookup) {
      this.setState({ isValidUsername: false, isValidUid: false });
      return;
    }
    this.setState({ pending: true });
    try {
      const user = await lookup;
      this.props.onSave(user.username, user.uid);
      this.setState({
        username: "",
        uid: "",
        isValidUsername: true,
        isValidUid: true,
        pending: false,
      });
    } catch {
      const byUid = uid.length > 0;
      this.setState({
        pending: false,
        isValidUid: !byUid,
        isValidUsername: byUid,
      });
    }
  };

  onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") this.onAdd();
  };

  render() {
    const errorClass = "border border--1 border--red";
    return (
      <span className="flex-parent flex-parent--row flex-parent--center-cross">
        <input
          className={`input ${this.state.isValidUsername ? "" : errorClass}`}
          value={this.state.username}
          onChange={this.setUsername}
          onKeyDown={this.onKeyDown}
          placeholder="Username"
          type="text"
        />
        <span className="txt-s txt-uppercase color-gray mx6">or</span>
        <input
          className={`input ${this.state.isValidUid ? "" : errorClass}`}
          value={this.state.uid}
          onChange={this.setUid}
          onKeyDown={this.onKeyDown}
          placeholder="UID"
          type="text"
        />
        <Button
          className="wmax120 ml12"
          onClick={this.onAdd}
          disabled={this.state.pending}
        >
          {this.state.pending ? "Adding..." : "Add"}
        </Button>
      </span>
    );
  }
}
