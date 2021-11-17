// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';

import { modal } from '../store/modal_actions';
import { logUserOut } from '../store/auth_actions';
import { applyFilters } from '../store/filters_actions';
import { cancelablePromise, isMobile } from '../utils';
import { fetchAllAOIs } from '../network/aoi';
import { createAOI, deleteAOI } from '../network/aoi';
import { withFetchDataSilent } from '../components/fetch_data_enhancer';
import { SecondaryPagesHeader } from '../components/secondary_pages_header';
import { Button } from '../components/button';
import { CustomURL } from '../components/customURL';
import { BlockMarkup } from '../components/user/block_markup';
import type { filtersType } from '../components/filters';
import type { RootStateType } from '../store';
import { API_URL, BASE_PATH } from '../config';

class SaveButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }
  ref;
  clicked = false;
  onClick = event => {
    this.clicked = true;
    this.setState({ editing: true });
  };
  onChange = (event: any) => {
    this.setState({ value: event.target.value });
  };
  onKeyDown = event => {
    if (event.keyCode === 13) {
      this.setState({
        editing: false
      });
      this.props.onCreate(this.state.value);
    } else if (event.keyCode === 27) {
      this.setState({
        editing: false
      });
      this.clicked = false;
    }
  };
  onSave = event => {
    this.setState({
      editing: false
    });
    this.props.onCreate(this.state.value);
  };
  render() {
    return (
      <span>
        {this.state.editing ? (
          <span className="flex-parent flex-parent--row ">
            <input
              placeholder={this.props.placeholder}
              className="input wmax120 ml12"
              ref={r => {
                if (this.clicked) {
                  r && r.select();
                  this.clicked = false;
                }
              }}
              value={this.state.value}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
            />
            <Button className="input wmax120 ml6" onClick={this.onSave}>
              Save
            </Button>
          </span>
        ) : (
          <Button className="input wmax120 ml12" onClick={this.onClick}>
            Add+
          </Button>
        )}
      </span>
    );
  }
}

const AOIsBlock = ({ data, activeAoiId, removeAoi }) => (
  <BlockMarkup>
    <span>
      <span
        className={`${activeAoiId === data.getIn(['id']) ? 'txt-bold' : ''}`}
      >
        {data.getIn(['properties', 'name'])}
        {activeAoiId === data.getIn(['id']) ? '*' : ''}
      </span>
      <span className="txt-em color-gray pl6">({data.getIn(['id'])})</span>
    </span>
    <span>
      <Link
        className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
        to={{
          search: `aoi=${data.getIn(['id'])}`,
          pathname: `${BASE_PATH}/filters`
        }}
      >
        {activeAoiId === data.getIn(['id']) ? 'Active' : 'Load'}
      </Link>
      <Button className="mr3" onClick={() => removeAoi(data.getIn(['id']))}>
        Remove
      </Button>
      <CustomURL
        href={`${API_URL}/aoi/${data.getIn(['id'])}/changesets/feed/`}
        className="mr3"
        iconName="rss"
      />
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
  aoiId: ?string,
  token: string,
  data: Map<string, any>,
  location: Object,
  filters: filtersType,
  userDetails: Map<string, any>,
  applyFilters: (filtersType, path?: string) => mixed, // base
  reloadData: () => any,
  logUserOut: () => any,
  push: any => any,
  modal: any => any
};
class SavedFilters extends React.PureComponent<any, propsType, any> {
  createAOIPromise;
  state = {
    userValues: null
  };
  componentWillUnmount() {
    this.createAOIPromise && this.createAOIPromise.cancel();
  }

  addToWatchList = ({ username, uid }: { username: string, uid: string }) => {
    if (!username || !uid) return;
    this.props.addToWatchlist({ username, uid });
  };
  removeFromWatchList = (uid: number) => {
    if (!uid) return;
    this.props.removeFromWatchlist(uid);
  };
  addToTrustedList = ({ username }: { username: string }) => {
    if (!username) return;
    this.props.addToTrustedlist(username);
  };
  removeFromTrustedList = (username: string) => {
    if (!username) return;
    this.props.removeFromTrustedlist(username);
  };
  // aoi
  loadAoiId = (aoiId: ?string) => {
    if (!aoiId) return;
    this.props.push({
      ...this.props.location,
      search: `aoi=${aoiId}`,
      path: `${BASE_PATH}/filters`
    });
  };
  createAOI = (name: string) => {
    if (name === '' || !name) return;
    this.createAOIPromise = cancelablePromise(
      createAOI(this.props.token, name, this.props.filters)
    );

    this.createAOIPromise.promise
      .then(r => r && this.loadAoiId(r.id))
      .catch(e => console.error(e));
  };
  removeAOI = (aoiId: string) => {
    if (!aoiId) return;
    deleteAOI(this.props.token, aoiId)
      .then(r => {
        if (aoiId === this.props.aoiId) {
          this.props.applyFilters(new Map(), `${BASE_PATH}/user`);
        } else {
          // const location = {
          //   ...this.props.location, //  clone it
          //   pathname: `${BASE_PATH}/user`
          // };
          this.props.reloadData();
        }
        this.props.modal({
          kind: 'success',
          title: 'Filter Deleted ',
          description: `The ${aoiId} was deleted`
        });
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
  onUserChange = (value: ?Array<Object>) => {
    if (Array.isArray(value) && value.length === 0)
      return this.setState({ userValues: null });
    this.setState({
      userValues: value
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
          title="Saved Filters"
          avatar={this.props.avatar}
        />
        <div className="px30 flex-child  pb60  filters-scroll">
          <div className="flex-parent flex-parent--column align justify--space-between">
            {this.props.token && (
              <div>
                <div className="mt24 mb12">
                  <h2 className="pl12 txt-xl mr6 txt-bold border-b border--gray-light border--1">
                    My saved filters
                  </h2>
                  <ListFortified
                    data={this.props.data.getIn(['aoi', 'results', 'features'], List())}
                    TargetBlock={AOIsBlock}
                    propsToPass={{
                      activeAoiId: this.props.aoiId,
                      removeAoi: this.removeAOI
                    }}
                    SaveComp={<SaveButton onCreate={this.createAOI} />}
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
SavedFilters = withFetchDataSilent(
  (props: propsType) => ({
    aoi: cancelablePromise(fetchAllAOIs(props.token))
  }),
  (nextProps: propsType, props: propsType) => true,
  SavedFilters
);

SavedFilters = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    filters: state.filters.get('filters'),
    oAuthToken: state.auth.get('oAuthToken'),
    token: state.auth.get('token'),
    userDetails: state.auth.getIn(['userDetails'], Map()),
    avatar: state.auth.getIn(['userDetails', 'avatar']),
    aoiId: state.filters.getIn(['aoi', 'id'], null)
  }),
  {
    applyFilters,
    logUserOut,
    modal,
    push
  }
)(SavedFilters);

export { SavedFilters };
