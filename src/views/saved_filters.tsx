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
import { API_URL } from '../config';

interface SaveButtonProps {
  onCreate: (value: string) => void;
  placeholder?: string;
}

interface SaveButtonState {
  editing: boolean;
  value?: string;
}

class SaveButton extends React.PureComponent<SaveButtonProps, SaveButtonState> {
  constructor(props: SaveButtonProps) {
    super(props);
    this.state = {
      editing: false,
    };
  }
  ref: any;
  clicked = false;
  onClick = (event) => {
    this.clicked = true;
    this.setState({ editing: true });
  };
  onChange = (event: any) => {
    this.setState({ value: event.target.value });
  };
  onKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.setState({
        editing: false,
      });
      if (this.state.value) {
        this.props.onCreate(this.state.value);
      }
    } else if (event.keyCode === 27) {
      this.setState({
        editing: false,
      });
      this.clicked = false;
    }
  };

  onSave = (event) => {
    this.setState({
      editing: false,
    });
    if (this.state.value) {
      this.props.onCreate(this.state.value);
    }
  };

  render() {
    return (
      <span>
        {this.state.editing ? (
          <span className="flex-parent flex-parent--row ">
            <input
              placeholder={this.props.placeholder}
              className="input wmax120 ml12"
              ref={(r) => {
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
          <Button className="input wmax120 ml12 mt12" onClick={this.onClick}>
            Save Filter
          </Button>
        )}
      </span>
    );
  }
}

const AOIsBlock = ({ data, activeAoiId, removeAoi }) => (
  <BlockMarkup>
    <Link
      className="mx3"
      to={{
        search: `aoi=${data.getIn(['id'])}`,
        pathname: '/filters',
      }}
    >
      <span className="txt-bold">
        {data.getIn(['properties', 'name'])}
        {activeAoiId === data.getIn(['id']) && (
          <span className="ml12 btn btn--s px6 py0 bg-darken25 events-none">
            Active
          </span>
        )}
      </span>
    </Link>
    <span>
      <CustomURL
        href={`${API_URL}/aoi/${data.getIn(['id'])}/changesets/feed/`}
        className="mr3"
        iconName="rss"
      >
        RSS Feed
      </CustomURL>
      <Button
        className="mr3 bg-transparent border--0"
        onClick={() => removeAoi(data.getIn(['id']))}
      >
        <svg className={'icon txt-m mb3 inline-block align-middle color-gray'}>
          <use xlinkHref="#icon-trash" />
        </svg>
        Delete
      </Button>
    </span>
  </BlockMarkup>
);

const ListFortified = ({
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
  aoiId: string | undefined | null;
  token: string;
  data: Map<string, any>;
  location: any;
  filters: filtersType;
  userDetails: Map<string, any>;
  applyFilters: (a: filtersType, path?: string) => unknown; // base;
  reloadData: () => any;
  logUserOut: () => any;
  push: (a: any) => any;
  modal: (a: any) => any;
  addToWatchlist?: (payload: { username: string; uid: string }) => any;
  removeFromWatchlist?: (uid: number) => any;
  addToTrustedlist?: (username: string) => any;
  removeFromTrustedlist?: (username: string) => any;
};

class _SavedFilters extends React.PureComponent<propsType, any> {
  createAOIPromise;
  state = {
    userValues: null,
  };
  componentWillUnmount() {
    this.createAOIPromise && this.createAOIPromise.cancel();
  }

  addToWatchList = ({ username, uid }: { username: string; uid: string }) => {
    if (!username || !uid) return;
    this.props.addToWatchlist?.({ username, uid });
  };
  removeFromWatchList = (uid: number) => {
    if (!uid) return;
    this.props.removeFromWatchlist?.(uid);
  };
  addToTrustedList = ({ username }: { username: string }) => {
    if (!username) return;
    this.props.addToTrustedlist?.(username);
  };
  removeFromTrustedList = (username: string) => {
    if (!username) return;
    this.props.removeFromTrustedlist?.(username);
  };
  // aoi
  loadAoiId = (aoiId?: string | null) => {
    if (!aoiId) return;
    this.props.push({
      ...this.props.location,
      search: `aoi=${aoiId}`,
      path: '/filters',
    });
  };
  createAOI = (name: string) => {
    if (name === '' || !name) return;
    this.createAOIPromise = cancelablePromise(
      createAOI(this.props.token, name, this.props.filters)
    );

    this.createAOIPromise.promise
      .then((r) => r && this.loadAoiId(r.id))
      .catch((e) => console.error(e));
  };
  removeAOI = (aoiId: string) => {
    if (!aoiId) return;
    deleteAOI(this.props.token, aoiId)
      .then((r) => {
        if (aoiId === this.props.aoiId) {
          this.props.applyFilters(Map(), '/user');
        } else {
          // const location = {
          //   ...this.props.location, //  clone it
          //   pathname: '/user'
          // };
          this.props.reloadData();
        }
        this.props.modal({
          kind: 'success',
          title: 'Filter Deleted ',
          description: `The ${aoiId} was deleted`,
        });
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
  onUserChange = (value?: Array<any> | null) => {
    if (Array.isArray(value) && value.length === 0)
      return this.setState({ userValues: null });
    this.setState({
      userValues: value,
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
                  <ListFortified
                    data={this.props.data.getIn(['aoi', 'features'], List())}
                    TargetBlock={AOIsBlock}
                    propsToPass={{
                      activeAoiId: this.props.aoiId,
                      removeAoi: this.removeAOI,
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
const SavedFiltersWithData = withFetchDataSilent(
  (props: propsType) => ({
    aoi: cancelablePromise(fetchAllAOIs(props.token)),
  }),
  (nextProps: propsType, props: propsType) => true,
  _SavedFilters
);

const SavedFilters = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    filters: state.filters.get('filters'),
    oAuthToken: state.auth.get('oAuthToken'),
    token: state.auth.get('token'),
    userDetails: state.auth.getIn(['userDetails'], Map()),
    avatar: state.auth.getIn(['userDetails', 'avatar']),
    aoiId: state.aoi.getIn(['aoi', 'id'], null),
  }),
  {
    applyFilters,
    logUserOut,
    modal,
    push,
  }
)(SavedFiltersWithData);

export { SavedFilters };
