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
import { SecondaryPagesHeader } from '../components/secondary_pages_header';
import { Button } from '../components/button';
import { SignIn } from '../components/sign_in';
import type { RootStateType } from '../store';
import NewTeam from '../components/teams/new_team';
import { isMobile } from '../utils';

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
    const mobile = isMobile();

    return (
      <div
        className={`flex-parent flex-parent--column changesets-filters bg-white${
          mobile ? 'viewport-full' : ''
        }`}
      >
        <SecondaryPagesHeader
          title="Edit team"
          avatar={this.props.userDetails.get('avatar')}
        />
        {this.props.token ? (
          <div className="px30 flex-child  pb60  filters-scroll">
            <div className="flex-parent flex-parent--column align justify--space-between">
              <div>
                <div className="mt24 mb12">
                  <h2 className="pl12 txt-xl mr6 border-b border--gray-light border--1">
                    <strong>Editing mapping team: </strong>
                    {this.props.data.getIn(['team', 'name'])}
                  </h2>
                  <NewTeam
                    onChange={this.editTeam}
                    editing={true}
                    activeTeam={this.props.data.get('team')}
                    userIsOwner={
                      this.props.data.getIn(['team', 'owner']) ===
                      this.props.userDetails.get('username')
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <SignIn />
        )}
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
