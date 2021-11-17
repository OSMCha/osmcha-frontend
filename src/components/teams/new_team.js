import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { BASE_PATH } from '../../config';
import { Button } from '../button';

const NewTeam = props => {
  const [teamName, setTeamName] = useState('');
  const [teamUsers, setTeamUsers] = useState([{}]);
  const [editing, setEditing] = useState(props.editing || false);
  const [validationErrorMessage, setValidationErrorMessage] = useState('');

  useEffect(() => {
    if (props.activeTeam) {
      setTeamName(props.activeTeam.get('name'));
      let users = [];
      props.activeTeam.get('users').map(user =>
        users.push({
          username: user.get('username'),
          uid: user.get('uid'),
          joined: user.get('joined'),
          left: user.get('left')
        })
      );
      let cleanedUsers = [];
      users.forEach((user, k) => {
        let u = Object.fromEntries(
          Object.entries(user).filter(([_, v]) => v !== undefined)
        );
        cleanedUsers.push(u);
      });
      setTeamUsers([...cleanedUsers]);
    }
  }, [props.activeTeam]);

  const onClickRemoveUser = idx => {
    let teamUsersToUpdate = [...teamUsers];
    teamUsersToUpdate.splice(idx, 1);
    setTeamUsers(teamUsersToUpdate);
  };

  const onClickAddAnotherUser = () => setTeamUsers([...teamUsers, {}]);

  const onChangeInput = (property, value, idx) => {
    let teamUsersToUpdate = [...teamUsers];
    teamUsersToUpdate[idx] = { ...teamUsersToUpdate[idx], [property]: value };
    setTeamUsers(teamUsersToUpdate);
  };

  const validateData = () => {
    if (!teamName) {
      return { valid: false, error: 'Team name cannot be empty.' };
    }
    if (teamUsers) {
      try {
        if (
          teamUsers.filter(i => i.hasOwnProperty('username')).length ===
          teamUsers.length
        ) {
          return { valid: true };
        } else {
          return {
            valid: false,
            error: 'The username field should not be empty.'
          };
        }
      } catch (err) {
        return {
          valid: false,
          error: 'Verify if there is some wrong user information.'
        };
      }
    } else {
      return { valid: false, error: 'Users cannot be empty' };
    }
  };

  const onSave = e => {
    const validation = validateData();

    if (validation.valid) {
      if (props.activeTeam) {
        props.onChange(props.activeTeam.get('id'), teamName, teamUsers);
        setValidationErrorMessage('');
      } else {
        props.onCreate(teamName, teamUsers);
        setEditing(false);
        setValidationErrorMessage('');
      }
    } else {
      setValidationErrorMessage(validation.error);
    }
  };

  return (
    <div className="px12">
      {editing ? (
        <>
          {props.activeTeam ? (
            <></>
          ) : (
            <h3 className="txt-h4 txt-bold pt12">Add a new mapping team</h3>
          )}
          <>
            <label className="txt-truncate pt6 txt-bold">
              Name<span className="color-red txt-s">*</span>
              <input
                required
                placeholder="New team name"
                className="input wmax180 mx3"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                disabled={!props.userIsOwner}
              />
            </label>
            <strong className="txt-truncate pt6">Users</strong>
            {teamUsers.map((user, k) => (
              <form key={k} className="grid mb3">
                <label className="px3 col w-1/5">
                  Username<span className="color-red txt-s">*</span>
                  <input
                    className="input"
                    type="text"
                    required
                    id="username"
                    placeholder="Username"
                    value={user.username || ''}
                    onChange={e =>
                      onChangeInput(e.target.id, e.target.value, k)
                    }
                    disabled={!props.userIsOwner}
                  />
                </label>
                <label className="px3 col w-1/5">
                  UID
                  <input
                    className="input"
                    type="text"
                    id="uid"
                    placeholder="User UID"
                    value={user.uid || ''}
                    onChange={e =>
                      onChangeInput(e.target.id, e.target.value, k)
                    }
                    disabled={!props.userIsOwner}
                  />
                </label>
                <label className="px3 col w-1/5">
                  <span className="block">Joined the team</span>
                  <DatePicker
                    className="input block date-width-full"
                    dateFormat="yyyy-MM-dd"
                    isClearable={true}
                    placeholderText="When user joined the team"
                    selected={user.joined ? Date.parse(user.joined) : null}
                    onChange={date =>
                      onChangeInput(
                        'joined',
                        date ? format(date, 'yyyy-MM-dd') : null,
                        k
                      )
                    }
                    disabled={!props.userIsOwner}
                  />
                </label>
                <label className="px3 col w-1/5">
                  Left the team
                  <DatePicker
                    className="input block date-width-full"
                    dateFormat="yyyy-MM-dd"
                    isClearable={true}
                    placeholderText="When user left the team"
                    selected={user.left ? Date.parse(user.left) : null}
                    onChange={date =>
                      onChangeInput(
                        'left',
                        date ? format(date, 'yyyy-MM-dd') : null,
                        k
                      )
                    }
                    disabled={!props.userIsOwner}
                  />
                </label>
                <label className="px3">
                  <br></br>
                  <Button
                    disabled={teamUsers.length === 1}
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
            <Button onClick={onClickAddAnotherUser}>Add another user</Button>

            <p className="txt-light txt-truncate pt6">
              The mapping team members are <strong>public</strong> and can be
              visualized by any logged in OSMCha user.
            </p>

            {validationErrorMessage && (
              <span className="flex-parent flex-parent--row mt12 color-red-dark txt-bold">
                {validationErrorMessage}
              </span>
            )}

            <span className="flex-parent flex-parent--row mt12">
              {props.userIsOwner && (
                <Button className="input wmax120" onClick={onSave}>
                  Save
                </Button>
              )}
              {props.activeTeam ? (
                <Link
                  to={{ pathname: `${BASE_PATH}/teams` }}
                  className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition input wmax120 ml6"
                >
                  Back to teams
                </Link>
              ) : (
                <Button
                  className="input wmax120 ml6"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </span>
          </>
        </>
      ) : (
        <>
          <Button className="input wmax120" onClick={() => setEditing(true)}>
            Add+
          </Button>
        </>
      )}
    </div>
  );
};

NewTeam.propTypes = {
  teamUsers: PropTypes.arrayOf(PropTypes.object),
  teamName: PropTypes.string,
  editing: PropTypes.bool,
  validationErrorMessage: PropTypes.string,
  onClickRemoveUser: PropTypes.func,
  onClickAddAnotherUser: PropTypes.func,
  onChangeInput: PropTypes.func,
  onSave: PropTypes.func,
  validateData: PropTypes.func
};

export default NewTeam;
