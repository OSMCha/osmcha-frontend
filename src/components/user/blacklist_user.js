// @flow
import React from 'react';
import { Button } from '../button';
import { handleErrors } from '../../network/aoi';

export class BlackListUser extends React.Component {
  state = {
    username: '',
    uid: '',
    isValidUsername: true,
    isValidUid: true,
    verified: false
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
  fetchUsername = (username: string) =>
    fetch(
      `https://osm-comments-api.mapbox.com/api/v1/users/name/${
        this.state.username
      }`
    )
      .then(handleErrors)
      .then(r => r.json());

  fetchUid = (uid: string) =>
    fetch(`https://osm-comments-api.mapbox.com/api/v1/users/id/${uid}`)
      .then(handleErrors)
      .then(r => r.json());

  verifyInput = () => {
    if (this.state.uid.length > 0 && this.state.username.length === 0) {
      this.fetchUid(this.state.uid)
        .then(x => {
          return x;
        })
        .then(r => ({
          uid: r.id.toString(),
          username: r.name
        }))
        .then(r =>
          this.setState({
            username: r.username,
            uid: r.uid,
            verified: true,
            isValidUsername: true,
            isValidUid: true
          })
        )
        .catch(r => this.setState({ isValidUid: false, verified: false }));
    } else if (this.state.username.length > 0 && this.state.uid.length === 0) {
      this.fetchUsername(this.state.username)
        .then(r => ({
          uid: r.id.toString(),
          username: r.name
        }))
        .then(x => {
          return x;
        })
        .then(r =>
          this.setState({
            username: r.username,
            uid: r.uid,
            verified: true,
            isValidUsername: true,
            isValidUid: true
          })
        )
        .catch(r => this.setState({ isValidUsername: false, verified: false }));
    } else if (this.state.uid.length > 0 && this.state.username.length > 0) {
      Promise.all([
        this.fetchUid(this.state.uid).then(r => ({
          uid: r.id,
          username: r.name
        })),
        this.fetchUsername(this.state.username).then(r => ({
          uid: r.id,
          username: r.name
        }))
      ])
        .then(resp => {
          if (
            resp[0].uid === resp[1].uid &&
            resp[0].username === resp[1].username
          ) {
            window.alert('The user is valid');
            this.setState({ verified: true });
          } else {
            this.setState({ isValidUsername: false, isValidUid: false });
          }
        })
        .catch(e =>
          this.setState({ isValidUsername: false, isValidUid: false })
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
    const errorClass = 'border border--1 border--red';
    return (
      <span className="flex-parent flex-parent--row">
        <input
          className={`input ${this.state.isValidUsername ? '' : errorClass}`}
          value={this.state.username}
          onChange={this.setUsername}
          placeholder="Username"
          type="text"
        />
        <input
          className={`input ${this.state.isValidUid ? '' : errorClass}`}
          value={this.state.uid}
          onChange={this.setUid}
          placeholder="UID"
          type="text"
        />
        <Button className={'btn max120 ml12 '} onClick={this.verifyInput}>
          {this.state.verified ? 'Verified' : 'Verify'}
        </Button>
        <Button
          className={`btn wmax120 ml12 ${
            this.state.verified ? 'btn--green' : ''
          }`}
          onClick={this.onAdd}
        >
          Add
        </Button>
      </span>
    );
  }
}
