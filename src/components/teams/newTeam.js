import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Button } from '../button';

const NewTeam = props => {
  const [teamName, setTeamName] = useState('');
  const [teamUsers, setTeamUsers] = useState([{}]);

  useEffect(() => console.log(teamUsers), [teamUsers]);

  useEffect(() => console.log(teamName), [teamName]);

  const onClickRemoveUser = idx => {
    let teamUsersToUpdate = [...teamUsers];
    teamUsersToUpdate.splice(idx, 1);
    setTeamUsers(teamUsersToUpdate);
  };

  const onClickAddOneMoreUser = () => setTeamUsers([...teamUsers, {}]);

  const onChangeInput = (property, value, idx) => {
    let teamUsersToUpdate = [...teamUsers];
    teamUsersToUpdate[idx] = { ...teamUsersToUpdate[idx], [property]: value };
    setTeamUsers(teamUsersToUpdate);
  };

  return (
    <>
      <strong className="txt-truncate pt6">Name</strong>
      <input
        placeholder="New team name"
        className="input wmax180"
        // ref={(r) => {
        //   if (this.clicked) {
        //     r && r.select();
        //     this.clicked = false;
        //   }
        // }}
        value={teamName}
        onChange={e => setTeamName(e.target.value)}
        // onKeyDown={this.onKeyDown}
        // disabled={!this.props.userIsOwner}
      />
      <strong className="txt-truncate pt6">Users</strong>
      {teamUsers.map((user, k) => (
        <form key={k} className="grid mb3">
          <label className="col w-1/5">
            Username
            <input
              className="input"
              type="text"
              required
              id="username"
              placeholder="Username"
              value={user.username || ''}
              onChange={e => onChangeInput(e.target.id, e.target.value, k)}
            />
          </label>
          <label className="col w-1/5">
            UID
            <input
              className="input"
              type="text"
              id="uid"
              placeholder="User UID"
              value={user.uid || ''}
              onChange={e => onChangeInput(e.target.id, e.target.value, k)}
            />
          </label>
          <label className="col w-1/5">
            Joined the team
            <input
              className="input"
              type="date"
              placeholder="Joined the team"
              id="joined"
              value={user.joined || ''}
              onChange={e => onChangeInput(e.target.id, e.target.value, k)}
            />
          </label>
          <label className="col w-1/5">
            Left the team
            <input
              className="input"
              type="date"
              id="left"
              value={user.left || ''}
              onChange={e => onChangeInput(e.target.id, e.target.value, k)}
            />
          </label>
          <label>
            <br></br>
            <Button
              onClick={e => {
                e.preventDefault();
                onClickRemoveUser(k);
              }}
              className="input col w-1/5"
            >
              <svg className="icon w24 h24">
                <use xlinkHref="#icon-trash" />
              </svg>
            </Button>
          </label>
        </form>
      ))}
      <Button onClick={onClickAddOneMoreUser}>Add one more user</Button>
    </>
  );
};

NewTeam.propTypes = {
  teamUsers: PropTypes.arrayOf(PropTypes.object),
  onClickRemoveUser: PropTypes.func,
  onClickAddOneMoreUser: PropTypes.func,
  onChangeInput: PropTypes.func
};

export default NewTeam;
