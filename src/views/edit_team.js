// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { push } from 'react-router-redux';

import { modal } from '../store/modal_actions';
import { logUserOut } from '../store/auth_actions';
import { cancelablePromise } from '../utils/promise';
import {
  fetchMappingTeam,
  updateMappingTeam,
  deleteMappingTeam
} from '../network/mapping_team';
import { withFetchDataSilent } from '../components/fetch_data_enhancer';
import { Avatar } from '../components/avatar';
import { Button } from '../components/button';
import { SaveButton } from './teams';
import type { RootStateType } from '../store';

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
class EditMappingTeam extends React.PureComponent<any, propsType, any> {
  updateTeamPromise;
  state = {
    userValues: null
  };

  componentWillUnmount() {
    this.createTeamPromise && this.createTeamPromise.cancel();
  }

  editTeam = (id: string, name: string, users: object) => {
    if (name === '' || !name || !users) return;
    this.updateTeamPromise = cancelablePromise(
      updateMappingTeam(this.props.token, id, name, users)
    );
    this.updateTeamPromise.promise
      .then(r => {
        this.props.modal({
          kind: 'success',
          title: 'Team Updated ',
          description: `The team ${name} was updated successfully!`
        });
        this.props.reloadData();
      })
      .catch(e => {
        this.props.modal({
          kind: 'error',
          title: 'Update failed ',
          error: e
        });
        console.error(e);
      });
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
            <span className="pl6 line45">Edit Mapping Team</span>
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
                  <h2 className="pl12 txt-xl mr6 border-b border--gray-light border--1">
                    <span className="txt-bold">Editing mapping team: </span>
                    {this.props.data.getIn(['team', 'name'])}
                  </h2>
                  <SaveButton
                    onChange={this.editTeam}
                    editing={true}
                    activeTeam={this.props.data.get('team')}
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
EditMappingTeam = withFetchDataSilent(
  (props: propsType) => ({
    team: cancelablePromise(fetchMappingTeam(props.token, props.teamId))
  }),
  (nextProps: propsType, props: propsType) => true,
  EditMappingTeam
);

EditMappingTeam = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    teamId: parseInt(props.match.params.id, 10),
    oAuthToken: state.auth.get('oAuthToken'),
    token: state.auth.get('token'),
    userDetails: state.auth.getIn(['userDetails'], Map())
  }),
  {
    modal,
    logUserOut,
    push
  }
)(EditMappingTeam);

export { EditMappingTeam };
