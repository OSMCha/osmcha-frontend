import { List, Map } from "immutable";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { push } from "redux-first-history";
import { Button } from "../components/button";
import { SecondaryPagesHeader } from "../components/secondary_pages_header";
import { BlockMarkup } from "../components/user/block_markup";
import { SaveUser } from "../components/user/save_user";
import type { RootStateType } from "../store";
import { logUserOut } from "../store/auth_actions";
import { modal } from "../store/modal_actions";
import {
  addToTrustedlist,
  removeFromTrustedlist,
} from "../store/trustedlist_actions";
import { withRouter } from "../utils/withRouter";
import { getObjAsQueryParam, isMobile } from "../utils";

const TrustedListBlock = ({ data, removeFromTrustedList }) => (
  <BlockMarkup>
    <span>
      <span>{data}</span>
    </span>
    <span>
      <Link
        className="mx3 btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition"
        to={{
          search: getObjAsQueryParam("filters", {
            users: [
              {
                label: data,
                value: data,
              },
            ],
          }),
        }}
      >
        Changesets
      </Link>
      <Button
        className="mr3 bg-transparent border--0"
        onClick={() => removeFromTrustedList(data)}
      >
        <svg className={"icon txt-m mb3 inline-block align-middle"}>
          <use xlinkHref="#icon-trash" />
        </svg>
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
  trustedList: Map<string, any>;
  addToTrustedlist: (a: string) => void;
  removeFromTrustedlist: (a: string) => void;
};

class _TrustedUsers extends React.PureComponent<propsType, any> {
  state = {
    userValues: null,
  };
  addToTrustedList = ({ username }: { username: string }) => {
    if (!username) return;
    this.props.addToTrustedlist(username);
  };
  removeFromTrustedList = (username: string) => {
    if (!username) return;
    this.props.removeFromTrustedlist(username);
  };
  onUserChange = (value?: Array<any> | null) => {
    if (Array.isArray(value) && value.length === 0)
      return this.setState({ userValues: null });
    this.setState({
      userValues: value,
    });
  };

  render() {
    let trustedUsers = this.props.trustedList ? this.props.trustedList : List();
    trustedUsers = trustedUsers.sortBy(
      (a) => a,
      (a: string, b: string) => a.localeCompare(b),
    ) as List<any>;
    const mobile = isMobile();

    return (
      <div
        className={`flex-parent flex-parent--column changesets-filters bg-white${
          mobile ? " viewport-full" : ""
        }`}
      >
        <SecondaryPagesHeader
          title="Trusted Users"
          avatar={this.props.avatar}
        />
        <div className="px30 flex-child  pb60  filters-scroll">
          <div className="flex-parent flex-parent--column align justify--space-between">
            {this.props.token && (
              <div>
                <div className="mt24 mb12">
                  <ListFortified
                    onAdd={() => {}}
                    onRemove={() => {}}
                    data={trustedUsers}
                    TargetBlock={TrustedListBlock}
                    propsToPass={{
                      removeFromTrustedList: this.removeFromTrustedList,
                    }}
                    SaveComp={<SaveUser onCreate={this.addToTrustedList} />}
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

const TrustedUsers = withRouter(connect((state: RootStateType, props: any) => ({
    location: props.location,
    trustedList: state.trustedlist.get("trustedlist"),
    oAuthToken: state.auth.get("oAuthToken"),
    token: state.auth.get("token"),
    userDetails: state.auth.getIn(["userDetails"], Map()),
    avatar: state.auth.getIn(["userDetails", "avatar"]),
  }),
  {
    logUserOut,
    modal,
    push,
    addToTrustedlist,
    removeFromTrustedlist,
  },
)(_TrustedUsers));

export { TrustedUsers };
