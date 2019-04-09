// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { push } from 'react-router-redux';

import { modal } from '../store/modal_actions';
import { logUserOut } from '../store/auth_actions';
import { cancelablePromise } from '../utils/promise';
import {
  createMappingTeam,
  fetchUserMappingTeams,
  deleteMappingTeam
} from '../network/mapping_team';
import { Link } from 'react-router-dom';
import { withFetchDataSilent } from '../components/fetch_data_enhancer';
import { Avatar } from '../components/avatar';
import { Button } from '../components/button';
import { BlockMarkup } from '../components/user/block_markup';
import type { RootStateType } from '../store';

export type teamsOptionsType = Map<'label' | 'value', ?string>;
export type teamType = List<filterOptionsType>;
export type teamsType = Map<string, filterType>;

class SaveButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: props.editing || false,
      teamName: '',
      teamUsers: [],
      validationErrorMessage: ''
    };
  }
  ref;
  clicked = false;
  componentWillReceiveProps(nextProps) {
    if (nextProps.activeTeam) {
      this.setState({
        teamName: nextProps.activeTeam.get('name')
      });
      this.setState({
        teamUsers: JSON.stringify(
          Array.from(nextProps.activeTeam.get('users')).map(i =>
            Object.fromEntries(i)
          )
        )
      });
    }
  }
  onClick = event => {
    this.clicked = true;
    this.setState({ editing: true });
  };
  onChangeTeamName = (event: any) => {
    this.setState({ teamName: event.target.value });
  };
  onChangeTeamUsers = (event: any) => {
    this.setState({ teamUsers: event.target.value });
  };
  onKeyDown = event => {
    if (event.keyCode === 27 && this.props.activeTeam === undefined) {
      this.setState({
        editing: false
      });
      this.clicked = false;
    }
  };
  validateData() {
    if (!this.state.teamName) {
      return { valid: false, error: 'Team name cannot be empty.' };
    }
    if (this.state.teamUsers) {
      try {
        const users = JSON.parse(this.state.teamUsers);
        if (typeof users !== 'object') {
          return { valid: false, error: 'User must be a JSON array' };
        }
        if (
          users.filter(i => i.hasOwnProperty('username')).length ===
          users.length
        ) {
          return { valid: true };
        } else {
          return {
            valid: false,
            error:
              'Each object inside the array needs to have a username property.'
          };
        }
      } catch (e) {
        return {
          valid: false,
          error:
            'Verify if you pasted a correctly formated JSON array in the users field.'
        };
      }
    } else {
      return { valid: false, error: 'Users cannot be empty' };
    }
  }
  onSave = event => {
    const validation = this.validateData();

    if (validation.valid) {
      if (this.props.activeTeam) {
        this.props.onChange(
          this.props.activeTeam.get('id'),
          this.state.teamName,
          JSON.parse(this.state.teamUsers)
        );
        this.setState({ validationErrorMessage: '' });
      } else {
        this.props.onCreate(
          this.state.teamName,
          JSON.parse(this.state.teamUsers)
        );
        this.setState({
          editing: false,
          validationErrorMessage: ''
        });
      }
    } else {
      this.setState({ validationErrorMessage: validation.error });
    }
  };
  render() {
    return (
      <span>
        {this.state.editing ? (
          <div className="pt18">
            {this.props.activeTeam ? (
              <span />
            ) : (
              <div className="txt-h4 txt-bold">Add a new mapping team</div>
            )}
            <span className="txt-bold txt-truncate pt6">Name</span>
            <input
              placeholder="New team name"
              className="input wmax180"
              ref={r => {
                if (this.clicked) {
                  r && r.select();
                  this.clicked = false;
                }
              }}
              value={this.state.teamName}
              onChange={this.onChangeTeamName}
              onKeyDown={this.onKeyDown}
            />
            <span className="txt-bold txt-truncate pt6">Users</span>
            <textarea
              placeholder={`[{"username": "name"}, {"username": "other_user"}]`}
              className="textarea h180"
              ref={r => {
                if (this.clicked) {
                  r && r.select();
                  this.clicked = false;
                }
              }}
              value={this.state.teamUsers}
              onChange={this.onChangeTeamUsers}
              onKeyDown={this.onKeyDown}
            />
            <span className="txt-light txt-truncate pt6">
              Check the{' '}
              <a
                className="link"
                href="https://github.com/mapbox/osmcha-frontend/wiki/Mapping-Teams"
                target="_blank"
                rel="noopener noreferrer"
              >
                reference
              </a>{' '}
              about the users field JSON format.
            </span>
            {this.state.validationErrorMessage && (
              <span className="flex-parent flex-parent--row mt12 color-red-dark txt-bold">
                {this.state.validationErrorMessage}
              </span>
            )}
            <span className="flex-parent flex-parent--row mt12">
              <Button className="input wmax120 ml6" onClick={this.onSave}>
                Save
              </Button>
              {this.props.activeTeam ? (
                <Link
                  to={{ pathname: '/teams' }}
                  className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition input wmax120 ml6"
                >
                  Back to teams
                </Link>
              ) : (
                <Button
                  className="input wmax120 ml6"
                  onClick={() => this.setState({ editing: false })}
                >
                  Cancel
                </Button>
              )}
            </span>
          </div>
        ) : (
          <Button className="input wmax120 ml12" onClick={this.onClick}>
            Add+
          </Button>
        )}
      </span>
    );
  }
}

