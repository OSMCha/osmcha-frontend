import React from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { push } from 'react-router-redux';

import { modal } from '../store/modal_actions';
import { logUserOut } from '../store/auth_actions';
import { cancelablePromise, isMobile } from '../utils';
import {
  createMappingTeam,
  fetchUserMappingTeams,
  deleteMappingTeam,
} from '../network/mapping_team';
import { Link } from 'react-router-dom';
import { withFetchDataSilent } from '../components/fetch_data_enhancer';
import { Button } from '../components/button';
import { SecondaryPagesHeader } from '../components/secondary_pages_header';
import { BlockMarkup } from '../components/user/block_markup';
import type { RootStateType } from '../store';
import type { filterOptionsType, filterType } from '../components/filters';

import NewTeam from '../components/teams/new_team';

export type teamsOptionsType = Map<
  'label' | 'value',
  string | undefined | null
>;
export type teamType = List<filterOptionsType>;
export type teamsType = Map<string, filterType>;

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
            'name',
          ])}","value":"${data.getIn(['name'])}"}]}`,
          pathname: '/filters',
        }}
      >
        Changesets
      </Link>
      <Link
        className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken5 bg-lighten25-on-hover color-gray transition"
        to={{ pathname: `/teams/${data.getIn(['id'])}` }}
      >
        Edit
      </Link>
      <Button
        className="mr3 bg-transparent border--0"
        onClick={() => removeTeam(data.getIn(['id']))}
      >
        <svg className={'icon txt-m mb3 inline-block align-middle'}>
          <use xlinkHref="#icon-trash" />
        </svg>
        Delete
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
  SaveComp,
}) => (
  <div>
    {data.map((e, i) => (
      <TargetBlock key={i} data={e} {...propsToPass} />
    ))}
    {SaveComp}
  </div>
);

type propsType = {
  avatar: string | undefined | null;
  token: string;
  data: Map<string, any>;
  location: any;
  userDetails: Map<string, any>;
  reloadData: () => any;
  logUserOut: () => any;
  push: (a: any) => any;
  modal: (a: any) => any;
};

class _MappingTeams extends React.PureComponent<propsType, any> {
  createTeamPromise;
  state = {
    userValues: null,
    addingTeam: false,
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
      .then((r) => {
        this.props.modal({
          kind: 'success',
          title: 'Team Created ',
          description: `The team ${name} was created successfully!`,
        });
        this.props.reloadData();
        this.setState({ addingTeam: false });
      })
      .catch((e) => console.error(e));
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
          title="Teams"
          avatar={this.props.userDetails.get('avatar')}
        />
        <div className="px30 flex-child  pb60  filters-scroll">
          <div className="flex-parent flex-parent--column align justify--space-between">
            {this.props.token && (
              <div>
                <div className="mt24 mb12">
                  <ListFortified
                    onAdd={() => {}}
                    onRemove={() => {}}
                    data={this.props.data.getIn(['teams'], List())}
                    TargetBlock={TeamsBlock}
                    propsToPass={{
                      removeTeam: this.removeTeam,
                    }}
                    SaveComp={
                      <NewTeam
                        onCreate={this.createTeam}
                        editing={this.state.addingTeam}
                        userIsOwner={true}
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
const MappingTeamsWithData = withFetchDataSilent(
  (props: propsType) => ({
    teams: cancelablePromise(
      fetchUserMappingTeams(props.token, props.userDetails.get('username'))
    ),
  }),
  (nextProps: propsType, props: propsType) => true,
  _MappingTeams
);

const MappingTeams = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    oAuthToken: state.auth.get('oAuthToken'),
    token: state.auth.get('token'),
    userDetails: state.auth.getIn(['userDetails'], Map()),
  }),
  {
    modal,
    logUserOut,
    push,
  }
)(MappingTeamsWithData);

export { MappingTeams };
