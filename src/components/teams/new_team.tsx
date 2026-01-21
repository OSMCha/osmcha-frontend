import { format } from "date-fns";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Link } from "react-router";
import "react-datepicker/dist/react-datepicker.css";

import { Button } from "../button";

interface TeamUser {
  username?: string;
  uid?: string;
  joined?: string;
  left?: string;
}

interface Team {
  id: number;
  name: string;
  users: TeamUser[];
}

interface NewTeamProps {
  editing?: boolean;
  activeTeam?: Team;
  onChange?: (id: number, teamName: string, teamUsers: TeamUser[]) => void;
  onCreate?: (teamName: string, teamUsers: TeamUser[]) => void;
  userIsOwner: boolean;
}

type ValidationResult = { valid: true } | { valid: false; error: string };

const NewTeam = (props: NewTeamProps) => {
  const [teamName, setTeamName] = useState("");
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([{}]);
  const [editing, setEditing] = useState(props.editing || false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");

  useEffect(() => {
    if (props.activeTeam) {
      setTeamName(props.activeTeam.name);
      const cleanedUsers = props.activeTeam.users.map((user) => {
        return Object.fromEntries(
          Object.entries(user).filter(([_, v]) => v !== undefined),
        );
      });
      setTeamUsers([...cleanedUsers]);
    }
  }, [props.activeTeam]);

  const onClickRemoveUser = (idx: number) => {
    const teamUsersToUpdate = [...teamUsers];
    teamUsersToUpdate.splice(idx, 1);
    setTeamUsers(teamUsersToUpdate);
  };

  const onClickAddAnotherUser = () => setTeamUsers([...teamUsers, {}]);

  const onChangeInput = (
    property: string,
    value: string | null,
    idx: number,
  ) => {
    const teamUsersToUpdate = [...teamUsers];
    teamUsersToUpdate[idx] = { ...teamUsersToUpdate[idx], [property]: value };
    setTeamUsers(teamUsersToUpdate);
  };

  const validateData = (): ValidationResult => {
    if (!teamName) {
      return { valid: false, error: "Team name cannot be empty." };
    }
    if (teamUsers) {
      try {
        if (
          teamUsers.filter((i) => "username" in i && i.username).length ===
          teamUsers.length
        ) {
          return { valid: true };
        } else {
          return {
            valid: false,
            error: "The username field should not be empty.",
          };
        }
      } catch (_err) {
        return {
          valid: false,
          error: "Verify if there is some wrong user information.",
        };
      }
    } else {
      return { valid: false, error: "Users cannot be empty" };
    }
  };

  const onSave = () => {
    const validation = validateData();

    if (validation.valid) {
      if (props.activeTeam && props.onChange) {
        props.onChange(props.activeTeam.id, teamName, teamUsers);
        setValidationErrorMessage("");
      } else if (props.onCreate) {
        props.onCreate(teamName, teamUsers);
        setEditing(false);
        setValidationErrorMessage("");
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

          <label className="txt-truncate pt6 txt-bold">
            Name<span className="color-red txt-s">*</span>
            <input
              required
              placeholder="New team name"
              className="input wmax180 mx3"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
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
                  value={user.username || ""}
                  onChange={(e) =>
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
                  value={user.uid || ""}
                  onChange={(e) =>
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
                  onChange={(date) =>
                    onChangeInput(
                      "joined",
                      date ? format(date, "yyyy-MM-dd") : null,
                      k,
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
                  onChange={(date) =>
                    onChangeInput(
                      "left",
                      date ? format(date, "yyyy-MM-dd") : null,
                      k,
                    )
                  }
                  disabled={!props.userIsOwner}
                />
              </label>
              <div className="px3">
                <br />
                <Button
                  disabled={teamUsers.length === 1}
                  onClick={(e) => {
                    e.preventDefault();
                    onClickRemoveUser(k);
                  }}
                  className="mt3 bg-transparent border--0 col w-1/5"
                  title="Remove user"
                >
                  <svg className="icon w24 h24">
                    <use xlinkHref="#icon-trash" />
                  </svg>
                </Button>
              </div>
            </form>
          ))}
          <Button className="mt6 mb2" onClick={onClickAddAnotherUser}>
            <svg className="icon txt-m mb3 inline-block align-middle">
              <use xlinkHref="#icon-plus" />
            </svg>
            Add user
          </Button>

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
                to={{ pathname: "/teams" }}
                className="input mx3 wmax120 bg-transparent border--white btn btn--s border--1-on-hover border--darken5 border--darken25-on-hover round bg-darken5-on-hover color-gray transition"
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
      ) : (
        <Button className="input wmax120 mt12" onClick={() => setEditing(true)}>
          <svg className={"icon txt-m mb3 inline-block align-middle"}>
            <use xlinkHref="#icon-plus" />
          </svg>
          New team
        </Button>
      )}
    </div>
  );
};

export default NewTeam;
