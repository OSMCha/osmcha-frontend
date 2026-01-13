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
  deleteMappingTeam,
} from '../network/mapping_team';
import { withFetchDataSilent } from '../components/fetch_data_enhancer';
import { SecondaryPagesHeader } from '../components/secondary_pages_header';
import { SignIn } from '../components/sign_in';
import type { RootStateType } from '../store';
import NewTeam from '../components/teams/new_team';
import { isMobile } from '../utils';

type propsType = {
  avatar: string | undefined | null;
  token: string;
  teamId: number;
  data: Map<string, any>;
  location: any;
  userDetails: Map<string, any>;
  reloadData: () => any;
  logUserOut: () => any;
  push: (a: any) => any;
  modal: (a: any) => any;
};

class _EditMappingTeam extends React.PureComponent<propsType, any> {
  updateTeamPromise: any;
  createTeamPromise: { promise: Promise<any>; cancel(): void } | null = null;
  state = {
    userValues: null,
  };

  componentWillUnmount() {
    this.createTeamPromise && this.createTeamPromise.cancel();
  }

  editTeam = (id: string, name: string, users: object) => {
    if (name === '' || !name || !users) return;
    this.updateTeamPromise = cancelablePromise(
      updateMappingTeam(this.props.token, parseInt(id, 10), name, users)
    );
    this.updateTeamPromise.promise
      .then((r) => {
        this.props.modal({
          kind: 'success',
          title: 'Team Updated ',
          description: `The team ${name} was updated successfully!`,
        });
        this.props.reloadData();
      })
      .catch((e) => {
        this.props.modal({
          kind: 'error',
          title: 'Update failed ',
          error: e,
        });
        console.error(e);
      });
  };

  removeTeam = (teamId: string) => {
    if (!teamId) return;
    deleteMappingTeam(this.props.token, parseInt(teamId, 10))
      .then((r) => {
        this.props.modal({
          kind: 'success',
          title: 'Team Deleted ',
          description: `The team with id ${teamId} was deleted`,
        });
        this.props.reloadData();
      })
      .catch((e) => {
        this.props.reloadData();
        this.props.modal({
          kind: 'error',
          title: 'Deletion failed ',
          error: e,
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
const _EditMappingTeamWithData = withFetchDataSilent(
  (props: propsType) => ({
    team: cancelablePromise(fetchMappingTeam(props.token, props.teamId)),
  }),
  (nextProps: propsType, props: propsType) => true,
  _EditMappingTeam
);

const EditMappingTeam = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    teamId: parseInt(props.match.params.id, 10),
    oAuthToken: state.auth.get('oAuthToken'),
    token: state.auth.get('token'),
    userDetails: state.auth.getIn(['userDetails'], Map()),
  }),
  {
    modal,
    logUserOut,
    push,
  }
)(_EditMappingTeamWithData);

export { EditMappingTeam };
