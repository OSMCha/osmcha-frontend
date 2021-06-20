import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Button } from '../button';

const NewTeam = props => {
  const [teamUsers, setTeamUsers] = useState([{}]);

  useEffect(() => {
    console.log(teamUsers);
  }, [teamUsers]);

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
              {/* <svg class="icon">
            <use xlink:href="#icon-trash" />
          </svg> */}
              X
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
