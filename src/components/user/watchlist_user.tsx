import React from "react";
import { handleErrors } from "../../network/aoi";
import { Button } from "../button";

interface WatchListUserProps {
  onSave: (username: string, uid: string) => void;
}

interface WatchListUserState {
  username: string;
  uid: string;
  isValidUsername: boolean;
  isValidUid: boolean;
  verified: boolean;
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
    verified: false,
  };
  setUsername = (event: any) => {
    const target = event.target;
    const value = target.value;
    this.setState({ username: value, isValidUsername: true, verified: false });
  };
  setUid = (event: any) => {
    const target = event.target;
    const value = target.value;
    this.setState({ uid: value, isValidUid: true, verified: false });
  };
  fetchUsername = () =>
    fetch(
      `https://www.openstreetmap.org/api/0.6/changesets.json?display_name=${this.state.username}`,
    )
      .then(handleErrors)
      .then((r) => r.json())
      .then((r) => {
        try {
          return r.changesets[0].uid;
        } catch (_e) {
          throw new Error("No changesets found for user");
        }
      });

  fetchUid = (uid: string) =>
    fetch(`https://www.openstreetmap.org/api/0.6/user/${uid}.json`)
      .then(handleErrors)
      .then((r) => r.json());

  verifyInput = () => {
    if (this.state.uid.length > 0 && this.state.username.length === 0) {
      this.fetchUid(this.state.uid)
        .then((r) => ({
          uid: r.user.id.toString(),
          username: r.user.display_name,
        }))
        .then((r) =>
          this.setState({
            username: r.username,
            uid: r.uid,
            verified: true,
            isValidUsername: true,
            isValidUid: true,
          }),
        )
        .catch(() => this.setState({ isValidUid: false, verified: false }));
    } else if (this.state.username.length > 0 && this.state.uid.length === 0) {
      this.fetchUsername(this.state.username)
        .then((r) => ({
          uid: r.toString(),
          username: this.state.username,
        }))
        .then((x) => {
          return x;
        })
        .then((r) =>
          this.setState({
            username: r.username,
            uid: r.uid,
            verified: true,
            isValidUsername: true,
            isValidUid: true,
          }),
        )
        .catch(() =>
          this.setState({ isValidUsername: false, verified: false }),
        );
    } else if (this.state.uid.length > 0 && this.state.username.length > 0) {
      Promise.all([
        this.fetchUid(this.state.uid).then((r) => ({
          uid: r.id,
          username: r.name,
        })),
        this.fetchUsername(this.state.username).then((r) => ({
          uid: r.id,
          username: r.name,
        })),
      ])
        .then((resp) => {
          if (
            resp[0].uid === resp[1].uid &&
            resp[0].username === resp[1].username
          ) {
            window.alert("The user is valid");
            this.setState({ verified: true });
          } else {
            this.setState({ isValidUsername: false, isValidUid: false });
          }
        })
        .catch(() =>
          this.setState({ isValidUsername: false, isValidUid: false }),
        );
    }
  };
  onAdd = () => {
    const username = this.state.username;
    const uid = this.state.uid;
    if (username && username.length > 0 && uid && uid.length > 0) {
      this.props.onSave(username, uid);
    } else {
      this.setState({ isValidUsername: false, isValidUid: false });
    }
  };

  render() {
    const errorClass = "border border--1 border--red";
    return (
      <span className="flex-parent flex-parent--row">
        <input
          className={`input ${this.state.isValidUsername ? "" : errorClass}`}
          style={{ marginRight: "6px !important" }}
          value={this.state.username}
          onChange={this.setUsername}
          placeholder="Username"
          type="text"
        />
        <input
          className={`input ${this.state.isValidUid ? "" : errorClass}`}
          value={this.state.uid}
          onChange={this.setUid}
          placeholder="UID"
          type="text"
        />
        <Button
          className={"wmax180 ml12 bg-transparent border--0"}
          onClick={this.verifyInput}
        >
          {this.state.verified ? "Verified" : "Verify"}
        </Button>
        <Button
          className={`btn wmax120 ml12 ${
            this.state.verified ? "btn--green" : ""
          }`}
          onClick={this.onAdd}
        >
          Add
        </Button>
      </span>
    );
  }
}