const TeamsBlock = ({ data, removeTeam, editTeam }) => (
  <BlockMarkup>
    <span>
      <span>{data.get('name')}</span>
    </span>
    <span>
      <Link
        className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
        to={{
          search: `filters={"mapping_teams":[{"label":"${data.getIn([
            'name'
          ])}","value":"${data.getIn(['name'])}"}]}`,
          pathname: '/filters'
        }}
      >
        Filter team changesets
      </Link>
      <Link
        className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
        to={{ pathname: `/team/${data.getIn(['id'])}` }}
      >
        Edit
      </Link>
      <Button className="mr3" onClick={() => removeTeam(data.getIn(['id']))}>
        Remove
      </Button>
    </span>
  </BlockMarkup>
);

const ListFortified = ({
  onAdd,
  onRemove,
  data,
  TargetBlock,
  propsToPass,
  SaveComp
}) => (
  <div>
    {data.map((e, i) => (
      <TargetBlock key={i} data={e} {...propsToPass} />
    ))}
    {SaveComp}
  </div>
);

type propsType = {
  avatar: ?string,
  token: string,
  data: Map<string, any>,
  location: Object,
  userDetails: Map<string, any>,
  reloadData: () => any,
  logUserOut: () => any,
  push: any => any,
  modal: any => any
};
class MappingTeams extends React.PureComponent<any, propsType, any> {
  createTeamPromise;
  state = {
    userValues: null,
    addingTeam: false
  };

  componentWillUnmount() {
    this.createTeamPromise && this.createTeamPromise.cancel();
  }

  createTeam = (name: string, users: object) => {
    if (name === '' || !name || !users) return;
    this.setState({ addingTeam: true });
    this.createTeamPromise = cancelablePromise(
      createMappingTeam(this.props.token, name, users)
    );
    this.createTeamPromise.promise
      .then(r => {
        this.props.modal({
          kind: 'success',
          title: 'Team Created ',
          description: `The team ${name} was created successfully!`
        });
        this.props.reloadData();
        this.setState({ addingTeam: false });
      })
      .catch(e => console.error(e));
  };

  removeTeam = (teamId: string) => {
    if (!teamId) return;
    deleteMappingTeam(this.props.token, teamId)
      .then(r => {
        this.props.modal({
          kind: 'success',
          title: 'Team Deleted ',
          description: `The team with id ${teamId} was deleted`
        });
        this.props.reloadData();
      })
      .catch(e => {
        this.props.reloadData();
        this.props.modal({
          kind: 'error',
          title: 'Deletion failed ',
          error: e
        });
      });
  };

  render() {
    return (
      <div
        className={`flex-parent flex-parent--column changesets-filters bg-white${
          window.innerWidth < 800 ? 'viewport-full' : ''
        }`}
      >
        <header className="h55 hmin55 flex-parent px30 bg-gray-faint flex-parent--center-cross justify--space-between color-gray border-b border--gray-light border--1">
          <span className="txt-l txt-bold color-gray--dark">
            <span className="fl">
              <Avatar size={36} url={this.props.userDetails.get('avatar')} />
            </span>
            <span className="pl6 line45">My Mapping Teams</span>
          </span>

          <span className="txt-l color-gray--dark">
            <Button
              onClick={this.props.logUserOut}
              className="bg-white-on-hover"
            >
              Logout
            </Button>
          </span>
        </header>
        <div className="px30 flex-child  pb60  filters-scroll">
          <div className="flex-parent flex-parent--column align justify--space-between">
            {this.props.token && (
              <div>
                <div className="mt24 mb12">
                  <h2 className="pl12 txt-xl mr6 txt-bold border-b border--gray-light border--1">
                    <span className="txt-bold">My mapping teams</span>
                  </h2>
                  <ListFortified
                    data={this.props.data.getIn(['teams'], List())}
                    TargetBlock={TeamsBlock}
                    propsToPass={{
                      removeTeam: this.removeTeam
                    }}
                    SaveComp={
                      <SaveButton
                        onCreate={this.createTeam}
                        editing={this.state.addingTeam}
                      />
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
/**
 * Never use props not required by the Basecomponent in HOCs
 */
MappingTeams = withFetchDataSilent(
  (props: propsType) => ({
    teams: cancelablePromise(
      fetchUserMappingTeams(props.token, props.userDetails.get('username'))
    )
  }),
  (nextProps: propsType, props: propsType) => true,
  MappingTeams
);

MappingTeams = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    oAuthToken: state.auth.get('oAuthToken'),
    token: state.auth.get('token'),
    userDetails: state.auth.getIn(['userDetails'], Map())
  }),
  {
    modal,
    logUserOut,
    push
  }
)(MappingTeams);

export { MappingTeams, SaveButton };
